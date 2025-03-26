"use client";
import { useGetRandomProductsQuery } from "@/app/_RTK/RTK-query/RTK_Query";
import React from "react";

// some random products:
const ThirdHeroSection = () => {
  const data = useGetRandomProductsQuery();
  console.log(data);
  return <section>ThirdHeroSection</section>;
};

export default ThirdHeroSection;
