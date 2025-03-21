import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const CLOUD_NAME = process.env.CLOUD_NAME;

const CLOUD_KEY = process.env.CLOUD_KEY;

const CLOUD_SECRET = process.env.CLOUD_SECRET;

const PORT = process.env.PORT;

const CORS_ORIGIN = process.env.CORS_ORIGIN;

const NODE_ENV = process.env.NODE_ENV;

export {
  MONGODB_URI,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
  CLOUD_KEY,
  CLOUD_NAME,
  CLOUD_SECRET,
  CORS_ORIGIN,
  PORT,
  NODE_ENV,
};
