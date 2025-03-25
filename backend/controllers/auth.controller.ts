import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../schemas/userSchema.js";
import webAccessToken from "../utils/webAccessToken.js";
import { isValidObjectId } from "mongoose";
import {
  JWT_REFRESH_SECRET,
  JWT_SECRET,
  NODE_ENV,
} from "../constants/envVar.js";
import sendEmailForVerification from "../utils/sendEmail.js";
import { validationResult } from "express-validator";
import webRefreshToken from "../utils/webRefreshToken.js";
const signUP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, confirmPassword, email, fullname } = req.body;

    if (!username || !password || !confirmPassword || !email || !fullname) {
      res.status(400).json({
        message: "Please enter valid data",
        error: "Invalid Data",
        results: null,
        code: 400,
      });
      return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "error in data",
        results: null,
        error: errors.array(),
        code: 400,
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords do not match." });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      username,
      password: hashedPassword,
      email,
      fullname,
    });

    if (!user) {
      res.status(400).json({
        message: "Failed to create user.",
        results: null,
        error: "Failed to create user",
        code: 400,
      });
      return;
    }

    await user.save();

    const userInfo = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
    await sendEmailForVerification(userInfo);
    const accessToken = await webAccessToken(userInfo);
    const refreshToken = await webRefreshToken(userInfo);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
    });
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 15, // 15 Min
      sameSite: "strict",
    });

    res.status(201).json({
      message:
        "Created successfully, please check your email to verify your account",
      error: null,
      results: {
        username,
        fullname,
        profilePicture: user.profilePicture,
        email,
        role: user.role,
        _id: user._id,
      },
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

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({
        message: "Please enter valid data",
        error: "Invalid Data",
        data: null,
        code: 400,
      });
      return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "error in data",
        results: null,
        error: errors.array(),
        code: 400,
      });
      return;
    }

    const user = await User.findOne({
      username,
    }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({
        message: "Invalid credentials",
        error: "Invalid credentials",
        data: null,
        code: 401,
      });
      return;
    }

    const userInfo = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };

    const accessToken = await webAccessToken(userInfo);
    const refreshToken = await webRefreshToken(userInfo);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: "strict",
    });
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 15, // 15 Min
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Logged in successfully.",
      error: null,
      results: {
        username: user.username,
        profilePicture: user.profilePicture,
        email: user.email,
        role: user.role,
        _id: user._id,
        name: user.name,
      },
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

const logOut = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 0,
      sameSite: "strict",
    });
    res.clearCookie("token", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 0,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Logged out successfully",
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

const verificationAccount = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      res.status(400).json({
        message: "Missing verification token",
        error: "Invalid token",
        results: null,
        code: 400,
      });
      return;
    }

    const deCoded = (await jwt.verify(
      token as string,
      JWT_SECRET as string
    )) as jwt.JwtPayload;

    if (!deCoded || !isValidObjectId(deCoded._id)) {
      res.status(401).json({
        message: "Invalid or expired verification token",
        error: "Invalid or expired verification token",
        results: null,
        code: 401,
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      deCoded._id,
      {
        $set: {
          isVerified: true,
        },
      },
      {
        new: true,
      }
    );

    if (!user) {
      res.status(404).json({
        message: "User not found",
        error: "User not found",
        results: null,
        code: 404,
      });
      return;
    }

    res.status(200).json({
      message: "verification successful",
      error: null,
      results: user,
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

const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      res.status(401).json({
        message: "Missing refresh token",
        error: "Missing refresh token",
        results: null,
        code: 401,
      });
      return;
    }

    const deCoded = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET as string
    ) as jwt.JwtPayload;

    if (!deCoded || !isValidObjectId(deCoded._id)) {
      res.status(401).json({
        message: "Invalid or expired refresh token",
        error: "Invalid or expired refresh token",
        results: null,
        code: 401,
      });
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        maxAge: 0,
        sameSite: "strict",
      });
      res.clearCookie("token", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        maxAge: 0,
        sameSite: "strict",
      });
      return;
    }
    const userInfo = {
      _id: deCoded._id,
      username: deCoded.username,
      email: deCoded.email,
      role: deCoded.role,
      isVerified: deCoded.isVerified,
    };
    const token = await webAccessToken(userInfo);
    if (!token) {
      res.status(500).json({
        message: "Internal error occurred with create new token",
        error: "internal error occurred",
        results: null,
        code: 500,
      });
      return;
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 15,
      sameSite: "strict",
    });
    res.status(200).json({
      message: "Refresh token updated successfully",
      error: null,
      results: null,
      code: 200,
    });
    return;
  } catch (err) {
    const error = err as Error;
    if (err instanceof jwt.JsonWebTokenError) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        maxAge: 0,
        sameSite: "strict",
      });
      res.clearCookie("token", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        maxAge: 0,
        sameSite: "strict",
      });
      res.status(401).json({
        message: "Invalid token",
        error: err.message,
        results: null,
        code: 401,
      });
      return;
    }
    res.status(500).json({
      error: error.message,
      message: "internal error occurred",
      results: null,
      code: 500,
    });
    return;
  }
};
export { signUP, login, logOut, verificationAccount, refreshToken };
