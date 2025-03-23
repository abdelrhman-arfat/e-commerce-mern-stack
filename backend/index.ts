import express, { Express, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/auth.routes.js";
import productsRouter from "./routes/products.routes.js";
import { CORS_ORIGIN, PORT } from "./constants/envVar.js";
import orderRouter from "./routes/orders.routes.js";

const app: Express = express();

app.use(express.json({ limit: "10mb" })); // max size is 10mb

app.use(express.urlencoded({ extended: true })); //

app.use(cookieParser());

app.use(
  cors({
    origin: CORS_ORIGIN, // my web site url
    credentials: true, // send cookies
  })
);

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", orderRouter);

app.use("*", async (_, res: Response) => {
  res.status(404).json({
    message: "Page not found",
    statusCode: 404,
    results: null,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
