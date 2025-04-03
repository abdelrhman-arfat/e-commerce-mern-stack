import { Request, Response } from "express";
import Product from "../schemas/productSchema.js";
import { isValidObjectId, ObjectId } from "mongoose";
import { deleteExistImage } from "../config/cloudinary.js";

const getRandomProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 4 } }]).exec();

    res.status(200).json({
      message: "Random Products fetched successfully",
      error: null,
      results: products,
      code: 200,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: error.message,
      error: error,
      code: 500,
      results: null,
    });
  }
};

const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const skip = (+page - 1) * +limit;

    const [totalData, products] = await Promise.all([
      Product.countDocuments(),
      Product.find()
        .populate({
          path: "likes.user",
          select: "username email fullname",
        })
        .limit(+limit)
        .skip(skip)
        .lean(),
    ]);

    res.status(200).json({
      message: "Products fetched successfully",
      error: null,
      totalData,
      currentPage: +page,
      totalPages: Math.ceil(totalData / +limit),
      results: products,
      code: 200,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: error.message,
      error: error,
      code: 500,
      results: null,
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
        select: "username email profilePicture fullname",
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
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: error.message,
      error: error,
      code: 500,
      results: null,
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
        results: null,
        code: 400,
      });
      return;
    }

    const userReq = req?.user;
    if (!userReq || !isValidObjectId(userReq._id)) {
      res.status(401).json({
        message: "You should login first",
        error: "Invalid user id",
        results: null,
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
      creator: userReq._id,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Created successfully",
      error: null,
      results: newProduct,
      code: 201,
    });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: error.message,
      error: error,
      code: 500,
      results: null,
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
      message: error.message,
      error: error,
      code: 500,
      results: null,
    });
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
      message: error.message,
      error: error,
      code: 500,
      results: null,
    });
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
        results: null,
      });
      return;
    }

    const userReq = req?.user;

    if (!userReq || !isValidObjectId(userReq._id)) {
      res.status(401).json({
        message: "You should login first",
        error: "Invalid user id",
        results: null,
        code: 400,
      });
      return;
    }

    const product = await Product.findById(product_id);
    if (!product) {
      res.status(404).json({
        message: "Product not found",
        code: 404,
        error: null,
        results: null,
      });
      return;
    }

    const likeIndex = product.likes.findIndex((like) =>
      like.user.equals(userReq?._id)
    );

    if (likeIndex !== -1) {
      product.likes.splice(likeIndex, 1);
      await product.save();
      res.json({
        message: "Like removed successfully",
        code: 200,
        error: null,
        results: null,
      });
      return;
    } else {
      product.likes.push({ user: userReq._id, date: new Date() });
      await product.save();
      res.json({
        message: "Like added successfully",
        code: 200,
        error: null,
        results: null,
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
        results: null,
        code: 400,
      });
      return;
    }

    const userReq = req?.user;

    if (!userReq || !isValidObjectId(userReq._id)) {
      res.status(401).json({
        message: "You should login first",
        error: "Invalid user id",
        results: null,
        code: 400,
      });
      return;
    }

    const { comment } = req.body;
    if (!comment) {
      res.status(400).json({
        message: "Comment is required",
        error: "Empty comment",
        results: null,
        code: 400,
      });
      return;
    }

    const product = await Product.findById(product_id);
    if (!product) {
      res.status(404).json({
        message: "product not found",
        error: null,
        code: 404,
        results: null,
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
      results: null,
      error: null,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "internal error",
      error: error.message,
      code: 500,
      results: null,
    });
  }
};

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, comment_id } = req.query;

    if (!isValidObjectId(product_id)) {
      res.status(400).json({
        message: "invalid id",
        error: null,
        code: 400,
        results: null,
      });
      return;
    }

    const userReq = req?.user;

    if (!userReq || !isValidObjectId(userReq._id)) {
      res.status(401).json({
        message: "You should login first",
        error: "Invalid user id",
        results: null,
        code: 400,
      });
      return;
    }

    const product = await Product.findById(product_id).populate(
      "comments.user",
      "_id email username "
    );

    if (!product) {
      res.status(404).json({
        message: "product not found",
        error: null,
        code: 404,
        results: null,
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
        results: null,
        error: null,
      });
      return;
    }

    const comment = product.comments[commentIndex];
    if (
      userReq?._id?.toString() !== comment.user._id.toString() &&
      userReq.role !== "ADMIN"
    ) {
      res.status(403).json({
        message: "you are not authorized to delete this comment",
        error: null,
        code: 403,
        results: null,
      });
      return;
    } else {
      product.comments.splice(commentIndex, 1);
    }
    await product.save();

    res.status(200).json({
      message: "comment deleted successfully",
      code: 200,
      results: null,
      error: null,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "internal error",
      error: error.message,
      code: 500,
      results: null,
    });
  }
};

const getProductByCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    if (!name) {
      res.status(400).json({
        message: "Category name is required",
        error: null,
        code: 400,
        results: null,
      });
      return;
    }

    const products = await Product.find({ category: name });

    res.status(200).json({
      message: "products fetched successfully",
      code: 200,
      results: products,
      error: null,
    });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: error.message,
      error: error,
      code: 500,
      results: null,
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
  getProductByCategory,
  deleteComment,
  getRandomProducts,
};
