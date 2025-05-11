import mongoose from "mongoose";

const MessagesSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversations",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
   type: String, // is it text, file or voice
   content: {
    type: String,
    fileUrl: String,
    fileName: String,
    fileSize: Number,
    fileType: String,
    duration: Number, // in case of voice message
   },
   status: String, // sent, delivered, seen
   deliveredTo: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
   ],
   readBy: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
   ], 
   replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Messages",
   },
}, {
    timestamps: true,
})

const Messages = mongoose.model("Messages", MessagesSchema);    
export default Messages;