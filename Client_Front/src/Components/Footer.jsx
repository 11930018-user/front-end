import React from "react";

const Footer = () => {
  return (
    <div className="bg-black text-white rounded-t-3xl mt-8 md:mt-0">
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-32 px-5 gap-6">
        <div className="w-full md:w-1/2">
          <h1 className="font-semibold text-xl pb-4">Upside Down Resto</h1>
          <p className="text-sm text-gray-300">
            Indulge in a symphony of flavors, where each plate is a canvas for
            culinary excellence.
          </p>
        </div>

        <div className="w-full md:w-1/3">
          <h1 className="font-medium text-xl pb-4">Contact Us</h1>
          <nav className="flex flex-col gap-2 text-sm">
            <a
              className="hover:text-amber-400 transition-all cursor-pointer"
              href="mailto:XYZ@email.com"
            >
              XYZ@email.com
            </a>
            <span className="hover:text-amber-400 transition-all cursor-default">
              +961 76 809 314
            </span>
          </nav>
        </div>
      </div>

      <div>
        <p className="text-center py-4 text-xs md:text-sm text-gray-400">
          © {new Date().getFullYear()} developed by
          <span className="text-amber-400"> Moustafa Mneimneh</span> | All
          rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
