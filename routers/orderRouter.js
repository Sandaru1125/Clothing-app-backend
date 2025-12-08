import express from "express";
import orderController from "../controllers/orderController.js";

const { createOrder, getOrders, updateOrder } = orderController;

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/", getOrders);
orderRouter.put("/:orderID", updateOrder);

export default orderRouter;