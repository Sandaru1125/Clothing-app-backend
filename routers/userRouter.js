import express from "express";
import userController from "../controllers/userController.js";

const { getAllUsers, getCurrentUser, googleLogin, loginUsers, saveUser } = userController;

const publicUserRouter = express.Router();
const protectedUserRouter = express.Router();

// Public routes
publicUserRouter.post("/", saveUser);
publicUserRouter.post("/login", loginUsers);
publicUserRouter.post("/google", googleLogin);

// Protected routes
protectedUserRouter.get("/current", getCurrentUser);
protectedUserRouter.get("/", getAllUsers);

export { publicUserRouter, protectedUserRouter };