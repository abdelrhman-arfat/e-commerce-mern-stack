"use client";
import { TCategory } from "@/app/types/CategoryType";
import app from "@/app/utils/axios_setting";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiX, FiUpload } from "react-icons/fi";

const AddProductModal = ({
  refetch,
  categories,
}: {
  categories: TCategory[];
  refetch: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    toast.promise(
      app.post("/admin/new-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      {
        loading: "Creating product...",
        success: (res) => {
          if (res.status !== 201) {
            return res.data.message || "Failed to create product";
          }
          refetch();
          toast.success(res.data.message || "New product created successfully");
          setSelectedFile(null);
        },
        error: (err) => {
          return err.response?.data?.message || "Failed to create product";
        },
      }
    );
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition"
      >
        New Product
      </button>

      {isOpen && (
        <div className="fixed z-[10] inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl relative w-96">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-xl font-bold mb-5 text-center text-gray-800">
              Add New Product
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="" disabled selected>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter description..."
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Product Image
                </label>
                <div className="relative w-full">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    required
                    onChange={(e) =>
                      setSelectedFile(
                        e.target.files ? e.target.files[0].name : null
                      )
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer">
                    <FiUpload size={20} className="mr-2 text-blue-600" />
                    {selectedFile ? (
                      <span className="truncate">{selectedFile}</span>
                    ) : (
                      "Choose a file"
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-3 w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductModal;
