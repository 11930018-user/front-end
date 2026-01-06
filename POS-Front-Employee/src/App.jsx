// App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { Orders, OrdersOnline, Tables, Menu, Auth } from "./Pages";
import Header from "./Components/shared/Header";

// Auto-logout after 20s inactivity
const InactivityLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("employee");
        // After logout go back to auth page
        navigate("/auth", { replace: true });
      }, 20000); // 20 seconds
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  return null;
};

// Protect POS routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <Router>
      <InactivityLogout />

      <div className="min-h-screen bg-[#050505] text-white">
        <Routes>
          {/* Public auth route (Login) */}
          <Route path="/auth" element={<Auth />} />

          {/* DEFAULT after login: Tables page on "/" */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <Tables />
                </>
              </ProtectedRoute>
            }
          />

          {/* Optional direct routes */}
          <Route
            path="/tables"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <Tables />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <Menu />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <Orders />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/ordersonline"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <OrdersOnline />
                </>
              </ProtectedRoute>
            }
          />

          {/* Fallback to /auth */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
