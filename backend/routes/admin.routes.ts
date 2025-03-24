import { Router } from "express";
import {
  addNewProduct,
  deleteProductById,
  updateProductDate,
} from "../controllers/products.controller.js";
import protectedMiddleware from "../middleware/protected.js";
import isVerified from "../middleware/isVerified.js";
import adminWork from "../middleware/adminWork.js";
import { upload } from "../config/cloudinary.js";
import { deleteUserFromAdmin } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter
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
  .delete(
    "/delete-user/:user_id",
    protectedMiddleware,
    isVerified,
    adminWork,
    deleteUserFromAdmin
  );

export default adminRouter;
