import {Router} from 'express';
import {getMessages, sendMessage, markAsDelivered, markAsRead, deleteMessage, uploadMessageFile} from '../controllers/message.controller.js';
import {verifyJwt} from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/:conversationId").get(verifyJwt, getMessages);
router.route("/:conversationId").post(verifyJwt, sendMessage);
router.route("/upload").post(verifyJwt, uploadMessageFile);
router.route("/deliver/:conversationId").patch(verifyJwt, markAsDelivered);
router.route("/read/:messageId").patch(verifyJwt, markAsRead);
router.route("/:messageId").delete(verifyJwt, deleteMessage);

export default router;