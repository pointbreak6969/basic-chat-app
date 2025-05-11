import {Router} from 'express';
import {getMessages, sendMessage} from '../controllers/message.controller.js';
import {verifyJwt} from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/:id").get(verifyJwt, getMessages);
router.route("/send/:id").post(verifyJwt, sendMessage);

export default router;