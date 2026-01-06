// ../Layouts/MenuItem.jsx
import React from "react";

const MenuItem = ({ item, onAddToCart }) => {
  return (
    <div className="flex flex-col h-full">
      <img
        src={item.img}
        alt={item.title}
        className="w-full h-32 object-cover rounded-xl mb-2"
      />
      <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
      <p className="text-[11px] text-gray-400 flex-grow line-clamp-2">
        {item.description}
      </p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
        <button
          onClick={() => onAddToCart(item)}
          className="px-2 py-1 text-[11px] rounded bg-white text-black hover:bg-gray-100"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default MenuItem;
