import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB connected"));

app.get("/", (req, res) => {
	res.send("API actived 🚀");
});

app.listen(3001, () => {
	console.log("Server running on port 3001");
});
