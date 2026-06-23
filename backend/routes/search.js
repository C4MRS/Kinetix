import express from "express";
import { meili } from "../config/meilisearch.js";
import Product from "../models/product.js";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const q = req.query.q || "";

		// nessuna ricerca => tutti i prodotti
		if (q.trim() === "") {
			const products = await Product.find({});
			return res.json(products);
		}

		try {
			const index = meili.index("products");

			const result = await index.search(q, {
				limit: 12,
			});

			return res.json(result.hits);
		} catch (meiliError) {
			console.warn(
				"Meilisearch unavailable, fallback MongoDB:",
				meiliError.message,
			);

			const products = await Product.find({
				$or: [
					{
						name: {
							$regex: q,
							$options: "i",
						},
					},
					{
						description: {
							$regex: q,
							$options: "i",
						},
					},
				],
			}).limit(12);

			return res.json(products);
		}
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Search error",
		});
	}
});

export default router;
