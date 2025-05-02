import mongoose from "mongoose";

const FriendsSchema = new mongoose.Schema({
    userA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    since: Date,
    status: String,
    actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})

const Friends = mongoose.model("Friends", FriendsSchema);
export default Friends;

