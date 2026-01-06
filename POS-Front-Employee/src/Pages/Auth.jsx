// src/Pages/Auth.jsx  OR  src/pages/AuthPage.jsx
import React, { useState } from "react";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";

const Auth = () => {
  const [mode, setMode] = useState("login"); // "login" | "signup"

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      {mode === "login" ? (
        <Login onSwitchToSignUp={() => setMode("signup")} />
      ) : (
        <SignUp onSwitchToLogin={() => setMode("login")} />
      )}
    </div>
  );
};

export default Auth;
