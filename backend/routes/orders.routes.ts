import { Router } from "express";
import adminWork from "../middleware/adminWork.js";
import protectedMiddleware from "../middleware/protected.js";
import isVerified from "../middleware/isVerified.js";
import {
  createOrder,
  deleteOrderById,
  getAllOrders,
} from "../controllers/orders.controller.js";

const orderRouter = Router();

orderRouter
  .get("/", getAllOrders)
  .post(
    "/new-order",
    protectedMiddleware,
    isVerified,
    adminWork,
    createOrder
  )
  .delete(
    "/delete-order/:order_id",
    protectedMiddleware,
    isVerified,
    adminWork,
    deleteOrderById
  );

export default orderRouter;
