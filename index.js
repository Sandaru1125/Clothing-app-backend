import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import { publicUserRouter, protectedUserRouter } from "./routers/userRouter.js";
import { publicProductRouter, protectedProductRouter } from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";
import verifyJwt from "./middleware/auth.js";

dotenv.config();

const app = express();

// 1️⃣ CORS for React Native (Expo)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2️⃣ JSON Parser (no need body-parser)
app.use(express.json());

// 3️⃣ MongoDB connection
mongoose
  .connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.log("❌ Database connection failed:", err.message));

// 4️⃣ User routes
app.use("/api/user", publicUserRouter);
app.use("/api/user", verifyJwt, protectedUserRouter);

// 5️⃣ Order routes
app.use("/api/order", verifyJwt, orderRouter);

// 6️⃣ Product routes
app.use("/api/products", publicProductRouter); // Public: GET /api/products and GET /api/products/:id
app.use("/api/product", verifyJwt, protectedProductRouter); // Protected: POST, PUT, DELETE /api/product

// 6️⃣ Health check route
app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

// 7️⃣ Start server
const PORT = process.env.PORT || 4500;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
