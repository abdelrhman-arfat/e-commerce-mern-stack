import express, { Express, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.routes.js";
import productsRouter from "./routes/products.routes.js";
dotenv.config();

const app: Express = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

(async () => {
  try {
    connectDB();
  } catch {
    console.error("Failed to connect to the database");
    process.exit(1);
  }
})();

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);

app.use("*", async (_, res: Response) => {
  res.status(404).json({
    message: "Page not found",
    statusCode: 404,
    results: null,
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
