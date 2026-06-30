import Product from "../models/product.js";
import { computeAIScore } from "./aiScoreService.js";

/**
 * SMART MATCHING
 */
export const matchByTags = async (tags) => {
	const products = await Product.find({});

	const scored = products
		.map((p) => ({
			product: p,
			score: computeAIScore(p, tags),
		}))
		.filter((p) => p.score > 0)
		.sort((a, b) => b.score - a.score);

	return scored.map((s) => s.product);
};
