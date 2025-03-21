import { Request, Response } from "express";
import Product from "../schemas/productSchema.js";
import { isValidObjectId } from "mongoose";

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 12 } = req.params;

    const skip = (+page - 1) * +limit;

    const products = await Product.find().limit(+limit).skip(skip);
    if (!products) {
      res.status(404).json({
        message: "No products found",
        error: null,
        results: [],
        code: 404,
      });
      return;
    }

    res.status(200).json({
      message: "Products fetched successfully",
      error: null,
      results: products,
      code: 200,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      results: null,
      code: 500,
    });
  }
};
const getProductById = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;
    if (!isValidObjectId(product_id)) {
      res.status(400).json({
        message: "invalid product id",
        error: null,
        results: null,
        code: 400,
      });
      return;
    }

    const resProduct = await Product.findById(product_id);

    if (!resProduct) {
      res.status(404).json({
        message: "Product not found",
        error: null,
        results: null,
        code: 404,
      });
      return;
    }

    res.status(200).json({
      message: "Product fetched successfully",
      error: null,
      results: resProduct,
      code: 200,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
      results: null,
      code: 500,
    });
  }
};
export { getProductById, getAllProducts };
