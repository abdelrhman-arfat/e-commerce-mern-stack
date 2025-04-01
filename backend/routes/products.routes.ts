import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  addOrDeleteLikeToProduct,
  addCommentToProduct,
  deleteComment,
  getProductByCategory,
  getRandomProducts,
} from "../controllers/products.controller.js";
import protectedMiddleware from "../middleware/protected.js";
import isVerified from "../middleware/isVerified.js";

const productsRouter = Router();

productsRouter
  .get("/", getAllProducts)
  .get("/random-products", getRandomProducts)
  .get("/:product_id", getProductById)
  .get("/by-category/:name", getProductByCategory)
  .delete("/delete-comment", protectedMiddleware, isVerified, deleteComment)
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
