import express from "express";
import Product from "../models/product.js";
import { hybridSearch } from "../services/hybridEngine.js";

const router = express.Router();

/**
 * @openapi
 * /api/search:
 *   get:
 *     summary: Hybrid Search Gateway
 *     description: Executes a multimodal and cognitive search using Azure Language Intent, Azure Computer Vision (for images), and falls back to Meilisearch/MongoDB tags matching. If both parameters are empty, returns all products.
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         description: The text search query or natural language intent (e.g., "I want to play tennis").
 *         example: "I need some heavy weights"
 *       - in: query
 *         name: imageUrl
 *         required: false
 *         schema:
 *           type: string
 *         description: A public internet URL of an image to analyze via Azure Vision.
 *         example: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png"
 *     responses:
 *       '200':
 *         description: Search executed successfully. Returns an array of matched products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "65f2c1234567890abcdef123"
 *                   name:
 *                     type: string
 *                     example: "Pro Tennis Racket"
 *                   description:
 *                     type: string
 *                     example: "Lightweight racket for intermediate players."
 *                   price:
 *                     type: number
 *                     example: 40
 *                   imageURL:
 *                     type: string
 *                     example: "https://placehold.co/300x200?text=Racchetta+Tennis"
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example:
 *                       - tennis
 *                       - racket
 *                       - outdoor
 *       '500':
 *         description: Internal server error or gateway execution failure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Search error"
 *                 error:
 *                   type: string
 *                   example: "Azure client connection timed out."
 */
router.get("/", async (req, res) => {
	try {
		const q = req.query.q || "";
		const imageUrl = req.query.imageUrl || null;

		// 1. If query empty and no image, return all products
		if (q.trim() === "" && !imageUrl) {
			const products = await Product.find({});
			return res.json(products);
		}

		// 2. Hybrid Engine (Azure Intent + Meilisearch Fallback + MongoDB Tags Match)
		const searchResult = await hybridSearch({
			text: q,
			imageUrl: imageUrl,
		});

		// 3. Return products found by hybrid engine
		return res.json(searchResult.products);
	} catch (error) {
		console.error("Errore globale nella rotta di ricerca:", error);
		return res
			.status(500)
			.json({ message: "Search error", error: error.message });
	}
});

export default router;
