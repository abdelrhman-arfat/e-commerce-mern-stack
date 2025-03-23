import { isValidObjectId } from "mongoose";
import Order from "../schemas/orderSchema.js";
import { Request, Response } from "express";
import Product from "../schemas/productSchema.js";

const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!isValidObjectId(product_id)) {
      res.status(400).json({
        message: "Missing user or product id",
        error: null,
        results: null,
        code: 400,
      });
      return;
    }

    const userReq = req?.user;

    if (!userReq) {
      res.status(401).json({
        message: "Unauthorized",
        error: "Unauthorized",
        results: null,
        code: 401,
      });
      return;
    }

    const product = await Product.findById(product_id);

    if (!product) {
      res.status(404).json({
        message: "Product not found",
        error: null,
        results: null,
        code: 404,
      });
      return;
    }

    const order = new Order({
      userId: userReq._id,
      quantity: +quantity || 1,
      productId: product_id,
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      error: null,
      results: order,
      code: 201,
    });
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
const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;
    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      Order.find()
        .limit(+limit)
        .skip(skip)
        .populate({
          path: "productId",
          select: "title price",
        })
        .populate({
          path: "userId",
          select: "username email fullname",
        }),
      Order.countDocuments(),
    ]);

    if (!orders.length) {
      res.status(404).json({
        message: "No orders found",
        error: null,
        results: [],
        code: 404,
      });
      return;
    }

    res.status(200).json({
      message: "Orders fetched successfully",
      error: null,
      results: orders,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / +limit),
      code: 200,
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
const deleteOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_id } = req.params;
    if (!isValidObjectId(order_id)) {
      res.status(400).json({
        message: "Invalid order id",
        error: null,
        results: null,
        code: 400,
      });
      return;
    }

    const order = await Order.findById(order_id);

    if (!order) {
      res.status(404).json({
        message: "Order not found",
        error: null,
        results: null,
        code: 404,
      });
      return;
    }

    await order.deleteOne();

    res.status(200).json({
      message: "Order deleted successfully",
      error: null,
      results: null,
      code: 200,
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
export { createOrder, getAllOrders, deleteOrderById };
