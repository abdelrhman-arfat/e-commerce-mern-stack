import { Router } from "express";
import protectedMiddleware from "../middleware/protected.js";
import isVerified from "../middleware/isVerified.js";
import {
  addOrDeleteToFav,
  getUserFavorites,
} from "../controllers/fav.controller.js";

const favRouter = Router();

favRouter
  .get("/", protectedMiddleware, isVerified, getUserFavorites)
  .post("/:product_id", protectedMiddleware, isVerified, addOrDeleteToFav);

export default favRouter;
