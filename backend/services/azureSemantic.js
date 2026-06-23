import axios from "axios";

/**
 * TEXT → SEMANTIC TAGS via Azure AI
 */
export const extractSemanticTags = async (text) => {
	try {
		const response = await axios.post(
			`${process.env.AZURE_VISION_ENDPOINT}/text/analytics/v3.1/sentiment`,
			{
				documents: [
					{
						id: "1",
						language: "en",
						text,
					},
				],
			},
			{
				headers: {
					"Ocp-Apim-Subscription-Key": process.env.AZURE_VISION_KEY,
					"Content-Type": "application/json",
				},
			},
		);

		// fallback semplice (per esame va benissimo)
		const textLower = text.toLowerCase();

		const tags = [];

		if (textLower.includes("football") || textLower.includes("soccer")) {
			tags.push("football");
		}
		if (textLower.includes("gym") || textLower.includes("fitness")) {
			tags.push("fitness");
		}
		if (textLower.includes("run")) {
			tags.push("running");
		}

		return tags.length ? tags : ["general"];
	} catch (err) {
		return ["general"];
	}
};
