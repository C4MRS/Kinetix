import express from "express";
import { register, login } from "../controllers/authController.js";

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
 *     description: Authenticates a user by comparing the provided email and password against the database.
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

export default router;
