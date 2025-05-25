import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMyProfile,
  deleteMyProfile,
} from "../controllers/user.controller";
import { checkAuth } from "../middleware/auth.middleware";
const userRouter = Router();

userRouter.post("/auth/register", registerUser);
userRouter.post("/auth/login", loginUser);
userRouter.get("/me", checkAuth, getMyProfile);
userRouter.delete("/me", checkAuth, deleteMyProfile);

export default userRouter;
