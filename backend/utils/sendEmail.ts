import {
  CORS_ORIGIN,
  EMAIL_PASS,
  EMAIL_USER,
  JWT_SECRET,
} from "../constants/envVar";
import { TUserInfo } from "../types/userInfo";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const sendEmailForVerification = async (userInfo: TUserInfo): Promise<void> => {
  try {
    const emailToken = await jwt.sign(
      {
        email: userInfo.email,
        username: userInfo.username,
        _id: userInfo._id,
        role: userInfo.role,
        isVerified: userInfo.isVerified,
      },
      JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    if (!emailToken) {
      throw new Error("Failed to generate JWT email verification token");
    }

    const transporter = await nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const url = `${CORS_ORIGIN}/verify?token=${emailToken}`;

    await transporter.sendMail({
      from: `E-commerce: <${EMAIL_USER}>`,
      to: userInfo.email,
      subject: "E-commerce - Verify your email address",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; border-radius: 10px; text-align: center; font-family: Arial, sans-serif; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; font-size: 24px;">Verify Your Email Address</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Thank you for signing up for <strong>E-commerce</strong>! To get started, please confirm your email address by clicking the button below.
          </p>
          <a href="${url}" 
            style="display: inline-block; background: #007BFF; color: white; padding: 12px 24px; 
            border-radius: 5px; text-decoration: none; font-size: 18px; font-weight: bold; 
            margin-top: 20px; cursor: pointer;">
            Verify Email
            </a>
          <p style="margin-top: 20px; font-size: 15px; color: #999;">
            If you didn’t create this account, you can ignore this email.
          </p>
          <p style="margin-top: 20px; font-size: 15px; color: #999;">
            this verification will end after one hour
          </p>
        </div>
      `,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Failed to send email verification:", error.message);
  }
};
export default sendEmailForVerification;
