import { Router } from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.get("/", getAllProducts).get("/:product_id", getProductById);

export default productsRouter;
