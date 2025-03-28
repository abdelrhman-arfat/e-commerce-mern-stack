import mongoose from "mongoose";
import validator from "validator";

interface IUser {
  fullname: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isVerified: boolean;
  role: "ADMIN" | "USER";
}

const UserSchema = new mongoose.Schema<IUser>({
  fullname: {
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
  isVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "USER",
    enum: ["ADMIN", "USER"],
  },
});

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;
