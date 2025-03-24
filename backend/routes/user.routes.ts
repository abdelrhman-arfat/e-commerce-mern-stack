import { Router } from "express";
import protectedMiddleware from "../middleware/protected.js";
import {
  changePassword,
  changeImage,
  deleteUser,
} from "../controllers/user.controller.js";
import { upload } from "../config/cloudinary.js";

const userRouter = Router();

userRouter
  .patch("/change-password", protectedMiddleware, changePassword)
  .patch(
    "/change-profilePicture",
    protectedMiddleware,
    upload.single("image"),
    changeImage
  )
  .delete("/delete", protectedMiddleware, deleteUser);

export default userRouter;
