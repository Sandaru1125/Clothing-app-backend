import express from 'express';
import productController from '../controllers/productController.js';

const { createProduct, deleteProduct, getProduct, getProductById, updateProducts } = productController;

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getProduct);
productRouter.get("/:id", getProductById);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProducts);

export default productRouter;