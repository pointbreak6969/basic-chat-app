import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import authService from "./services/authService";
import { login, logout } from "./store/authSlice";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const session = await authService.getCurrentUser();
        if (session?.success && session?.data) {
          dispatch(login(session.data));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Authentication error:", error);
        if (error?.statusCode === 401 || error?.message?.includes("Unauthorized")) {
          dispatch(logout());
        } else {
          console.error("An unexpected error occurred during auth check:", error);
          dispatch(logout());
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" richColors closeButton theme="light" />

      <Outlet />
    </>
  );
}

export default App;
