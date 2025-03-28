import { Router } from "express";
import {
  login,
  signUP,
  logOut,
  verificationAccount,
  refreshToken,
} from "../controllers/auth.controller.js";
import loginLimiter from "../middleware/loginLimiter.js";
import signUpLimiter from "../middleware/signUpLimiter.js";
import protectedMiddleware from "../middleware/protected.js";
import { body } from "express-validator";

const loginValidator = [
  body("username").isLength({
    min: 5,
    max: 20,
  }),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be at least 8 characters long"),
];
const signUpValidator = [
  ...loginValidator,
  body("confirmPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("confirmPassword must be at least 8 characters long"),
  body("email").isEmail().withMessage("Please enter your email address"),
];

const authRouter = Router();

authRouter
  .post("/sign-up", signUpLimiter, signUpValidator, signUP)
  .post("/login",  loginValidator, login)
  .post("/verify-account", protectedMiddleware, verificationAccount)
  .get("/refresh-token", protectedMiddleware, refreshToken)
  .post("/logout", protectedMiddleware, logOut);

export default authRouter;
