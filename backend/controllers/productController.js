import product from "../models/product.js";

export const getProducts = async (req, res) => {
	try {
		const products = await product.find({});
		return res.status(200).json(products);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error during GET Products", error: error.message });
	}
};

export const addProduct = async (req, res) => {
	try {
		const { imageURL, name, description, price, tags } = req.body;
		if (!imageURL || !name || !description || !tags || price === undefined) {
			return res.status(400).json({
				message: "Every field is required.",
			});
		}
		const newProduct = await product.create({
			imageURL,
			name,
			description,
			price,
			tags: tags || [],
		});
		return res
			.status(201)
			.json({ message: "New product created.", product: newProduct });
	} catch (error) {
		return res
			.status(400)
			.json({ message: "Every field is required.", error: error.message });
	}
};
