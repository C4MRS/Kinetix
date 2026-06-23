import express from "express";
import { hybridSearch } from "../services/hybridEngine.js";

const router = express.Router();

router.post("/", async (req, res) => {
	try {
		const { text, imageUrl } = req.body;

		const result = await hybridSearch({ text, imageUrl });

		res.json(result);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
