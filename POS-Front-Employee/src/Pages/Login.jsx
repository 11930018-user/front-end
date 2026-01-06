// Auth.jsx (Login)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import burger from "../assets/Images/burger.png";

const Login = ({ onSwitchToSignUp }) => {
  const [username, setUsername] = useState(""); // employee_code, e.g. EMP001
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both employee code and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://web2-project-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employee_code: username, // send what user typed
            password: password,
          }),
        }
      );

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save token (adjust key if backend uses accessToken, etc.)
      const token = data.token || data.accessToken || "dummy-token";
      localStorage.setItem("token", token);

      // Save employee so Menu.jsx can find it
      if (data.employee || data.user) {
        const employee = data.employee || data.user;
        localStorage.setItem("employee", JSON.stringify(employee));
      }

      // Go to Home/POS
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Left side / branding */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center p-8 bg-red-800 text-white relative">
          <h1 className="text-4xl font-extrabold mb-4 tracking-wider">
            Flavor Fusion
          </h1>
          <p className="text-center text-lg mb-8 opacity-90">
            Sign in to manage orders and use the POS.
          </p>
          <img
            src={burger}
            alt="Delicious Burger"
            className="w-full max-w-xs object-cover rounded-lg shadow-xl"
          />
        </div>

        {/* Right side / form */}
        <div className="flex-1 flex justify-center items-center p-8 sm:p-12">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              Welcome Back!
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to your account.
            </p>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="username"
                >
                  Employee Code
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter employee code (e.g. EMP001)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-150"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-150"
                  required
                />
              </div>

              <div className="flex justify-between items-center text-sm mb-6">
                <button
                  type="button"
                  className="text-red-700 hover:text-red-900 font-medium transition duration-150"
                  onClick={onSwitchToSignUp}
                >
                  Don't have an account?{" "}
                  <span className="text-red-800">Sign Up</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-red-700 rounded-lg text-white font-semibold shadow-md hover:bg-red-800 transition duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
