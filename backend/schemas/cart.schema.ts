import mongoose, { ObjectId } from "mongoose";

interface ICart {
  userId: ObjectId;
  products: { productId: ObjectId; quantity: number }[];
}

const cartSchema = new mongoose.Schema<ICart>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "users",
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          required: true,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.models.carts || mongoose.model("carts", cartSchema);

export default Cart;
