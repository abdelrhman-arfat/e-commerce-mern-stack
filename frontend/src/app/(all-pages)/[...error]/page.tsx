"use client";
import React from "react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="text-2xl font-semibold mt-2">Oops! Page Not Found</h2>
        <p className="text-gray-600 mt-2">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-6 flex gap-4 justify-center">
          <Link replace href="/">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
