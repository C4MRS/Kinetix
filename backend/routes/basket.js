import express from "express";
import {
  createBasketItem,
  getBasketItems,
  updateBasketItem,
  deleteBasketItem,
} from "../controllers/basketController.js";

const router = express.Router();

/**
 * @openapi
 * /api/basket:
 *   post:
 *     summary: Add a product to the basket
 *     description: Adds a product to the user's basket. If the product already exists for the same user, the quantity is incremented by 1.
 *     tags:
 *       - Basket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - userEmail
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "665f1c2b8f1a2c0012ab3456"
 *               userEmail:
 *                 type: string
 *                 format: email
 *                 example: mario.rossi@example.com
 *     responses:
 *       201:
 *         description: Product added to basket successfully.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createBasketItem);

/**
 * @openapi
 * /api/basket/{userEmail}:
 *   get:
 *     summary: Get basket items by user email
 *     description: Retrieves all basket items belonging to a specific user.
 *     tags:
 *       - Basket
 *     parameters:
 *       - in: path
 *         name: userEmail
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email of the user.
 *     responses:
 *       200:
 *         description: Basket items retrieved successfully.
 *       400:
 *         description: Invalid or missing user email.
 *       500:
 *         description: Internal server error.
 */
router.get("/:userEmail", getBasketItems);

/**
 * @openapi
 * /api/basket/{userEmail}/{productId}:
 *   patch:
 *     summary: Update basket item quantity
 *     description: Updates the quantity of a basket item by searching with user email and product ID.
 *     tags:
 *       - Basket
 *     parameters:
 *       - in: path
 *         name: userEmail
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email of the user.
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB _id of the product.
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
 *                 type: number
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Basket item updated successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Basket item not found.
 *       500:
 *         description: Internal server error.
 */
router.patch("/:userEmail/:productId", updateBasketItem);

/**
 * @openapi
 * /api/basket/{userEmail}/{productId}:
 *   delete:
 *     summary: Delete a basket item
 *     description: Deletes a basket item by searching with user email and product ID.
 *     tags:
 *       - Basket
 *     parameters:
 *       - in: path
 *         name: userEmail
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email of the user.
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB _id of the product.
 *     responses:
 *       200:
 *         description: Basket item deleted successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Basket item not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:userEmail/:productId", deleteBasketItem);

export default router;
