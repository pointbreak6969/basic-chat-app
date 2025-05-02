import { timeStamp } from "console";
import mongoose from "mongoose";

const ConversationsSchema = new mongoose.Schema({
    type: String,
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ],
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    metadata: { // in case of group chat
        name: String,
        description: String,
        avatar: String
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        text: String,
        timeStamp : {
            type: Date,
        }
    },
})

const Conversations = mongoose.model("Conversations", ConversationsSchema);
export default Conversations;
