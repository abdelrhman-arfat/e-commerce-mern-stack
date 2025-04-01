import { Router } from "express";
import protectedMiddleware from "../middleware/protected.js";
import isVerified from "../middleware/isVerified.js";
import {
  addOrDeleteToFav,
  getUserFavorites,
  getUserFavoritesProducts,
} from "../controllers/fav.controller.js";

const favRouter = Router();

favRouter
  .get("/", protectedMiddleware, getUserFavorites)
  .get("/for-page", protectedMiddleware, getUserFavoritesProducts)
  .post("/:product_id", protectedMiddleware, isVerified, addOrDeleteToFav);

export default favRouter;
