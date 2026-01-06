import React from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const baseBtnClasses =
    "flex items-center justify-center w-[200px] h-10 rounded-[20px] transition-colors";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 flex justify-around">
      {/* Home / Tables */}
      <button
        onClick={() => navigate("/")}
        className={
          baseBtnClasses +
          " " +
          (isActive("/")
            ? "bg-[#343434] text-[#f5f5f5]"
            : "bg-transparent text-[#ababab]")
        }
      >
        <FaHome className="inline mr-2" size={20} />
        <p>Tables</p>
      </button>

      {/* Orders */}
      <button
        onClick={() => navigate("/orders")}
        className={
          baseBtnClasses +
          " " +
          (isActive("/orders")
            ? "bg-[#343434] text-[#f5f5f5]"
            : "bg-transparent text-[#ababab]")
        }
      >
        <MdOutlineRestaurantMenu className="inline mr-2" size={20} />
        <p>Orders</p>
      </button>

      <button
        onClick={() => navigate("/ordersOnline")}
        className={
          baseBtnClasses +
          " " +
          (isActive("/OrdersOnline")
            ? "bg-[#343434] text-[#f5f5f5]"
            : "bg-transparent text-[#ababab]")
        }
      >
        <MdOutlineRestaurantMenu className="inline mr-2" size={20} />
        <p>Orders Online</p>
      </button>
    </div>
  );
};

export default BottomNav;
