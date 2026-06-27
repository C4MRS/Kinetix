import express from "express";

import {
  createBasketItem,
  getBasketItems,
  updateBasketItem,
  deleteBasketItem,
} from "../controllers/basketController.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();
router.use(requireAuth);

/**
 * @openapi
 * /api/basket:
 *   get:
 *     summary: Get the authenticated user's basket
 *     tags:
 *       - Basket
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Basket items retrieved successfully.
 *       401:
 *         description: User not authenticated.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getBasketItems);

/**
 * @openapi
 * /api/basket:
 *   post:
 *     summary: Add a product to the basket
 *     description: Creates a basket item or increases its quantity by one.
 *     tags:
 *       - Basket
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "665f1c2b8f1a2c0012ab3456"
 *     responses:
 *       201:
 *         description: Product added to basket successfully.
 *       400:
 *         description: Invalid or missing product ID.
 *       401:
 *         description: User not authenticated.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createBasketItem);

/**
 * @openapi
 * /api/basket/{productId}:
 *   patch:
 *     summary: Update a basket item quantity
 *     tags:
 *       - Basket
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Basket item updated successfully.
 *       400:
 *         description: Invalid quantity or product ID.
 *       401:
 *         description: User not authenticated.
 *       404:
 *         description: Basket item not found.
 *       500:
 *         description: Internal server error.
 */
router.patch("/:productId", updateBasketItem);

/**
 * @openapi
 * /api/basket/{productId}:
 *   delete:
 *     summary: Remove a product from the basket
 *     tags:
 *       - Basket
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Basket item deleted successfully.
 *       400:
 *         description: Invalid product ID.
 *       401:
 *         description: User not authenticated.
 *       404:
 *         description: Basket item not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:productId", deleteBasketItem);

export default router;
