import { Request, Response } from "express";
import Product from "../schemas/productSchema.js";
import { isValidObjectId } from "mongoose";
import { deleteExistImage } from "../config/cloudinary.js";

const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 12 } = req.params;

    const skip = (+page - 1) * +limit;

    const products = await Product.find()
      .populate({
        path: "likes.user",
        select: "-password",
      })
      .limit(+limit)
      .skip(skip);
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

const getProductById = async (req: Request, res: Response): Promise<void> => {
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

const addNewProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file?.path;

    if (!title || !description || !price || !category) {
      res.status(400).json({
        message: "all fields are requirement",
        error: null,
        results: [],
        code: 400,
      });
      return;
    }

    const newProduct = new Product({
      title,
      description,
      image,
      price: +price,
      category,
    });

    if (!newProduct) {
      res.status(400).json({
        message: "Can't create this product please try again",
        error: null,
        results: [],
        code: 400,
      });
      return;
    }

    await newProduct.save();

    res.status(201).json({
      message: "Created successfully",
      error: null,
      results: newProduct,
      code: 201,
    });
    return;
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Error creating product",
      error: err.message,
      results: null,
      code: 500,
    });
  }
};

const deleteProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product_id } = req.params;
    if (!isValidObjectId(product_id)) {
      res.status(400).json({
        message: "Invalid Product ID",
        error: null,
        results: [],
        code: 400,
      });
      return;
    }

    const product = await Product.findByIdAndDelete(product_id);

    if (!product) {
      res.status(404).json({
        message: "Not found",
        error: null,
        code: 404,
        results: [],
      });
      return;
    }

    const image = product.image;

    await deleteExistImage(image);

    res.status(200).json({
      message: "Deleted Successfully",
      error: null,
      results: [],
      code: 200,
    });

    return;
  } catch (err) {
    const error = err as Error;

    res.status(500).json({
      message: "internal server error",
      error: error.message,
      code: 500,
      results: [],
    });
    return;
  }
};

const updateProductDate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product_id } = req.params;

    if (!isValidObjectId(product_id)) {
      res.status(400).json({
        message: "Invalid Product ID",
        error: null,
        results: [],
        code: 400,
      });
      return;
    }

    const product = await Product.findById(product_id);

    if (!product) {
      res.status(404).json({
        message: "Not found",
        error: null,
        code: 404,
        results: [],
      });
      return;
    }

    const { title, price, description, category } = req.body;

    const image = req.file?.path;

    if (image) {
      await deleteExistImage(product.image);
      product.image = image;
    } else {
      product.image = product.image;
    }

    product.title = title || product.title;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;

    await product.save();

    res.status(200).json({
      message: "updated successfully",
      error: null,
      results: product,
      code: 200,
    });
  } catch (err) {
    const error = err as Error;

    res.status(500).json({
      message: "internal server error",
      error: error.message,
      code: 500,
      results: [],
    });
    return;
  }
};
const addOrDeleteLikeToProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { product_id } = req.params;
    if (!isValidObjectId(product_id)) {
      res.status(400).json({
        message: "invalid product id",
        error: null,
        code: 400,
        results: [],
      });
      return;
    }

    const userReq = req?.user;

    if (!userReq) {
      res.status(401).json({
        message: "Please login first and try again",
        error: null,
        results: [],
        code: 401,
      });
      return;
    }

    const product = await Product.findById(product_id);

    if (!product) {
      res.status(404).json({
        message: "product not found",
        error: null,
        code: 404,
        results: [],
      });
    }
    const index = product?.likes?.findIndex(
      (like) => like.user === userReq._id
    );

    if (index === -1) {
      // add like
      product.likes.push = {
        user: userReq._id,
        date: Date.now(),
      };
    } else {
      // delete like
      product.likes.splice(index, 1);
    }

    await product.save();

    res.status(200).json({
      message: "Add like successfully",
      results: [],
      error: null,
      code: 200,
    });
  } catch (err) {
    const error = err as Error;

    res.status(500).json({
      message: "internal server error",
      error: error.message,
      code: 500,
      results: [],
    });
    return;
  }
};
const addCommentToProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { product_id } = req.params;
  if (!isValidObjectId(product_id)) {
    res.status(400).json({
      message: "invalid id",
      error: null,
      results: [],
      code: 400,
    });
    return;
  }

  const userReq = req?.user;

  if (!userReq) {
    res.status(401).json({
      message: "you should login first and try again",
      error: null,
      code: 401,
      results: [],
    });
    return;
  }

  const { comment } = req.body;

  if (!comment) {
    res.status(400).json({
      message: "comment is required",
      code: 400,
      error: null,
      results: [],
    });
    return;
  }

  const product = await Product.findById(product_id);
  if (!product) {
    res.status(404).json({
      message: "product not found",
      error: null,
      code: 404,
      results: [],
    });
    return;
  }

  product.comments.push = {
    user: userReq._id,
    comment,
    date: Date.now(),
  };

  await product.save();

  res.status(200).json({
    message: "comment added successfully",
    code: 200,
    results: [],
    error: null,
  });
};
export {
  addOrDeleteLikeToProduct,
  updateProductDate,
  addNewProduct,
  getProductById,
  addCommentToProduct,
  getAllProducts,
  deleteProductById,
};
