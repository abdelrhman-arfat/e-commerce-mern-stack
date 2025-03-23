import { Request, Response } from "express";
import Product from "../schemas/productSchema.js";
import { isValidObjectId } from "mongoose";
import { deleteExistImage } from "../config/cloudinary.js";

const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const products = await Product.find()

      .populate({
        path: "likes.user",
        select: "username email fullname",
      })
      .limit(+limit)
      .skip(skip)
      .lean();
    if (!products.length) {
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
      totalProducts,
      currentPage: +page,
      totalPages: Math.ceil(totalProducts / +limit),
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

    const resProduct = await Product.findById(product_id)
      .populate({
        path: "likes.user",
        select: "username email fullname",
      })
      .populate({
        path: "comments.user",
        select: "username email fullname",
      });

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

    const userReq = req?.user;

    if (!userReq) {
      res.status(401).json({
        message: "You should login first and try again",
        error: null,
        results: [],
        code: 401,
      });
      return;
    }

    const newProduct = new Product({
      title,
      description,
      image,
      price: +price,
      category,
      creator: userReq._id,
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

    await Promise.all([deleteExistImage(product.image), product.deleteOne()]);

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
        message: "Invalid product ID",
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
        message: "Product not found",
        code: 404,
        error: null,
        results: [],
      });
      return;
    }

    const likeIndex = product.likes.findIndex(
      (like) => like.user.toString() === userReq._id.toString()
    );

    if (likeIndex !== -1) {
      product.likes.splice(likeIndex, 1);
      await product.save();
      res.json({
        message: "Like removed successfully",
        code: 200,
        error: null,
        results: [],
      });
      return;
    } else {
      product.likes.push({ user: userReq._id, date: new Date() });
      await product.save();
      res.json({
        message: "Like added successfully",
        code: 200,
        error: null,
        results: [],
      });
      return;
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      code: 500,
      results: [],
    });
  }
};

const addCommentToProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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

    product.comments.push({
      user: userReq._id,
      comment,
      date: Date.now(),
    });

    await product.save();

    res.status(200).json({
      message: "comment added successfully",
      code: 200,
      results: [],
      error: null,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "internal error",
      error: error.message,
      code: 500,
      results: [],
    });
  }
};

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, comment_id } = req.params;
    if (!isValidObjectId(product_id) || !isValidObjectId(comment_id)) {
      res.status(400).json({
        message: "invalid id",
        error: null,
        code: 400,
        results: [],
      });
      return;
    }

    const userReq = req?.user;

    const product = await Product.findById(product_id).populate({
      path: "comments.user",
      select: "-password",
    });

    if (!product) {
      res.status(404).json({
        message: "product not found",
        error: null,
        code: 404,
        results: [],
      });
      return;
    }

    const commentIndex = product.comments.findIndex((comment) =>
      comment._id.equals(comment_id)
    );

    if (commentIndex === -1) {
      res.status(400).json({
        message: "no existing comment",
        code: 400,
        results: [],
        error: null,
      });
      return;
    }

    const comment = product.comments[commentIndex];

    if (
      !userReq._id.equals(product.creator) &&
      !userReq._id.equals(comment.user) &&
      userReq.role !== "ADMIN"
    ) {
      res.status(403).json({
        message: "you are not authorized to delete this comment",
        error: null,
        code: 403,
        results: [],
      });
      return;
    } else {
      product.comments.splice(commentIndex, 1);
    }
    await product.save();

    res.status(200).json({
      message: "comment deleted successfully",
      code: 200,
      results: [],
      error: null,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "internal error",
      error: error.message,
      code: 500,
      results: [],
    });
  }
};

export {
  addOrDeleteLikeToProduct,
  updateProductDate,
  addNewProduct,
  getProductById,
  addCommentToProduct,
  getAllProducts,
  deleteProductById,
  deleteComment,
};
