import mongoose from "mongoose";

import Product from "../models/product.js";
import Basket from "../models/basket.js";

import { meili } from "../config/meilisearch.js";
import { extractIntent } from "../services/intentService.js";
import { extractImageTags } from "../services/imageService.js";
import { uploadProductImage } from "../services/blobService.js";

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find().sort({
			createdAt: -1,
		});

		return res.status(200).json({
			products,
		});
	} catch (error) {
		console.error("Get products error:", error);

		return res.status(500).json({
			message: "Unable to retrieve products",
		});
	}
};

export const addProduct = async (req, res) => {
	try {
		const { name, description, price } = req.body;
		let finalImageURL = req.body?.imageURL ? req.body.imageURL.trim() : "";

		// 1. Se l'utente ha caricato un file immagine, lo carichiamo su Azure Blob Storage
		if (req.file) {
			finalImageURL = await uploadProductImage(req.file);
		}

		// 2. Controllo presenza campi obbligatori
		if (!finalImageURL || !name || !description || price === undefined) {
			return res.status(400).json({
				message: "Every field is required (provide an image file or imageURL).",
			});
		}

		const numericPrice = Number(price);

		if (!Number.isFinite(numericPrice) || numericPrice < 0) {
			return res.status(400).json({
				message: "Price must be a valid non-negative number.",
			});
		}

		const normalizedName = name.trim();
		const normalizedDescription = description.trim();

		if (!normalizedName || !normalizedDescription) {
			return res.status(400).json({
				message: "Every field is required.",
			});
		}

		console.log(`Auto-Tagging Pipeline for: "${normalizedName}"...`);

		// Extract Text-based Intent Tags
		const textTags = await extractIntent(
			`${normalizedName}. ${normalizedDescription}`,
		);

		// Extract Vision-based Image Tags using the Azure Blob Storage URL
		let imageTags = [];

		if (
			!finalImageURL.includes("localhost") &&
			!finalImageURL.includes("127.0.0.1")
		) {
			imageTags = await extractImageTags(finalImageURL);
		} else {
			console.warn("Local URL. Azure Vision skipped to avoid issues.");
		}

		const aiGeneratedTags = [
			...new Set(
				[...textTags, ...imageTags]
					.filter((tag) => typeof tag === "string")
					.map((tag) => tag.trim().toLowerCase())
					.filter((tag) => tag.length > 2),
			),
		];

		if (aiGeneratedTags.length === 0) {
			const fallbackTags = normalizedName
				.toLowerCase()
				.split(/\s+/)
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 2);

			aiGeneratedTags.push(...new Set(["sport", ...fallbackTags]));
		}

		console.log("AI-Generated Tags:", aiGeneratedTags);

		// 3. Creazione del prodotto nel database MongoDB
		const newProduct = await Product.create({
			imageURL: finalImageURL,
			name: normalizedName,
			description: normalizedDescription,
			price: numericPrice,
			tags: aiGeneratedTags,
		});

		// 4. Sincronizzazione con Meilisearch
		try {
			const index = meili.index("products");

			await index.addDocuments([
				{
					id: newProduct._id.toString(),
					imageURL: newProduct.imageURL,
					name: newProduct.name,
					description: newProduct.description,
					price: newProduct.price,
					tags: newProduct.tags,
				},
			]);

			console.log("Meilisearch synced.");
		} catch (meiliError) {
			console.warn("Failed sync Meilisearch:", meiliError.message);
		}

		return res.status(201).json({
			message: "New product created.",
			product: newProduct,
		});
	} catch (error) {
		console.error("Product creation error:", error);

		return res.status(400).json({
			message: "Error during product creation.",
			error: error.message,
		});
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { productId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(productId)) {
			return res.status(400).json({
				message: "Invalid product ID",
			});
		}

		const existingProduct = await Product.findById(productId);

		if (!existingProduct) {
			return res.status(404).json({
				message: "Product not found",
			});
		}

		await Product.findByIdAndDelete(productId);

		await Basket.deleteMany({
			productId,
		});

		try {
			const index = meili.index("products");

			const task = await index.deleteDocument(productId);

			if (task?.taskUid !== undefined) {
				await meili.waitForTask(task.taskUid);
			}

			console.log("Product removed from Meilisearch.");
		} catch (meiliError) {
			console.warn(
				"Failed to remove product from Meilisearch:",
				meiliError.message,
			);
		}

		return res.status(200).json({
			message: "Product deleted successfully",
		});
	} catch (error) {
		console.error("Delete product error:", error);

		return res.status(500).json({
			message: "Unable to delete product",
		});
	}
};
