import { randomBytes } from "node:crypto";

import { microsoftClient } from "../config/microsoftAuth.js";

// Microsoft Entra ID delegated permission exposed by Kinetix-API.
const JWT_TEST_SCOPE =
	"api://09a7a31c-af50-48c8-8513-304d98ab883e/access_as_user";

// This redirect URI is already registered in Microsoft Entra ID.
const JWT_TEST_REDIRECT_URI =
	"https://kinetix-apimanagement.azure-api.net/kinetix/api/auth/microsoft/jwt-test/callback";

// APIM operation protected by the validate-jwt policy.
const JWT_TEST_API_URL =
	"https://kinetix-apimanagement.azure-api.net/kinetix/api/jwt-test";

// Save the OAuth state and PKCE verifier before redirecting.
const saveSession = (session) =>
	new Promise((resolve, reject) => {
		session.save((error) => {
			if (error) reject(error);
			else resolve();
		});
	});

// Start a dedicated OAuth flow without changing the normal login.
export const startMicrosoftJwtTest = async (req, res) => {
	try {
		const state = randomBytes(32).toString("hex");

		// Use the same PKCE mechanism as the existing Microsoft login.
		const pkceCodes = await microsoftClient.cryptoProvider.generatePkceCodes();

		// Store temporary values separately from the login flow.
		req.session.microsoftJwtTestState = state;
		req.session.microsoftJwtTestVerifier = pkceCodes.verifier;

		await saveSession(req.session);

		const authorizationUrl = await microsoftClient.getAuthCodeUrl({
			scopes: [JWT_TEST_SCOPE],
			redirectUri: JWT_TEST_REDIRECT_URI,
			state,
			responseMode: "query",
			codeChallenge: pkceCodes.challenge,
			codeChallengeMethod: "S256",
			prompt: "consent",
		});

		return res.redirect(authorizationUrl);
	} catch (error) {
		console.error("JWT test initialization failed");

		return res.status(500).json({
			message: "Unable to start Microsoft JWT test",
		});
	}
};

// Exchange the authorization code and ask APIM to validate the token.
export const microsoftJwtTestCallback = async (req, res) => {
	try {
		const { code, state, error } = req.query;

		if (error) {
			return res.status(403).json({
				message: "Microsoft authorization was denied",
			});
		}

		if (
			typeof code !== "string" ||
			typeof state !== "string" ||
			!req.session?.microsoftJwtTestState ||
			state !== req.session.microsoftJwtTestState ||
			!req.session.microsoftJwtTestVerifier
		) {
			return res.status(400).json({
				message: "Invalid OAuth state or missing PKCE verifier",
			});
		}

		const codeVerifier = req.session.microsoftJwtTestVerifier;

		// One-time OAuth parameters must not be reused.
		delete req.session.microsoftJwtTestState;
		delete req.session.microsoftJwtTestVerifier;

		await saveSession(req.session);

		const tokenResponse = await microsoftClient.acquireTokenByCode({
			code,
			scopes: [JWT_TEST_SCOPE],
			redirectUri: JWT_TEST_REDIRECT_URI,
			codeVerifier,
		});

		const accessToken = tokenResponse?.accessToken;

		if (!accessToken) {
			return res.status(401).json({
				message: "Microsoft did not return an access token",
			});
		}

		// The token stays on the backend and is never sent to the browser.
		const apimResponse = await fetch(JWT_TEST_API_URL, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			signal: AbortSignal.timeout(15000),
		});

		if (!apimResponse.ok) {
			return res.status(502).json({
				message: "APIM rejected the Microsoft access token",
				apimStatus: apimResponse.status,
			});
		}

		return res.status(200).json({
			message: "JWT successfully validated by Azure API Management",
			apimStatus: apimResponse.status,
		});
	} catch (error) {
		// Never log authorization codes, access tokens or client secrets.
		console.error("Microsoft JWT validation test failed");

		return res.status(500).json({
			message: "JWT validation test failed",
		});
	}
};
