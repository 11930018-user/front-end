import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import burger from "../assets/img/burger.png";

const Login = ({ onSwitchToSignUp }) => {
  const [customerId, setCustomerId] = useState(""); // numeric customer ID
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!customerId || !password) {
      setError("Please enter both ID and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "web2-project-production.up.railway.app/api/auth/customer-login-id",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: customerId,
            password,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token || "customer-token");
      if (data.customer) {
        localStorage.setItem(
          "customer",
          JSON.stringify({
            id: data.customer.id,
            first_name: data.customer.first_name,
            last_name: data.customer.last_name,
            phone: data.customer.phone,
            location: data.customer.location,
          })
        );
      }

      setMsg("Signed in successfully.");
      navigate("/menu");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md bg-slate-800 rounded-xl p-8 shadow-lg text-white">
        <div className="flex items-center justify-center mb-6">
          <img src={burger} alt="Burger" className="w-12 h-12 mr-3" />
          <h1 className="text-2xl font-semibold">Sign in</h1>
        </div>

        <p className="text-slate-300 mb-4 text-sm">
          Enter your customer ID and password to continue.
        </p>

        {error && (
          <div className="mb-3 text-sm text-red-400 bg-red-900/40 px-3 py-2 rounded">
            {error}
          </div>
        )}
        {msg && (
          <div className="mb-3 text-sm text-emerald-300 bg-emerald-900/40 px-3 py-2 rounded">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Customer ID</label>
            <input
              type="text"
              placeholder="e.g. 12"
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-amber-500 hover:bg-amber-600 rounded font-semibold text-slate-900 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-slate-300">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-amber-400 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
