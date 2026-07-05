import express from "express";

const router = express.Router();

router.get("/", (_, res) => {
	res.json({
		status: "ok",
		service: "backend",
		timestamp: new Date().toISOString(),
	});
});

export default router;
