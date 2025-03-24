import { Router } from "express";
import {
  deleteUser,
  login,
  signUP,
  logOut,
  verificationAccount,
} from "../controllers/auth.controller.js";
import loginLimiter from "../middleware/loginLimiter.js";
import signUpLimiter from "../middleware/signUpLimiter.js";
import protectedMiddleware from "../middleware/protected.js";

const authRouter = Router();

authRouter
  .post("/sign-up", signUpLimiter, signUP)
  .post("/login", loginLimiter, login)
  .post("verify-account", protectedMiddleware, verificationAccount)
  .post("/logout", protectedMiddleware, logOut)
  .delete("/delete/:user_id", protectedMiddleware, deleteUser);

export default authRouter;
