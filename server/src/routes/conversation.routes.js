import {
  getAllConversations,
  createConversation,
  getConversationById,
} from "../controllers/conversationController.js";
import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/new").post(verifyJwt, createConversation);
router.route("/").get(verifyJwt, getAllConversations);
router.route("/:id").get(verifyJwt, getConversationById);

export default router;