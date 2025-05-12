import { Router } from "express";
import {  getFriends, 
  addFriend, 
  removeFriend, 

  respondToFriendRequest,
  getPendingRequests,
  getSentRequests } from "../controllers/friends.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/getFriends").get(verifyJwt, getFriends);
router.route("/addFriend").post(verifyJwt, addFriend);
router.route("/removeFriend").delete(verifyJwt, removeFriend);
// router.route("/searchFriends").get(verifyJwt, searchFriends);
router.route("/respondToFriendRequest").post(verifyJwt, respondToFriendRequest);
router.route("/getPendingRequests").get(verifyJwt, getPendingRequests);
router.route("/getSentRequests").get(verifyJwt, getSentRequests);

export default router;