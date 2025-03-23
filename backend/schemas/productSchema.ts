import mongoose from "mongoose";

interface IProducts {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  comments: { comment: string; user: mongoose.Types.ObjectId; date: Date }[];
  likes: { user: mongoose.Types.ObjectId; date: Date }[];
}

const ProductSchema = new mongoose.Schema<IProducts>(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 200,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: "categories",
      required: true,
    },
    comments: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "users",
          required: true,
        },
        data: {
          type: Date,
          default: Date.now(),
        },
        comment: {
          type: String,
        },
      },
    ],
    likes: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "users",
          required: true,
        },
        data: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.products || mongoose.model("products", ProductSchema);
export default Product;
