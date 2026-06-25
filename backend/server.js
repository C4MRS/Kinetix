import express from "express";
import mongoose from "mongoose";

import dotenv from "dotenv";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import path from "path";
import { fileURLToPath } from "url";

import session from "express-session";
import MongoStore from "connect-mongo";

import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import basketRoutes from "./routes/basket.js";
import searchRoutes from "./routes/search.js";
import hybridRoutes from "./routes/hybrid.js";

import { seedProductsIfEmpty } from "./scripts/seedProducts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not defined");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is not defined");
}

const app = express();

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.set("trust proxy", 1);
}

// Permette al frontend di inviare e ricevere il cookie di sessione
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

// Configurazione della sessione
app.use(
  session({
    name: "kinetix.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),

    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

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
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "kinetix.sid",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "routes", "*.js"),
    path.join(__dirname, "server.js"),
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// --- SWAGGER ---

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/basket", basketRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/hybrid", hybridRoutes);

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
