import express from "express";
import setupSocket from "./socket";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;
app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use(cookieParser());
app.use(express.json());

//routes 
import authRouter from "./routes/authRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
app.use("/api/auth", authRouter); 

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
setupSocket(server);
mongoose
  .connect(databaseURL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log(err));
