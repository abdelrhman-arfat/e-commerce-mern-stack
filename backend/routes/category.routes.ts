import { Router } from "express";
import { getAllCategories } from "../controllers/category.controller.js";

const categoriesRouter = Router();

categoriesRouter.get("/", getAllCategories);

export default categoriesRouter;
