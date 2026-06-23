import Product from "../models/product.js";

/**
 * 1. MATCH BASED ON TAGS (MongoDB)
 */
export const matchByTags = async (tags = []) => {
	if (!tags.length) return [];

	return await Product.find({
		tags: { $in: tags },
	}).limit(20);
};

/**
 * 2. FALLBACK MEILISEARCH
 */
export const matchByMeili = async (query, meili) => {
	try {
		const index = meili.index("products");
		const result = await index.search(query, { limit: 20 });
		return result.hits || [];
	} catch (err) {
		return [];
	}
};
