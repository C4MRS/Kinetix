import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.js";

dotenv.config();

try {
	await mongoose.connect(process.env.MONGO_URI);

	const count = await Product.countDocuments();

	console.log("Products:", count);

	if (count === 0) {
		console.error("Database is empty");
		process.exit(1);
	}

	console.log("Database OK");

	process.exit(0);
} catch (err) {
	console.error(err);
	process.exit(1);
}
