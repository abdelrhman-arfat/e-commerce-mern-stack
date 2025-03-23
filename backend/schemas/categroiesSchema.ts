import mongoose from "mongoose";

interface ICategories {
  name: string;
}

const CategorySchema = new mongoose.Schema<ICategories>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 50,
      lowercase: true,
      trim: true, // Removes leading & trailing spaces
      index: true, // Improves search speed
      sparse: true, // Avoids indexing null values
      validate: {
        validator: (v: string) => /^[a-zA-Z\s]+$/.test(v), // Allows spaces between words
        message: "Name must only contain alphabetic characters.",
      },
      set: (v: string) => v.toLowerCase(), // Converts input to lowercase before saving
    },
  },
  { timestamps: true }
);

const Categories =
  mongoose.models.categories || mongoose.model("categories", CategorySchema);

export default Categories;
