import React, { useState } from "react";
import burger from "../assets/Images/burger.png";

const SignUp = ({ onSwitchToLogin }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeCode, setEmployeeCode] = useState(""); // e.g. EMP004
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!firstName || !lastName || !employeeCode || !password || !confirm) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "web2-project-production.up.railway.app/api/employees",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            employee_code: employeeCode,
            password: password,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not create employee");
        return;
      }

      setMsg("Account created successfully. You can sign in now.");
      setFirstName("");
      setLastName("");
      setEmployeeCode("");
      setPassword("");
      setConfirm("");

      setTimeout(() => {
        onSwitchToLogin();
      }, 1200);
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
          <h1 className="text-2xl font-semibold">Create employee account</h1>
        </div>

        <p className="text-slate-300 mb-4 text-sm">
          Register an employee to use the POS system.
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
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm mb-1">First name</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Last name</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">
              Employee ID (employee_code)
            </label>
            <input
              type="text"
              placeholder="e.g. EMP004"
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Confirm password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-amber-500 hover:bg-amber-600 rounded font-semibold text-slate-900 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-slate-300">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-amber-400 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
