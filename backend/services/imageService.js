import axios from "axios";

/**
 * IMAGE → VISUAL TAGS (AZURE VISION 4.0)
 */
export const extractImageTags = async (imageUrl) => {
	try {
		if (!imageUrl) return [];

		if (imageUrl.includes("localhost") || imageUrl.includes("127.0.0.1")) {
			console.warn(
				"⚠️ Azure Vision can't access localhost. Use public URL for test!",
			);
		}

		const response = await axios.post(
			`${process.env.AZURE_VISION_ENDPOINT}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=tags`,
			{ url: imageUrl },
			{
				headers: {
					"Ocp-Apim-Subscription-Key": process.env.AZURE_VISION_KEY,
					"Content-Type": "application/json",
				},
			},
		);

		const tagsRaw =
			response.data?.tagsResult?.values ||
			response.data?.tags?.values ||
			response.data?.tags ||
			[];

		console.log("📸 Azure Vision Raw Tags:", tagsRaw);

		return tagsRaw.map((t) => t.name.toLowerCase());
	} catch (err) {
		console.error(
			"❌ Azure Vision error details:",
			err.response?.data || err.message,
		);
		return [];
	}
};
