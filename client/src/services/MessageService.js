import axiosInstance from "@/lib/Api";

class MessageService {
    async getMessages(id, page = 1, limit = 10) {
        try {
            const response = await axiosInstance.get(`/message/${id}?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw new Error("Failed to fetch messages: " + error.message);
        }
    }

    async sendMessage(conversationId, message) {
        try {
            const response = await axiosInstance.post(`/message/${conversationId}`, { message });
            return response.data;
        } catch (error) {
            console.error("Error sending message:", error);
            throw new Error("Failed to send message: " + error.message);
        }
    }

}