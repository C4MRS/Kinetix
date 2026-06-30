import { meili } from "../config/meilisearch.js";

const index = meili.index("products");

export async function syncProducts(products) {
	try {
		await index.addDocuments(products);

		console.log("✅ Products synced to Meilisearch");
	} catch (error) {
		console.error("❌ Error syncing Meilisearch");

		console.error(error.message);
	}
}

export async function configureMeili() {
	try {
		await index.updateSearchableAttributes([
			"name",
			"description",
			"tags",
			"aiTags",
			"aiCategories",
			"embeddingText",
		]);

		await index.updateFilterableAttributes(["tags", "aiTags", "aiCategories"]);

		console.log("✅ Meilisearch configured");
	} catch (err) {
		console.error(err.message);
	}
}
