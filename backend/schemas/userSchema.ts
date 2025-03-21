import mongoose from "mongoose";
import validator from "validator";

interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  role: "ADMIN" | "USER";
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/dannuv9wj/image/upload/v1742520128/u5jwxxccget5wpe1cyp4.png",
  },
  role: {
    type: String,
    default: "USER",
    enum: ["ADMIN", "USER"],
  },
});

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;
