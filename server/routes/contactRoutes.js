import {Router} from "express"
import { searchContacts } from "../controllers/contactController.js"
const contactRouter = Router()
import { verifyToken } from "../middlewares/authMiddleware.js"
contactRouter.post("/search", verifyToken, searchContacts)

export default contactRouter;