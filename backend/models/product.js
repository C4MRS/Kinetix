import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		imageURL: { type: String, required: [true, "Image URL is required."] },
		name: { type: String, required: [true, "Name is required."], trim: true },
		description: { type: String, required: [true, "Description is required."] },
		price: {
			type: Number,
			required: [true, "Price is required."],
			min: [0, "Price cannot be negative."],
		},
		tags: {
			type: [String],
			required: [true, "Tags are required."],
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

const product = mongoose.model("Product", productSchema);
export default product;
