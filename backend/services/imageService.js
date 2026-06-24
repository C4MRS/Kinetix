import axios from "axios";

export const extractImageTags = async (imageUrl) => {
	const response = await axios.post(
		`${process.env.AZURE_VISION_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Tags`,
		{ url: imageUrl },
		{
			headers: {
				"Ocp-Apim-Subscription-Key": process.env.AZURE_VISION_KEY,
				"Content-Type": "application/json",
			},
		},
	);

	return response.data.tags.map((t) => t.name.toLowerCase());
};
