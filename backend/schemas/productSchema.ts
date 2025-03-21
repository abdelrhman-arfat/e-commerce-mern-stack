import mongoose from "mongoose";

interface IProducts {
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const ProductSchema = new mongoose.Schema<IProducts>(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
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
      maxlength: 2000,
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
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.products || mongoose.model("products", ProductSchema);
export default Product;
