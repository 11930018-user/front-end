// Header.jsx
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [displayName, setDisplayName] = useState("Employee");
  const [now, setNow] = useState(() => new Date());

  // read employee from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("employee");
      if (stored) {
        const emp = JSON.parse(stored);
        if (emp && (emp.first_name || emp.last_name)) {
          const name = `${emp.first_name || ""} ${emp.last_name || ""}`.trim();
          if (name) {
            setDisplayName(name);
          }
        }
      }
    } catch (err) {
      console.error("Error reading employee from localStorage", err);
    }
  }, []);

  // live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    window.location.href = "/auth";
  };

  const formattedDate = now.toLocaleDateString("en-LB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("en-LB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="w-full bg-slate-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center">
        {/* left */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-lg font-semibold tracking-wide">
            Upside Down POS
          </span>
        </div>

        {/* center: time + date */}
        <div className="flex-1 flex flex-col items-center justify-center text-xs sm:text-sm">
          <span className="font-mono">{formattedTime}</span>
          <span className="text-slate-300">{formattedDate}</span>
        </div>

        {/* right: user */}
        <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-2xl text-gray-300" />
            <span className="text-xs sm:text-sm font-medium">
              {displayName}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs md:text-sm bg-red-600 hover:bg-red-500 px-4 py-2 rounded-full font-medium shadow-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
