import express from "express";
import { getProducts, addProduct } from "../controllers/productController.js";

const router = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Get the list of all products
 *     tags:
 *       - Products
 *     responses:
 *       '200':
 *         description: List of products successfully recovered
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   imageURL:
 *                     type: string
 *       '500':
 *         description: Error within server
 *
 *   post:
 *     summary: Create new product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - imageURL
 *             properties:
 *               name:
 *                 type: string
 *                 example: Racchetta da Tennis Pro
 *               description:
 *                 type: string
 *                 example: Racchetta leggera per giocatori intermedi.
 *               price:
 *                 type: number
 *                 example: 40
 *               imageURL:
 *                 type: string
 *                 example: https://placehold.co/300x200?text=Racchetta+Tennis
 *     responses:
 *       '201':
 *         description: Product successfully created
 *       '400':
 *         description: Input data is invalid
 *       '500':
 *         description: Error within server
 */

router.route("/").get(getProducts).post(addProduct);

export default router;
