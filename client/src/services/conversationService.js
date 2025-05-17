import axiosInstance from "@/lib/Api";

class ConversationService {
    async getConversations() {
        try {
            const response = await axiosInstance.get("/conversation");
            return response.data;
        } catch (error) {
            console.error("Error fetching conversations:", error);
            throw new Error("Failed to fetch conversations: " + error.message);
        }
    }
    
    async createConversation(participants, metadata = null) {
        try {
            const payload = { participants };
            if (metadata) {
                payload.metadata = metadata;
            }
            
            const response = await axiosInstance.post("/conversation/new", payload);
            return response.data;
        } catch (error) {
            console.error("Error creating conversation:", error);
            throw new Error("Failed to create conversation: " + error.message);
        }
    }
    
    async getConversationById(id) {
        try {
            const response = await axiosInstance.get(`/conversation/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching conversation:", error);
            throw new Error("Failed to fetch conversation: " + error.message);
        }
    }
}

const conversationService = new ConversationService();
export default conversationService;