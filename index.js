import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
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

// 4️⃣ PUBLIC ROUTES — No JWT needed
app.use("/api/user", userRouter);

// 5️⃣ PROTECTED ROUTES — JWT required
app.use("/api/product", verifyJwt, productRouter);
app.use("/api/order", verifyJwt, orderRouter);

// 6️⃣ Health check route
app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

// 7️⃣ Start server
const PORT = process.env.PORT || 4500;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
