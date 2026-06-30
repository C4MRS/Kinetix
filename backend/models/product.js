import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		imageURL: { type: String, required: true },
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		tags: {
			type: [String],
			required: true,
			default: [],
			index: true,
		},

		// FUTURE AI LAYER
		aiTags: [String],
		aiSummary: String,
	},
	{ timestamps: true },
);

export default mongoose.model("Product", productSchema);
