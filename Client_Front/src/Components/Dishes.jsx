import React from "react";
import img1 from "../assets/img/img1.png";
import img2 from "../assets/img/img2.png";
import img3 from "../assets/img/img3.png";
import DishesCard from "../Layouts/DishesCard";

const Tag = ({ icon, text }) => (
  <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white">
    <span>{icon}</span>
    {text}
  </span>
);

const Dishes = () => {
  return (
    <section className="w-full bg-[#fafafa]">
      {/* ===== SECTION TITLE ===== */}
      <div className="px-6 lg:px-32 pt-12">
        {" "}
        {/* Changed from pt-20 to pt-12 */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-300" />
          <h2 className="text-xl font-semibold tracking-wide text-gray-700">
            Featured Starters
          </h2>
          <div className="h-px flex-1 bg-gray-300" />
        </div>
      </div>

      {/* ===== MENU GRID ===== */}
      <div className="px-6 lg:px-32 py-12">
        {" "}
        {/* Changed from py-20 to py-12 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
          {" "}
          {/* Changed gap-14 to gap-10 */}
          <div className="flex flex-col h-full">
            <DishesCard img={img1} title="Chicken Tenders" price="$11.99" />
          </div>
          <div className="flex flex-col h-full">
            <DishesCard img={img2} title="French Fries" price="$10.99" />
          </div>
          <div className="flex flex-col h-full">
            <DishesCard img={img3} title="Pizza Rolls" price="$12.99" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dishes;
