import mongoose, { ObjectId } from "mongoose";

interface IFavSchema {
  userId: ObjectId;
  productId: ObjectId;
}

const favSchema = new mongoose.Schema<IFavSchema>({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "users",
  },
  productId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "products",
  },
});

const Fav = mongoose.models.favorites || mongoose.model("favorites", favSchema);

export default Fav;
