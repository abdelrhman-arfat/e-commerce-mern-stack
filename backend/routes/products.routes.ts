import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  addNewProduct,
  deleteProductById,
  updateProductDate,
  addOrDeleteLikeToProduct,
  addCommentToProduct,
} from "../controllers/products.controller.js";
import protectedMiddleware from "../middleware/protected.js";
import adminWork from "../middleware/adminWork.js";
import { upload } from "../config/cloudinary.js";
import isVerified from "../middleware/isVerified.js";

const productsRouter = Router();

productsRouter
  .get("/", getAllProducts)
  .get("/:product_id", getProductById)
  .patch(
    // want test
    "/comment/:product_id",
    protectedMiddleware,
    isVerified,
    addCommentToProduct
  )
  .patch(
    // want test
    "/like/:product_id",
    protectedMiddleware,
    isVerified,
    addOrDeleteLikeToProduct
  )
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
  );

export default productsRouter;
