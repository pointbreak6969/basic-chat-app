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
// Define public routes
// const publicRoutes = [
//   {
//     path: "/",
//     element: (
//       <Protected authentication={false} redirectPath="/classroom">
//         {" "}
//         <Home />
//       </Protected>
//     ),
//   },
//   { path: "/userAvatar", element: <UserAvatar /> },
//   { path: "/courses", element: <Courses /> },
//   { path: "/contact", element: <Contact /> },
//   { path: "/about", element: <About /> },
//   { path: "/canvas", element: <Canvas /> },
//   { path: "/verifyotp", element: <VerifyOtp /> },
// ];

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
  },

];
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p className="loader">loading...</p></div>}>
        <App />
      </Suspense>
    ),
    children: [...authRoutes, ...protectedRoutes],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
