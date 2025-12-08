import express from "express";
import userController from "../controllers/userController.js";

const { getAllUsers, getCurrentUser, googleLogin, loginUsers, saveUser } = userController;

const userRouter = express.Router();

userRouter.post("/", saveUser);
userRouter.post("/login", loginUsers);
userRouter.post("/google", googleLogin);
userRouter.get("/current", getCurrentUser);
userRouter.get("/", getAllUsers);

export default userRouter;