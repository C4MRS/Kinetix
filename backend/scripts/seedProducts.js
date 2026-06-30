import Product from "../models/product.js";
import productsDataset from "../data/productsDataset.js";

export const seedProductsIfEmpty = async () => {
	const productsCount = await Product.countDocuments();

	if (productsCount > 0) {
		console.log(
			`Product seed skipped: the collection already contains ${productsCount} product(s).`,
		);
		return;
	}

	const insertedProducts = await Product.insertMany(productsDataset);

	const index = meili.index("products");

	await index.addDocuments(
		products.map((p) => ({
			id: p._id,
			name: p.name,
			description: p.description,
			tags: p.tags,
			price: p.price,
			imageURL: p.imageURL,
		})),
	);

	console.log(
		`Product seed completed: ${insertedProducts.length} products inserted.`,
	);
};
