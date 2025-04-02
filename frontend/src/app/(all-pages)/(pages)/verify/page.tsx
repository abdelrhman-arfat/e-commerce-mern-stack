"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import app from "@/app/utils/axios_setting";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      app
        .post("/auth/send-verification")
        .then(() => {
          setStatusMessage("The link is expired, please check your email");
          setIsError(true);
          toast.error("The link is expired, please check your email", {
            duration: 4000,
            position: "top-right",
          });
        })
        .catch(() => {
          setStatusMessage("Error sending verification email");
          setIsError(true);
        });
      return;
    }

    app
      .post(`/auth/verify-account?token=${token}`)
      .then((res) => {
        setStatusMessage(res.data.message || "Verification successful!");
        setIsError(false);
        toast.success(res.data.message || "Verification successful!", {
          duration: 4000,
          position: "top-center",
        });
      })
      .catch(() => {
        setStatusMessage("Verification failed. Invalid or expired link.");
        setIsError(true);
        toast.error("Verification failed. Invalid or expired link.", {
          duration: 4000,
          position: "top-right",
        });
      });
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold mb-4">Account Verification</h1>
      <div
        className={`${
          isError ? "bg-red-500 text-white" : "bg-green-500 text-white"
        } p-4 rounded-lg shadow-md`}
      >
        <p>{statusMessage}</p>
      </div>
      <div className="bg-white my-10 shadow-md p-4">
        <ul className="flex space-x-6 justify-center text-lg font-medium text-gray-700">
          <li>
            <Link
              href="/"
              className="hover:text-blue-500 transition-all duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/shop"
              className="hover:text-blue-500 transition-all duration-300"
            >
              Shop
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Page), { ssr: false });
