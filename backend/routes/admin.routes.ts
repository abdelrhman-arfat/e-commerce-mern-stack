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
import {
  createNewCategory,
  deleteUserFromAdmin,
  deleteCategory,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter
  .use(protectedMiddleware, isVerified, adminWork)
  .post("/new-product", upload.single("image"), addNewProduct)
  .post("/new-category", upload.single("image"), createNewCategory)
  .delete("/delete-/:category_id", deleteCategory)
  .patch(
    "/update-product/:product_id",
    upload.single("image"),
    updateProductDate
  )
  .delete("/delete-product/:product_id", deleteProductById)
  .delete("/delete-user/:user_id", deleteUserFromAdmin);

export default adminRouter;
