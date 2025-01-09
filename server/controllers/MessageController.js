import Message from "../models/messagesModel.js";
export const getMessages =async (req, res)=>{
try {
    const user1 = req.userId;
    const user2 = req.body.id;
    if (!user1 || !user2) {
        return res.status(400).send({message: "Both ids are required"})
    }
    const message = await Message.find({
        $or: [
            {sender: user1, recipient: user2},{sender: user2, recipient: user1}
        ]
    }).sort({createdAt: 1 })
} catch (error) {
    return res.status(500).send({message: error.message})   
}
}