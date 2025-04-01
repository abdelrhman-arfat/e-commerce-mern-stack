"use client";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import React, { FormEvent } from "react";
import { useRouter } from "next/navigation";
import useAppDispatch from "@/app/hooks/AppDispatch";
import { login } from "@/app/_RTK/redux-slices/authSlice";
import app from "@/app/utils/axios_setting";

const LoginPage = () => {
  const Router = useRouter();
  const dispatch = useAppDispatch();

  const handelLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      toast.promise(app.post("/auth/login", data), {
        loading: "Logging in...",
        success: (res) => {
          if (res.status !== 200) {
            return res.data.message || "can't login";
          }
          dispatch(login(res.data.results));
          Router.replace("/");
          return res?.data?.message || "Login successful!";
        },
        error: (err) => err.response?.data?.message || "Login failed!",
      });
    } catch {
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="flex h-screen">
      <div className="hidden relative lg:w-1/2 lg:flex items-center justify-center bg-gray-200 text-black">
        <Image
          style={{
            objectFit: "cover",
          }}
          fill
          priority
          sizes="100%"
          src="/LoginImage.jpg"
          alt="Login image"
        ></Image>
      </div>
      <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <h1 className="text-3xl font-semibold mb-6 text-black text-center">
            Login
          </h1>

          <form onSubmit={handelLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                required
                min={5}
                max={20}
                type="text"
                id="username"
                name="username"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                required
                min={8}
                max={16}
                type="password"
                id="password"
                name="password"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800  focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            <p>
              Create Account?{" "}
              <Link href="/sign-up" className="text-black hover:underline">
                sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
