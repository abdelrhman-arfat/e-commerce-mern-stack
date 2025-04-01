import { Request, Response } from "express";
import Fav from "../schemas/favSchema.js";
import { isValidObjectId } from "mongoose";
const getUserFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userReq = req.user;

    if (!isValidObjectId(userReq._id)) {
      res.status(400).json({
        message: "Invalid user id",
        error: "Invalid user id",
        results: [],
        code: 400,
      });
      return;
    }

    const favorites = await Fav.find({
      userId: userReq._id,
    });

    if (!favorites) {
      res.status(404).json({
        message: "No favorites found for this user",
        error: null,
        results: [],
        code: 404,
      });
      return;
    }

    res.status(200).json({
      message: "Favorites fetched successfully",
      error: null,
      results: favorites,
      code: 200,
    });
  } catch (err) {
    const error = err as Error;

    res.status(500).json({
      error: error.message,
      message: "Internal server error",
      code: 500,
      results: [],
    });
    return;
  }
};

const getUserFavoritesProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userReq = req.user;

    if (!isValidObjectId(userReq._id)) {
      res.status(400).json({
        message: "Invalid user id",
        error: "Invalid user id",
        results: [],
        code: 400,
      });
      return;
    }

    const favorites = await Fav.find({
      userId: userReq._id,
    }).populate("productId", "title image price category");

    if (!favorites) {
      res.status(404).json({
        message: "No favorites found for this user",
        error: null,
        results: [],
        code: 404,
      });
      return;
    }

    res.status(200).json({
      message: "Favorites fetched successfully",
      error: null,
      results: favorites,
      code: 200,
    });
  } catch (err) {
    const error = err as Error;

    res.status(500).json({
      error: error.message,
      message: "Internal server error",
      code: 500,
      results: [],
    });
    return;
  }
};
const addOrDeleteToFav = async (req: Request, res: Response): Promise<void> => {
  try {
    const userReq = req?.user;
    const { product_id } = req.params;

    if (!isValidObjectId(userReq._id) || !isValidObjectId(product_id)) {
      res.status(400).json({
        message: "Invalid user or product id",
        error: null,
        results: null,
        code: 400,
      });
      return;
    }

    const favorite = await Fav.findOne({
      productId: product_id,
      userId: userReq._id,
    });

    if (favorite) {
      await Fav.findByIdAndDelete(favorite._id);
      res.status(200).json({
        message: "Product removed from favorites successfully",
        error: null,
        results: null,
        code: 200,
      });
      return;
    }
    const newFavorite = new Fav({
      userId: userReq._id,
      productId: product_id,
    });
    await newFavorite.save();

    res.status(201).json({
      message: "Product added to favorites successfully",
      error: null,
      results: null,
      code: 201,
    });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      code: 500,
      results: null,
    });
  }
};

export { getUserFavorites, addOrDeleteToFav, getUserFavoritesProducts };
