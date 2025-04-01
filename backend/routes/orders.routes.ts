import { Router } from "express";
import adminWork from "../middleware/adminWork.js";
import protectedMiddleware from "../middleware/protected.js";
import isVerified from "../middleware/isVerified.js";
import {
  createOrder,
  deleteOrderById,
  getAllOrders,
  doneTheOrder,
} from "../controllers/orders.controller.js";

const orderRouter = Router();

orderRouter
  .get("/", protectedMiddleware, adminWork, getAllOrders)
  .post("/new-order", protectedMiddleware, isVerified, createOrder)
  .patch(
    "/order-update/:order_id",
    protectedMiddleware,
    isVerified,
    adminWork,
    doneTheOrder
  )
  .delete(
    "/delete-order/:order_id",
    protectedMiddleware,
    isVerified,
    deleteOrderById
  );

export default orderRouter;
