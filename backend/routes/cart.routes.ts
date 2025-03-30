import { Router } from "express";
import protectedMiddleware from "../middleware/protected.js";
import isVerified from "../middleware/isVerified.js";
import {
  addToCart,
  getCarts,
  deleteFromCart,
  changeProductQuantityOnCart,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter
  .get("/", protectedMiddleware, isVerified, getCarts)
  .post("/:product_id", protectedMiddleware, isVerified, addToCart)
  .delete(
    "/delete-cart/:product_id",
    protectedMiddleware,
    isVerified,
    deleteFromCart
  )
  .patch(
    "/update-cart",
    protectedMiddleware,
    isVerified,
    changeProductQuantityOnCart
  );

export default cartRouter;
