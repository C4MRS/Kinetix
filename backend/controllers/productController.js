import product from "../models/product.js";
import { meili } from "../config/meilisearch.js";
import { extractIntent } from "../services/intentService.js";
import { extractImageTags } from "../services/imageService.js";

export const getProducts = async (req, res) => {
	try {
		const products = await product.find({});
		return res.status(200).json(products);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error during GET Products", error: error.message });
	}
};

export const addProduct = async (req, res) => {
	try {
		const { imageURL, name, description, price } = req.body;

		if (!imageURL || !name || !description || price === undefined) {
			return res.status(400).json({
				message: "Every field is required.",
			});
		}

		console.log(`✨ Auto-Tagging Pipeline for: "${name}"...`);

		// 1. Extract tags from text via Azure AI Language
		const textTags = await extractIntent(`${name}. ${description}`);

		// 2. Extract tags from Image via Azure Vision
		let imageTags = [];
		if (
			imageURL &&
			!imageURL.includes("localhost") &&
			!imageURL.includes("127.0.0.1")
		) {
			imageTags = await extractImageTags(imageURL);
		} else {
			console.warn("⚠️ Local URL. Azure Vision skipped to avoid issues.");
		}

		// 3. Merge tags extracted and removed duplicated
		const aiGeneratedTags = [
			...new Set(
				[...textTags, ...imageTags].map((t) => t.toLowerCase().trim()),
			),
		].filter((t) => t.length > 2); // Remove empty strings and tags too short

		// Fallback if Azure fails
		if (aiGeneratedTags.length === 0) {
			aiGeneratedTags.push("sport", ...name.toLowerCase().split(" "));
		}

		console.log("✅ AI-Generated Tags:", aiGeneratedTags);

		// 4. New product on MongoDB with AI-Generated Tags
		const newProduct = await product.create({
			imageURL,
			name,
			description,
			price,
			tags: aiGeneratedTags,
		});

		// 5. Sync Meilisearch index
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
			console.log("📦 Meilisearch synced.");
		} catch (meiliError) {
			console.warn("⚠️ Failed sync Meilisearch:", meiliError.message);
		}

		return res
			.status(201)
			.json({ message: "New product created.", product: newProduct });
	} catch (error) {
		return res.status(400).json({
			message: "Error during product creation.",
			error: error.message,
		});
	}
};
