import { Request, Response } from "express";
import Categories from "../schemas/categoriesSchema.js";

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Categories.find();
    res.status(200).json({
      message: "Categories retrieved successfully",
      code: 200,
      results: categories,
    });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "internal error",
      code: 500,
      results: null,
      error: error.message,
    });
    return;
  }
};

export { getAllCategories };
