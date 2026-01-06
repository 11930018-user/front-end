import React from "react";
import Hero from "../Components/Hero";
import Dishes from "../Components/Dishes";
import About from "../Components/About";

const Home = () => {
  return (
    <>
      <div id="Hero">
        <Hero />
      </div>
      <div id="dishes">
        <Dishes />
      </div>
      <div id="about">
        <About />
      </div>
    </>
  );
};

export default Home;
