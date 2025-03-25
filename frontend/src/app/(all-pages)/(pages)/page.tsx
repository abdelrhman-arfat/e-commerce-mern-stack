import HomeHero from "@/app/_components/pages/home/HomeHero";
import SecondSection from "@/app/_components/pages/home/SecondSection";
import React from "react";
const HomePage = () => {
  return (
    <main className="w-[90%] flex-col flex gap-8 mx-auto min-h-screen">
      <HomeHero />
      <SecondSection />
    </main>
  );
};

export default HomePage;
