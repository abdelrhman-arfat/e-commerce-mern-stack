import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  addOrDeleteLikeToProduct,
  addCommentToProduct,
  deleteComment,
} from "../controllers/products.controller.js";
import protectedMiddleware from "../middleware/protected.js";
import isVerified from "../middleware/isVerified.js";

const productsRouter = Router();

productsRouter
  .get("/", getAllProducts)
  .get("/:product_id", getProductById)

  .delete(
    "/delete-comment/:product_id",
    protectedMiddleware,
    isVerified,
    deleteComment
  )
  .post(
    "/comment/:product_id",
    protectedMiddleware,
    isVerified,
    addCommentToProduct
  )
  .patch(
    "/like/:product_id",
    protectedMiddleware,
    isVerified,
    addOrDeleteLikeToProduct
  );

export default productsRouter;
