import mongoose from "mongoose";

const ConversationsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["private", "group"],
        default: "private",
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    metadata: { // only for group chats
        name: String,
        description: String,
        avatar: String
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        text: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
}, { timestamps: true });

// Pre-save middleware to automatically set type and admins
ConversationsSchema.pre("save", function(next) {
    // Set type based on number of participants
    if (this.participants.length === 2) {
        this.type = "private";
        this.admins = []; // No admins for private chats
    } else if (this.participants.length > 2) {
        this.type = "group";
        // If creator exists and admins array doesn't already include creator
        if (this.creator && !this.admins.includes(this.creator)) {
            this.admins = [this.creator];
        }
    }
    next();
});

const Conversations = mongoose.model("Conversations", ConversationsSchema);
export default Conversations;