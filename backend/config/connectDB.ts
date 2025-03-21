import mongoose from "mongoose";
import { MONGODB_URI } from "../constants/envVar.js";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("MongoDB connected...");
  } catch (error) {
    const err = error as Error;
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

export default connectDB;
