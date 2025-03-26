import HomeHero from "@/app/_components/pages/home/HomeHero";
import SecondSection from "@/app/_components/pages/home/SecondSection";
import ThirdHeroSection from "@/app/_components/pages/home/ThirdHeroSection";
import React from "react";
const HomePage = () => {
  return (
    <div>
      <HomeHero />
      <SecondSection />
      <ThirdHeroSection />
    </div>
  );
};

export default HomePage;
