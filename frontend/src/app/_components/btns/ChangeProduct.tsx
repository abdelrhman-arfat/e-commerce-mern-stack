"use client";
import React, { useState } from "react";
import { FiEdit, FiX } from "react-icons/fi";
import Image from "next/image";
import app from "@/app/utils/axios_setting";
import toast from "react-hot-toast";
import { TProduct } from "@/app/types/productType";
import { TCategory } from "@/app/types/CategoryType";

const ChangeProduct = ({
  product,
  categories,
  refetch,
}: {
  categories: TCategory[];
  product: TProduct;
  refetch: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    toast
      .promise(app.patch(`/admin/update-product/${product._id}`, formData), {
        loading: "Updating product...",
        success: (res) => {
          return res.data.message || "Product updated successfully!";
        },
        error: (err) =>
          err.response?.data?.message || "Failed to update product",
      })
      .then(() => {
        refetch();
        setIsOpen(false);
      });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <button
        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600 transition duration-200 shadow-md flex items-center gap-1"
        onClick={() => setIsOpen(true)}
      >
        <FiEdit /> Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              <FiX size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Product Name
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={product.title}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  defaultValue={product.price}
                  type="number"
                  name="price"
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Category
                </label>
                <select
                  name="category"
                  required
                  defaultValue={product.category}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  required
                  className="w-full px-3 py-2 border rounded"
                  defaultValue={product.description}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Product Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {previewImage && (
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="mt-2 rounded"
                  />
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeProduct;
