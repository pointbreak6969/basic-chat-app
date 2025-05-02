import { Router } from "express";
import { getFriends, addFriend, removeFriend } from "../controllers/friends.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/getFriends").get(verifyJwt, getFriends);
router.route("/addFriend").post(verifyJwt, addFriend);
router.route("/removeFriend").delete(verifyJwt, removeFriend);

export default router;