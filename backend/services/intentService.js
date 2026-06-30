import {
	TextAnalysisClient,
	AzureKeyCredential,
} from "@azure/ai-language-text";

const client = new TextAnalysisClient(
	process.env.AZURE_LANGUAGE_ENDPOINT,
	new AzureKeyCredential(process.env.AZURE_LANGUAGE_KEY),
);

/**
 * INTENT EXTRACTION (KEY PHRASES)
 */
export async function extractIntent(text) {
	try {
		if (!text) return [];

		const result = await client.analyze("KeyPhraseExtraction", [text]);

		const phrases = result?.[0]?.keyPhrases || [];

		return phrases.map((p) => p.toLowerCase());
	} catch (err) {
		console.error("Azure intent error:", err.message);
		return [];
	}
}
