import {Router} from "express"
import { searchContacts, getContactsForDmList } from "../controllers/contactController.js"
const contactRouter = Router()
import { verifyToken } from "../middlewares/authMiddleware.js"
contactRouter.post("/search", verifyToken, searchContacts)
contactRouter.get("/getContactsForDmList", verifyToken, getContactsForDmList)

export default contactRouter;