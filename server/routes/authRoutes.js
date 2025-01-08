import {Router} from "express"
import { signup, login } from "../controllers/authController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
const authRouter = Router()
authRouter.post("/signup", signup )
authRouter.post("/login", login)
authRouter.get("/user-info",verifyToken, getUserInfo)
export default authRouter;