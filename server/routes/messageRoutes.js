import { Router } from "express";
import { getMessages } from "../controllers/MessageController";
import verifyToken from "../middlewares/verifyToken";
const messageRoutes = Router();
messageRoutes.post("/get-messages", verifyToken, getMessages)