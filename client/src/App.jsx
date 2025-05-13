import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import authService from "./services/authService";
import { login, logout, setOnlineUsers } from "./store/authSlice";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import {initSocket, disconnectSocket} from "./services/socketService";
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
          const socketInstance = initSocket(session.data._id);
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
    return () => {
      disconnectSocket(); 
    };
  }, [dispatch]);

  // useEffect(()=>{
  //   let socket;
  //   if (socket && socket.connected) return socket;
  //   if (!socket) {
  //     socket = io("http://localhost:5000", {
  //     withCredentials: true,
  //     transports: ["websocket"],
  //     query: { userId: userData?._id }, // Pass userId as a query parameter
  //   })
  //   }
  //    socket.on("connect", () =>{
  //     console.log("Socket connected:", socket.id); // Ensure socket is connected
  //    })
  //    if (!socket.connected) {
  //     socket.connect();
  //     }

  //   return () => {
  //     socket.disconnect();
  //   }
  // })
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
