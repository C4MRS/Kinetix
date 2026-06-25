import express from "express";
import {
  register,
  login,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user profile in MongoDB Atlas and hashes the password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mario
 *               surname:
 *                 type: string
 *                 example: Rossi
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mario.rossi@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Invalid input data.
 *       409:
 *         description: Email already exists.
 *       500:
 *         description: Internal server error.
 */
router.post("/register", register);
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     description: Authenticates the user and creates a persistent session stored in MongoDB.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mario.rossi@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *     responses:
 *       200:
 *         description: Login successful. Returns user data.
 *       400:
 *         description: Missing email or password in the request.
 *       401:
 *         description: Invalid email or password (Authentication failed).
 *       500:
 *         description: Internal server error.
 */
router.post("/login", login);
/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get the current authenticated user
 *     description: Returns the user stored in the current session.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current authenticated user returned successfully.
 *       401:
 *         description: User not authenticated.
 *       500:
 *         description: Internal server error.
 */
router.get("/me", requireAuth, getCurrentUser);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     description: Destroys the current user session and clears the session cookie.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful.
 *       401:
 *         description: User not authenticated.
 *       500:
 *         description: Unable to destroy the session.
 */
router.post("/logout", requireAuth, logout);

export default router;
