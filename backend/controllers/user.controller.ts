import { Request, Response } from "express";
import User from "../schemas/userSchema.js";
import { isValidObjectId } from "mongoose";
import bcrypt from "bcryptjs";
import { deleteExistImage } from "../config/cloudinary.js";
import { NODE_ENV } from "../constants/envVar.js";
import Product from "../schemas/productSchema.js";
import webAccessToken from "../utils/webAccessToken.js";
import webRefreshToken from "../utils/webRefreshToken.js";
import isVerified from "../middleware/isVerified.js";

const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userReq = req.user;
    if (!userReq) {
      res.status(403).json({
        message: "Please login first",
        code: 403,
        error: "Unauthorized",
        results: [],
      });
      return;
    }

    const { oldPassword, newPassword } = req.body;

    if (!isValidObjectId(userReq._id)) {
      res.status(400).json({
        message: "Invalid user ID",
        code: 400,
        error: null,
        results: [],
      });
      return;
    }
    const user = await User.findById(userReq._id).select("+password");

    if (!user) {
      res.status(404).json({
        message: "User not found",
        code: 404,
        error: null,
        results: [],
      });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      res.status(400).json({
        message: "Old password does not match",
        code: 400,
        error: null,
        results: [],
      });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      message: "Success",
      code: 200,
      error: null,
      results: null,
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
  }
};

const changeImage = async (req: Request, res: Response) => {
  try {
    const userReq = req.user;

    const image = req.file?.path;

    if (!image) {
      res.status(400).json({
        message: "please add image file",
        error: null,
        results: null,
        code: 400,
      });
      return;
    }

    if (!userReq || !isValidObjectId(userReq._id)) {
      res.status(403).json({
        message: "Please login first",
        code: 403,
        error: "Unauthorized",
        results: [],
      });
      return;
    }

    const user = await User.findById(userReq._id);

    if (!user) {
      res.status(404).json({
        message: "user not found",
        error: null,
        results: [],
        code: 404,
      });
      return;
    }

    if (user.profilePicture) {
      await deleteExistImage(user.profilePicture);
    }
    user.profilePicture = image;

    await user.save();

    const userInfo = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      fullname: user.fullname,
      profilePicture: user.profilePicture,
    };

    const accessToken = await webAccessToken(userInfo);
    const refreshToken = await webRefreshToken(userInfo);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 15, // 15 Min
    });

    res.status(200).json({
      message: "profile picture saved successfully",
      code: 200,
      error: null,
      results: user,
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
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userReq = req?.user;

    if (!isValidObjectId(userReq._id)) {
      res.status(400).json({
        message: "Invalid user id",
        error: "Invalid user id",
        results: null,
        code: 400,
      });
      return;
    }

    const user = await User.findById(userReq._id);
    if (!user) {
      res.status(404).json({
        message: "User not found",
        error: "User not found",
        results: null,
        code: 404,
      });
      return;
    }
    // delete user comments

    await Promise.all([
      Product.updateMany(
        { "comments.user": userReq._id },
        { $pull: { comments: { user: userReq._id } } }
      ),
      user.profilePicture
        ? deleteExistImage(user.profilePicture)
        : Promise.resolve(),
      user.deleteOne(),
    ]);

    res.clearCookie("token", {
      sameSite: "strict",
      maxAge: 0,
      secure: NODE_ENV === "production",
      httpOnly: true,
    });
    res.clearCookie("jwt", {
      sameSite: "strict",
      maxAge: 0,
      secure: NODE_ENV === "production",
      httpOnly: true,
    });

    res.status(200).json({
      message: "User deleted successfully",
      error: null,
      results: null,
      code: 204,
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

const changeName = async (req: Request, res: Response) => {
  try {
    const userReq = req.user;
    if (!userReq || !isValidObjectId(userReq._id)) {
      res.status(403).json({
        message: "Please login first",
        code: 403,
        error: "Unauthorized",
        results: [],
      });
      return;
    }

    const { newName } = req.body;

    const user = await User.findByIdAndUpdate(
      userReq._id,
      {
        $set: {
          fullname: newName,
        },
      },
      {
        new: true,
      }
    ).select("-password -__v");

    if (!user) {
      res.status(404).json({
        message: "User not found",
        code: 404,
        error: null,
        results: [],
      });
      return;
    }
    const userInfo = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      fullname: user.fullname,
      profilePicture: user.profilePicture,
    };
    const accessToken = await webAccessToken(userInfo);
    const refreshToken = await webRefreshToken(userInfo);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 15, // 15 Min
    });

    res.status(200).json({
      message: "Name updated successfully ",
      error: null,
      results: user,
      code: 200,
    });
    return;
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      message: error.message,
      error: "internal error occurred",
      results: null,
      code: 500,
    });
  }
};

export { changePassword, changeImage, deleteUser, changeName };
