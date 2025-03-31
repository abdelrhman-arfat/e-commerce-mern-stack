import { Router } from "express";
import protectedMiddleware from "../middleware/protected.js";
import {
  changePassword,
  changeImage,
  changeName,
  deleteUser,
} from "../controllers/user.controller.js";
import { upload } from "../config/cloudinary.js";

const userRouter = Router();

userRouter
  .patch("/change-password", protectedMiddleware, changePassword)
  .patch("/change-name", protectedMiddleware, changeName)
  .patch(
    "/change-profilePicture",
    protectedMiddleware,
    upload.single("image"),
    changeImage
  )
  .delete("/delete", protectedMiddleware, deleteUser);

export default userRouter;
