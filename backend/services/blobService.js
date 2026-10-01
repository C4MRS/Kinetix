const { BlobServiceClient } = require("@azure/storage-blob");
const path = require("path");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName =
	process.env.AZURE_STORAGE_CONTAINER_NAME || "product-images";

let containerClient = null;

if (connectionString) {
	const blobServiceClient =
		BlobServiceClient.fromConnectionString(connectionString);
	containerClient = blobServiceClient.getContainerClient(containerName);
}

/**
 * Carica un file immagine su Azure Blob Storage
 * @param {Object} file - Oggetto file fornito da Multer (file.buffer, file.originalname, file.mimetype)
 * @returns {Promise<string>} URL pubblico dell'immagine caricata
 */
async function uploadProductImage(file) {
	if (!containerClient) {
		console.warn(
			"⚠️ Azure Blob Storage non configurato. Uso fallback locale/mock.",
		);
		return "https://via.placeholder.com/300";
	}

	// Genera un nome file univoco per evitare sovrascritture
	const blobName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${path.extname(file.originalname)}`;
	const blockBlobClient = containerClient.getBlockBlobClient(blobName);

	// Carica il buffer dell'immagine
	await blockBlobClient.uploadData(file.buffer, {
		blobHTTPHeaders: { blobContentType: file.mimetype },
	});

	return blockBlobClient.url; // Restituisce l'URL pubblico (es. https://kinetixstorage.blob.core.windows.net/product-images/123.jpg)
}

module.exports = { uploadProductImage };
