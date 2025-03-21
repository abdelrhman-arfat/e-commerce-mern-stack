import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import { CLOUD_KEY, CLOUD_NAME, CLOUD_SECRET } from "../constants/envVar";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_KEY,
  api_secret: CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "uploads",
      format: path.extname(file.originalname).slice(1) || "png",
      public_id: file.originalname.split(".")[0],
    };
  },
});

const upload = multer({ storage });

const deleteExistImage = async (oldImage: string) => {
  try {
    if (!oldImage) return;

    const filename = oldImage.split("/").pop();
    const public_id = filename ? filename.split(".")[0] : null;

    if (!public_id) {
      console.error("Invalid image URL: Cannot extract public_id.");
      return;
    }

    await cloudinary.uploader.destroy(public_id);
  } catch (err: any) {
    console.error("Error deleting image:", err.message);
  }
};

export { cloudinary, upload, deleteExistImage };
