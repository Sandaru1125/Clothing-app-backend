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


app.use(
  cors({
    origin: "*", // Allow Expo app
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());


mongoose
  .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) =>
    console.log("❌ Database connection failed:", err.message)
  );


app.use("/api/user", userRouter);


app.use("/api/product", verifyJwt, productRouter);
app.use("/api/order", verifyJwt, orderRouter);


app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});


const PORT = process.env.PORT || 4500;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
