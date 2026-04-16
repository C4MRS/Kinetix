import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testMongo() {
	console.log("🔍 Testing MongoDB Atlas connection...");

	const start = Date.now();

	try {
		await mongoose.connect(process.env.MONGO_URI);

		const time = Date.now() - start;

		console.log("✅ MongoDB connected");
		console.log(`⏱ Latency: ${time} ms`);

		await mongoose.connection.close();
	} catch (err) {
		console.log("❌ Connection failed", err.message);
	}

	process.exit(0);
}

testMongo();
