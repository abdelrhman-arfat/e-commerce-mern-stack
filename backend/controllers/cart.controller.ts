import { Request, Response } from "express";
import Cart from "../schemas/cart.schema.js";
import { isValidObjectId } from "mongoose";

const getCarts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userReq = req?.user;

    if (!userReq || !isValidObjectId(userReq._id)) {
      res.status(401).json({
        message: "Please login first",
        code: 401,
        error: "Unauthorized",
        results: [],
      });
      return;
    }

    const allCarts = await Cart.findOne({
      userId: userReq._id,
    });

    res.status(200).json({
      message: "Carts fetched successfully",
      error: null,
      results: allCarts,
      code: 200,
    });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "internal error",
      error: error.message,
      code: 500,
      results: null,
    });
    return;
  }
};

const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userReq = req?.user;
    if (!userReq || !isValidObjectId(userReq._id)) {
      res.status(401).json({
        message: "Please login first",
        code: 401,
        error: "Unauthorized",
        results: null,
      });
      return;
    }
    const { product_id } = req.params;
    if (!isValidObjectId(product_id)) {
      res.status(400).json({
        message: "invalid data",
        code: 400,
        error: null,
        results: null,
      });
      return;
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId: userReq._id, "products.productId": product_id },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    );

    if (!updatedCart) {
      await Cart.findOneAndUpdate(
        { userId: userReq._id },
        {
          $push: { products: { productId: product_id, quantity: 1 } },
        },
        { new: true, upsert: true }
      );
      res.status(201).json({
        message: "product added to cart successfully",
        error: null,
        code: 200,
        results: updatedCart,
      });
      return;
    }

    res.status(200).json({
      message: "product count increase successfully",
      error: null,
      code: 200,
      results: updatedCart,
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
const deleteFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id } = req.params;
    const userReq = req?.user;

    if (!userReq || !isValidObjectId(userReq._id)) {
      res.status(400).json({
        message: "please login first",
        code: 400,
        error: "Unauthorized",
        results: null,
      });
      return;
    }

    if (!isValidObjectId(product_id)) {
      res
        .status(400)
        .json({ message: "invalid id", error: null, code: 400, results: null });
      return;
    }

    const userCart = await Cart.findOneAndUpdate(
      { userId: userReq._id },
      {
        $pull: {
          products: { productId: product_id },
        },
      },
      { new: true }
    );

    if (!userCart) {
      res.status(404).json({
        message: "No cart found",
        code: 404,
        error: null,
        results: null,
      });
      return;
    }
    res.status(200).json({
      message: "Cart successfully updated",
      error: null,
      code: 200,
      results: userCart,
    });
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

const changeProductQuantityOnCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userReq = req?.user;

    if (!userReq || !isValidObjectId(userReq._id)) {
      res.status(400).json({
        message: "please login first",
        code: 400,
        error: "Unauthorized",
        results: null,
      });
      return;
    }

    const { product_id, quantity } = req.body;

    if (
      !isValidObjectId(product_id) ||
      typeof quantity !== "number" ||
      quantity <= 0
    ) {
      res.status(400).json({
        message: "invalid inputs",
        error: null,
        code: 400,
        results: null,
      });
      return;
    }

    const productOnCart = await Cart.findOneAndUpdate(
      {
        userId: userReq._id,
        "products.productId": product_id,
      },
      {
        $set: {
          "products.$.quantity": +quantity,
        },
      },
      {
        new: true,
      }
    );

    if (!productOnCart) {
      res.status(404).json({
        message: "No product found on the cart",
        code: 404,
        error: null,
        results: null,
      });
      return;
    }

    res.status(200).json({
      message: "Cart successfully updated",
      error: null,
      code: 200,
      results: productOnCart,
    });
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
export { getCarts, addToCart, deleteFromCart, changeProductQuantityOnCart };
