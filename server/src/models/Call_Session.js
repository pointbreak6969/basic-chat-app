import mongoose from "mongoose";
const CallSessionSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversations",
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
    },

})
const CallSession = mongoose.model("CallSession", CallSessionSchema);
export default CallSession;