import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB connected"));

app.get("/", (req, res) => {
	res.send("API actived 🚀");
});

app.listen(3001, () => {
	console.log("Server running on port 3001");
});
