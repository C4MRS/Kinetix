import { extractIntent } from "./intentService.js";
import { extractImageTags } from "./imageService.js";
import { matchByTags } from "./matchService.js";
import { meili } from "../config/meilisearch.js";

/**
 * TEXT + IMAGE → FULL INTENT ENGINE
 * (AI + tags + fallback search)
 */
export const hybridSearch = async ({ text, imageUrl }) => {
	let tags = [];

	// 1. TEXT INTENT (Azure)
	if (text) {
		const textTags = await extractIntent(text);
		console.log("🚀 AZURE EXTRACTED TAGS FOR INTENT:", textTags); //TESTING INTENT TAGS
		tags.push(...textTags);
	}

	// 2. IMAGE INTENT (Azure Vision)
	if (imageUrl) {
		const imageTags = await extractImageTags(imageUrl);
		tags.push(...imageTags);
	}

	// 3. deduplicate + normalize
	tags = [...new Set(tags.map((t) => t.toLowerCase()))];

	let products = [];

	// 4. PRIMARY MATCH (MongoDB / tag-based)
	if (tags.length > 0) {
		products = await matchByTags(tags);
	}

	// 5. FALLBACK 1: Meilisearch (ENHANCED QUERY)
	if (!products.length && (text || tags.length)) {
		const index = meili.index("products");

		const query = tags.length > 0 ? tags.join(" ") : text;

		const result = await index.search(query, {
			limit: 12,
		});

		products = result.hits;
	}

	return {
		tags,
		products,
	};
};
