import { meili } from "../config/meilisearch.js";
import Product from "../models/product.js";

export async function initMeilisearch() {
	try {
		const index = meili.index("products");

		await index.updateSettings({
			searchableAttributes: ["name", "description", "tags"],
			filterableAttributes: ["tags", "price"],
			displayedAttributes: ["name", "description", "price", "imageURL", "tags"],
		});

		console.log("Meilisearch settings updated successfully");

		const products = await Product.find({});

		const docs = products.map((p) => ({
			id: p._id.toString(),
			name: p.name,
			description: p.description,
			price: p.price,
			imageURL: p.imageURL,
			tags: p.tags,
		}));

		const task = await index.addDocuments(docs);

		console.log("Indexed products: ", task.taskUid);
	} catch (err) {
		console.error("Meili init error: ", err);
	}
}

initMeilisearch().catch((err) => {
	console.error("Meilisearch init failed:", err);
});
