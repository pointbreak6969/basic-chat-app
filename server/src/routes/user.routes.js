import { Router } from "express";
import {registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken, exploreUsers} from "../controllers/user.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router(); 

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/me").get(verifyJwt, getCurrentUser);
router.route("/refresh").post(refreshAccessToken);
router.route("/explore").get(verifyJwt, exploreUsers);
export default router;
