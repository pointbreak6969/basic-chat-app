import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // Add this import

const app = express();
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser()); // Add this line to enable cookie parsing

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//import routes
import UserRoutes from "./routes/user.routes.js"
import FriendRoutes from "./routes/friends.routes.js";

app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/friends", FriendRoutes);
export { app };