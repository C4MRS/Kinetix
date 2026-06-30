/**
 * AI SCORE = custom smart ranking
 * - tag match
 * - keyword match
 * - semantic boost
 */

export const computeAIScore = (product, tags) => {
	if (!tags || tags.length === 0) return 0;

	let score = 0;

	for (const tag of tags) {
		if (product.tags.includes(tag)) {
			score += 10; // strong match
		}

		if (product.name.toLowerCase().includes(tag)) {
			score += 6;
		}

		if (product.description.toLowerCase().includes(tag)) {
			score += 3;
		}
	}

	return score;
};
