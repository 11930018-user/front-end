// src/components/Navbar.jsx
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-black/70 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 md:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <RouterLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-extrabold text-xl">
            UD
          </div>
          <span className="text-white font-semibold tracking-wide text-lg">
            Upside Down<span className="text-amber-400"> Online</span>
          </span>
        </RouterLink>

        {/* Nav (always visible, also on mobile) */}
        <nav className="flex items-center gap-6 text-sm md:text-base text-gray-200">
          <RouterLink to="/" className="hover:text-amber-400 transition-colors">
            Home
          </RouterLink>

          <RouterLink to="/menu" className="ml-2 md:ml-4">
            <button className="px-4 md:px-5 py-2.5 rounded-full bg-amber-500 text-black text-xs md:text-sm font-semibold hover:bg-amber-400 transition-colors">
              Order now
            </button>
          </RouterLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
