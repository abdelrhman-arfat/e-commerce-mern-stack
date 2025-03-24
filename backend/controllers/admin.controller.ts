import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import User from "../schemas/userSchema.js";
import Product from "../schemas/productSchema.js";
import { deleteExistImage } from "../config/cloudinary.js";

const deleteUserFromAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id } = req.params;

    if (!isValidObjectId(user_id)) {
      res.status(400).json({
        message: "Invalid user id",
        error: "Invalid user id",
        results: null,
        code: 400,
      });
      return;
    }

    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).json({
        message: "User not found",
        error: "User not found",
        results: null,
        code: 404,
      });
      return;
    }
    // delete user comments

    await Promise.all([
      Product.updateMany(
        { "comments.user": user_id },
        { $pull: { comments: { user_id } } }
      ),
      user.profilePicture
        ? deleteExistImage(user.profilePicture)
        : Promise.resolve(),
      user.deleteOne(),
    ]);

    res.status(200).json({
      message: "User deleted successfully",
      error: null,
      results: null,
      code: 204,
    });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      error: error.message,
      message: "internal error occurred",
      results: null,
      code: 500,
    });
  }
};
export { deleteUserFromAdmin };
