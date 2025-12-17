import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRouter.js";

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARES
========================= */

app.use(
  cors({
    origin: "*", // Allow Expo / mobile apps
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* =========================
   DATABASE
========================= */

mongoose
  .connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) =>
    console.log("❌ Database connection failed:", err.message)
  );

/* =========================
   ROUTES
========================= */

// User routes (login/register)
app.use("/api/user", userRouter);

// Product routes
// 🔓 PUBLIC: GET products
// 🔐 ADMIN: POST / PUT / DELETE handled inside router
app.use("/api/product", productRouter);

// Order routes (JWT handled inside router)
app.use("/api/order", orderRouter);

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 4500;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
