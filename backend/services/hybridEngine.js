import { extractSemanticTags } from "./azureSemantic.js";
import { extractImageTags } from "./imageService.js";
import { matchByTags, matchByMeili } from "./intentService.js";
import { meili } from "../config/meilisearch.js";

/**
 * TEXT + IMAGE → UNIFIED INTENT
 */
export const hybridSearch = async ({ text, imageUrl }) => {
	let tags = [];

	// 1. TEXT SEMANTIC
	if (text) {
		const textTags = await extractSemanticTags(text);
		tags.push(...textTags);
	}

	// 2. IMAGE SEMANTIC
	if (imageUrl) {
		const imageTags = await extractImageTags(imageUrl);
		tags.push(...imageTags);
	}

	// 3. deduplicate tags
	tags = [...new Set(tags)];

	// 4. DB MATCH (PRIMARY)
	let products = await matchByTags(tags);

	// 5. fallback Meilisearch
	if (!products.length && text) {
		products = await matchByMeili(text, meili);
	}

	return {
		tags,
		products,
	};
};
