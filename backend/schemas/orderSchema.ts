import mongoose from "mongoose";
import { ObjectId } from "mongoose";

interface IOrder {
  userId: ObjectId;
  productId: ObjectId;
  quantity: number;
}

const orderSchema = new mongoose.Schema<IOrder>({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  productId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const Order = mongoose.models.orders || mongoose.model("orders", orderSchema);

export default Order;
