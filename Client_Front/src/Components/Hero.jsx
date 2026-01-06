import React from "react";
import Button from "../Layouts/Button";

const Home = () => {
  return (
    <section
      className="relative h-[70vh] md:h-[80vh] overflow-hidden"
      style={{
        backgroundImage:
          "url(https://png.pngtree.com/background/20250110/original/pngtree-fast-food-seamless-pattern-picture-image_15712826.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/90" />

      {/* subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-black/40 to-black" />

      <div className="relative z-10 h-full max-w-6xl mx-auto px-6 lg:px-10 flex items-center">
        <div className="max-w-xl space-y-5">
          <p className="text-[11px] tracking-[0.35em] uppercase text-gray-400">
            Upside Down Resto
          </p>

          <h1 className="text-white font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight">
            Big <span className="text-white/80">Flavor.</span>
            <br />
            <span className="text-amber-400">Fast Bites.</span>
          </h1>

          <p className="text-sm md:text-base text-gray-300 max-w-md">
            Freshly made burgers, crispy fries, and bold flavors crafted to
            satisfy your cravings — served hot, fast, and full of taste.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button text="View live menu" />
            <span className="text-[11px] text-gray-400">
              No login needed. See what is cooking right now.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
