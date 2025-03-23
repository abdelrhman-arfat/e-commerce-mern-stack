import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  addNewProduct,
  deleteProductById,
  updateProductDate,
  addOrDeleteLikeToProduct,
  addCommentToProduct,
  deleteComment,
} from "../controllers/products.controller.js";
import protectedMiddleware from "../middleware/protected.js";
import adminWork from "../middleware/adminWork.js";
import { upload } from "../config/cloudinary.js";
import isVerified from "../middleware/isVerified.js";

const productsRouter = Router();

productsRouter
  .get("/", getAllProducts)
  .get("/:product_id", getProductById)
  .post(
    "/new-product",
    protectedMiddleware,
    isVerified,
    adminWork,
    upload.single("image"),
    addNewProduct
  )
  .patch(
    "/update-product/:product_id",
    protectedMiddleware,
    isVerified,
    adminWork,
    upload.single("image"),
    updateProductDate
  )
  .delete(
    "/delete-product/:product_id",
    protectedMiddleware,
    isVerified,
    adminWork,
    deleteProductById
  )
  .delete("/delete-comment/:product_id", deleteComment)
  .patch(
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
