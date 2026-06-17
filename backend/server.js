import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import basketRoutes from "./routes/basket.js";
import { seedProductsIfEmpty } from "./scripts/seedProducts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// --- SWAGGER ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kinetix API",
      version: "1.0.0",
      description: "Interactive Documentation for Kinetix",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development Server",
      },
    ],
  },
  apis: [
    path.join(__dirname, "routes", "*.js"),
    path.join(__dirname, "server.js"),
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// --- SWAGGER ---

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/basket", basketRoutes);
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await seedProductsIfEmpty();

    app.listen(3001, () => {
      console.log("Server running on port 3001");
      console.log("Swagger UI available at http://localhost:3001/api-docs");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
