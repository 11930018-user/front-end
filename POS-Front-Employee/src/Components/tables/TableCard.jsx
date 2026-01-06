// TableCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const TableCard = ({ table }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate("/menu", {
          state: {
            tableId: table.id,
            tableNumber: table.table_number, // if you want to show it
          },
        })
      }
      className="bg-[#2c2c2c] rounded-xl p-5 flex flex-col items-center justify-center relative shadow-lg cursor-pointer hover:scale-105 transition-all duration-200"
    >
      {/* Status Badge */}
      <span
        className={`absolute top-3 right-3 px-2 py-1 text-xs rounded-md ${
          table.status === "Occupied"
            ? "bg-red-900 text-red-300"
            : table.status === "Reserved"
            ? "bg-yellow-900 text-yellow-300"
            : "bg-green-900 text-green-300"
        }`}
      >
        {table.status}
      </span>

      {/* Table label */}
      <p className="text-gray-200 mb-3 font-semibold">
        Table {table.table_number}
      </p>

      {/* Zone Circle */}
      <div
        className={`${table.color} w-16 h-16 flex items-center justify-center rounded-full text-white font-bold text-lg`}
      >
        {table.name}
      </div>
    </div>
  );
};

export default TableCard;
