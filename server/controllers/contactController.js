import User from "../models/authModels.js";
import Users from "../models/authModels.js"

export const searchContacts = async (req, res)=>{
    try {
    const {searchTerm} = req.body;
    if (searchTerm === undefined || searchTerm === null || searchTerm === "") {
        return res.status(400).json({message: "Search term is required"})
    }
    const sanatizedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(sanatizedTerm, "i");
    const contacts = await User.find({
        $and: [
            {
                _id: {
                    $ne: req.userId
                }
            }, {
                $or: [{
                    firstName: regex
                },{lastName: regex}, {email: regex}]
            }
        ]
    })
    return res.status(200).json({contacts})
    } catch (error) {
       return res.status(500).json({message: error.message}) 
    }
}