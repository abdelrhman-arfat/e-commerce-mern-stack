"use client";
import { login } from "@/app/_RTK/redux-slices/authSlice";
import useAppDispatch from "@/app/hooks/AppDispatch";
import app from "@/app/utils/axios_setting";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const Router = useRouter();
  const dispatch = useAppDispatch();
  const handelLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSignUp(true);
    const formData = new FormData(e.currentTarget);

    if (formData.get("password") !== formData.get("confirmPassword")) {
      toast.error("passwords do not match");
      return;
    }
    toast.promise(app.post("/auth/sign-up", formData), {
      loading: "Sign up ...",
      success: (res) => {
        setIsSignUp(false);
        dispatch(login(res.data.results));
        Router.push("/");
        return res.data.message || "Signed up successfully";
      },
      error: (err) => {
        setIsSignUp(false);
        return err.response.data.error || "Can't sign up";
      },
    });
  };
  return (
    <div className="w-full flex h-screen ">
      <div className="hidden relative h-full lg:w-1/2 lg:flex items-center justify-center bg-gray-200 text-black">
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
        <form onSubmit={handelLogin} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
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
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700"
              >
                full name
              </label>
              <input
                required
                min={5}
                max={20}
                type="text"
                id="fullname"
                name="fullname"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
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
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                confirmPassword
              </label>
              <input
                required
                min={8}
                max={16}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
              type="email"
              required
              id="email"
              name="email"
            />
          </div>
          <Link className="my-2 inline-block text-three hover:text-seven duration-150 " href={"/login"}>have account</Link>
          <div>
            <button
              disabled={isSignUp}
              type="submit"
              className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800  focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
            >
              {isSignUp ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
