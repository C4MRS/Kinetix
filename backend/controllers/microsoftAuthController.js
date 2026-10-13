import { randomBytes } from "node:crypto";

import {
	microsoftClient,
	microsoftRedirectUri,
} from "../config/microsoftAuth.js";

import User from "../models/user.js";

const MICROSOFT_SCOPES = ["openid", "profile", "email"];

const GUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Convert callback-based session methods into promises.
const saveSession = (session) =>
	new Promise((resolve, reject) => {
		session.save((error) => {
			if (error) reject(error);
			else resolve();
		});
	});

const regenerateSession = (session) =>
	new Promise((resolve, reject) => {
		session.regenerate((error) => {
			if (error) reject(error);
			else resolve();
		});
	});

// Redirect only to the configured frontend.
const getFrontendUrl = () =>
	(process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");

const redirectToFrontend = (res, status) => {
	const url = new URL("/login", getFrontendUrl());
	url.searchParams.set("microsoft", status);

	return res.redirect(url.toString());
};

// Read a non-empty string claim.
const readClaim = (value) =>
	typeof value === "string" && value.trim() ? value.trim() : null;

// Extract profile names without requiring optional Microsoft claims.
const getMicrosoftProfile = (claims) => {
	const givenName = readClaim(claims.given_name);
	const familyName = readClaim(claims.family_name);
	const displayName = readClaim(claims.name);

	if (givenName || familyName) {
		return {
			name: givenName || displayName || "Microsoft",
			surname: familyName || "User",
		};
	}

	if (displayName) {
		const parts = displayName.split(/\s+/);

		if (parts.length > 1) {
			return {
				name: parts[0],
				surname: parts.slice(1).join(" "),
			};
		}

		return {
			name: displayName,
			surname: "User",
		};
	}

	return {
		name: "Microsoft",
		surname: "User",
	};
};

// Start the Microsoft Entra ID authorization flow.
export const startMicrosoftLogin = async (req, res) => {
	try {
		const state = randomBytes(32).toString("hex");

		// Generate PKCE parameters.
		const pkceCodes = await microsoftClient.cryptoProvider.generatePkceCodes();

		// Save temporary authentication data in the existing session.
		req.session.microsoftAuthState = state;
		req.session.microsoftPkceVerifier = pkceCodes.verifier;

		await saveSession(req.session);

		// Request an authorization code from Microsoft.
		const authorizationUrl = await microsoftClient.getAuthCodeUrl({
			scopes: MICROSOFT_SCOPES,
			redirectUri: microsoftRedirectUri,
			state,
			responseMode: "query",
			codeChallenge: pkceCodes.challenge,
			codeChallengeMethod: "S256",
		});

		return res.redirect(authorizationUrl);
	} catch (error) {
		console.error("Microsoft login initialization failed:", error.message);

		return res.status(500).json({
			message: "Unable to start Microsoft login",
		});
	}
};

// Handle the redirect from Microsoft Entra ID.
export const microsoftCallback = async (req, res) => {
	try {
		const { code, state, error } = req.query;

		// Handle an authentication error returned by Microsoft.
		if (error) {
			console.warn("Microsoft authentication was rejected");
			return redirectToFrontend(res, "failed");
		}

		// Validate the CSRF state and required PKCE verifier.
		if (
			typeof code !== "string" ||
			typeof state !== "string" ||
			!req.session?.microsoftAuthState ||
			state !== req.session.microsoftAuthState ||
			!req.session.microsoftPkceVerifier
		) {
			return res.status(400).json({
				message: "Invalid Microsoft authentication response",
			});
		}

		const codeVerifier = req.session.microsoftPkceVerifier;

		// Remove one-time authentication parameters before token exchange.
		delete req.session.microsoftAuthState;
		delete req.session.microsoftPkceVerifier;

		await saveSession(req.session);

		// Exchange the authorization code using PKCE.
		const tokenResponse = await microsoftClient.acquireTokenByCode({
			code,
			scopes: MICROSOFT_SCOPES,
			redirectUri: microsoftRedirectUri,
			codeVerifier,
		});

		if (!tokenResponse?.idTokenClaims) {
			return res.status(401).json({
				message: "Microsoft identity information is missing",
			});
		}

		// MSAL validates the ID token during the authorization code flow.
		const claims = tokenResponse.idTokenClaims;

		const tenantId = claims.tid;
		const objectId = claims.oid;

		// Require stable Microsoft identity identifiers.
		if (
			typeof tenantId !== "string" ||
			typeof objectId !== "string" ||
			!GUID_REGEX.test(tenantId) ||
			!GUID_REGEX.test(objectId)
		) {
			return res.status(401).json({
				message: "Invalid Microsoft identity",
			});
		}

		// Identify the account using tenant ID and object ID, not email.
		const microsoftId = `${tenantId}:${objectId}`;

		const profile = getMicrosoftProfile(claims);

		let user = await User.findOne({ microsoftId });

		if (!user) {
			// Microsoft email claims are optional and are not treated
			// as verified proof of ownership of an existing Kinetix account.
			const microsoftEmail =
				typeof claims.email === "string"
					? claims.email.trim().toLowerCase()
					: null;

			// Never link a Microsoft identity to an existing account by email.
			if (microsoftEmail) {
				const existingUser = await User.findOne({
					email: microsoftEmail,
				});

				if (existingUser) {
					return redirectToFrontend(res, "email-conflict");
				}
			}

			// Create a Microsoft-only account without a local password.
			// Do not store an unverified email claim.
			try {
				user = await User.create({
					microsoftId,
					name: profile.name,
					surname: profile.surname,
					role: "user",
				});
			} catch (createError) {
				// Handle concurrent first-time logins safely.
				if (createError.code === 11000) {
					user = await User.findOne({ microsoftId });

					if (!user) {
						throw createError;
					}
				} else {
					throw createError;
				}
			}
		} else {
			// Replace fallback names only when Microsoft supplies
			// meaningful profile information.
			const hasProfileName =
				profile.name !== "Microsoft" || profile.surname !== "User";

			const hasFallbackName =
				user.name === "Microsoft" && user.surname === "User";

			if (hasProfileName && hasFallbackName) {
				user.name = profile.name;
				user.surname = profile.surname;
				await user.save();
			}
		}

		// Generate a fresh session ID to prevent session fixation.
		await regenerateSession(req.session);

		// Store only the information required by Kinetix.
		req.session.user = {
			id: user._id.toString(),
			email: user.email ?? null,
			name: user.name,
			surname: user.surname,
			role: user.role,
		};

		await saveSession(req.session);

		// Return to the frontend after successful authentication.
		return res.redirect(`${getFrontendUrl()}/`);
	} catch (error) {
		// Never log authorization codes, tokens, or client secrets.
		console.error("Microsoft callback failed:", error.message);

		return redirectToFrontend(res, "failed");
	}
};
