import React from "react";
import img from "../assets/img/about.png";
import Button from "../Layouts/Button";

const About = () => {
  return (
    <section className="min-h-screen flex items-center bg-yellow-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 px-6 lg:px-16">
        {/* Image */}
        <div className="lg:w-1/2">
          <img
            src={img}
            alt="Delicious fast food"
            className="w-full rounded-2xl shadow-lg object-cover"
          />
        </div>

        {/* Content */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            Why Choose Us?
          </h1>

          <p className="text-gray-700 leading-relaxed">
            At Upside Down, we serve delicious, made-to-order meals that satisfy
            your cravings in minutes. From sizzling burgers to crispy fries,
            every bite is packed with flavor and freshness.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Our secret? Quality ingredients, quick service, and a passion for
            creating fast food that keeps you coming back for more. Come taste
            the difference today!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
