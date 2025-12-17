import express from "express";
import productController from "../controllers/productController.js";

const {
  createProduct,
  getProduct,
  getProductById,
  deleteProduct,
  updateProduct,
} = productController;

const publicProductRouter = express.Router();
const protectedProductRouter = express.Router();

// PUBLIC ROUTES
publicProductRouter.get("/", getProduct);
publicProductRouter.get("/:id", getProductById);

// PROTECTED ROUTES (ADMIN)
protectedProductRouter.post("/", createProduct);
protectedProductRouter.put("/:id", updateProduct);
protectedProductRouter.delete("/:id", deleteProduct);

export { publicProductRouter, protectedProductRouter };
