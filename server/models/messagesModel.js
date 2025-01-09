import {Schema, model, mongo} from 'mongoose';

const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false,
    }, messageType: {
        type: String,
        emun: ["text", "file"],
        required: true,
    },
    content: {
        type: String,
        required: function (){
            return this.messageType === "text"
        },
    },
    fileUrl: {
        type: String,
        required: function (){
            return this.messageType === "file"
        },
    }
}, {timestamps: true})

const Message = model("messages", messageSchema)
export default Message