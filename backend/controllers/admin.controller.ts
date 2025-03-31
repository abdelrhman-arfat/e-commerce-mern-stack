import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import User from "../schemas/userSchema.js";
import Product from "../schemas/productSchema.js";
import { deleteExistImage } from "../config/cloudinary.js";
import Categories from "../schemas/categoriesSchema.js";

const deleteUserFromAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.params.user_id;
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

const createNewCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  // promise<Response> to make return res.status(...).json(...)
  try {
    const { name } = req.body;
    const image = req.file?.path;

    if (!name || !image) {
      res.status(400).json({
        message: "category data is required",
        error: null,
        results: null,
        code: 400,
      });
      return;
    }

    const newCategory = new Categories({ name, image });
    await newCategory.save();
    res.status(201).json({
      message: "category successfully saved",
      error: null,
      code: 201,
      results: newCategory,
    });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "internal error occurred",
      error: error.message,
      code: 500,
      results: null,
    });
    return;
  }
};
const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category_id } = req.params;

    if (!isValidObjectId(category_id)) {
      res.status(400).json({
        message: "Invalid category id",
        error: "Invalid category id",
        results: null,
        code: 400,
      });
      return;
    }

    const category = await Categories.findById(category_id).exec();

    if (!category || !category.image) {
      res.status(404).json({
        message: "category not found",
        error: null,
        code: 404,
        results: null,
      });
      return;
    }

    await Promise.all([deleteExistImage(category.image), category.deleteOne()]);

    res.status(200).json({
      message: "category deleted successfully",
      error: null,
      code: 204,
      results: null,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "internal error occurred",
      error: error.message,
      code: 500,
      results: null,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const skip = (+page - 1) * +limit;

    if (+page < 1) {
      res.status(400).json({
        message: "Invalid page number",
        error: "Invalid page number",
        results: null,
        code: 400,
      });
      return;
    }

    const [users, totalData] = await Promise.all([
      User.find().select("-password -username -__v").skip(skip).limit(+limit),
      User.countDocuments(),
    ]);

    if (!users.length) {
      res.status(404).json({
        message: "No users found",
        error: null,
        results: null,
        code: 404,
      });
      return; // Exit the function early if no users found. 404 is a good status code for this situation.
    }

    res.status(200).json({
      message: "users fetched successfully",
      results: users,
      totalData: totalData,
      currentPage: +page,
      totalPages: Math.ceil(totalData / +limit),
      code: 200,
      error: null,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "internal error occurred",
      error: error.message,
      code: 500,
      results: null,
    });
  }
};

const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { user_id, role } = req.query;
    if (!isValidObjectId(user_id)) {
      res.status(400).json({
        message: "Invalid user id",
        error: "Invalid user id",
        results: null,
        code: 400,
      });
      return;
    }

    const user = await User.findByIdAndUpdate(user_id, {
      $set: {
        role,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
        error: null,
        results: null,
        code: 404,
      });
      return;
    }

    res.status(200).json({
      message: "User role updated successfully",
      error: null,
      results: user,
      code: 200,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "internal error occurred",
      error: error.message,
      code: 500,
      results: null,
    });
  }
};

export {
  deleteUserFromAdmin,
  getAllUsers,
  deleteCategory,
  updateUserRole,
  createNewCategory,
};
