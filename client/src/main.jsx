import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Protected from "./auth/Protected.jsx";
import Home from "./components/Home.jsx";
import ChatArea from "./components/ChatArea.jsx";
import Settings from "./pages/Settings.jsx";
import Friends from "./pages/FriendPage.jsx";
import ForgotPasswordPage from "./pages/ForgetPassword.jsx";
import { Toaster } from "./components/ui/sonner.jsx";

const publicRoutes = [
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
];
// Define auth routes (accessible only when logged out)
const authRoutes = [
  {
    path: "/login",
    element: (
      <Protected authentication={false} redirectPath="/">
        <Login />
      </Protected>
    ),
  },
  {
    path: "/signup",
    element: (
      <Protected authentication={false} redirectPath="/">
        <Signup />
      </Protected>
    ),
  },
];

// Define protected routes (require authentication)
const protectedRoutes = [
  {
    path: "/",
    element: (
      <Protected authentication={true}>
        <Home />
      </Protected>
    ),
    children: [
      {
        path: "",
        element: (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700">
                Welcome to Chatty
              </h2>
              <p className="text-gray-500 mt-2">
                Select a conversation to start chatting
              </p>
            </div>
          </div>
        ),
      },
      {
        path: "chat/:conversationId",
        element: <ChatArea />,
      },
    ],
  },
  {
    path: "/settings",
    element: (
      <Protected authentication={true}>
        <Settings />
      </Protected>
    ),
  },
  {
    path: "/friends",
    element: (
      <Protected authentication={true}>
        <Friends />
      </Protected>
    ),
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <p className="loader">loading...</p>
          </div>
        }
      >
        <App />
        <Toaster />
      </Suspense>
    ),
    children: [...authRoutes, ...protectedRoutes, ...publicRoutes],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
