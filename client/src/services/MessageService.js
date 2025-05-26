import axiosInstance from "@/lib/Api";

class MessageService {
    async getMessages(conversationId, page = 1, limit = 20) {
        try {
            const response = await axiosInstance.get(`/message/${conversationId}?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching messages:", error);
            throw new Error("Failed to fetch messages: " + error.message);
        }
    }

    async sendMessage(conversationId, messageData) {
        try {
            const response = await axiosInstance.post(`/message/${conversationId}`, messageData);
            return response.data;
        } catch (error) {
            console.error("Error sending message:", error);
            throw new Error("Failed to send message: " + error.message);
        }
    }

    async markAsDelivered(conversationId) {
        try {
            const response = await axiosInstance.patch(`/message/deliver/${conversationId}`);
            return response.data;
        } catch (error) {
            console.error("Error marking messages as delivered:", error);
            throw new Error("Failed to mark messages as delivered: " + error.message);
        }
    }

    async markAsRead(messageId) {
        try {
            const response = await axiosInstance.patch(`/message/read/${messageId}`);
            return response.data;
        } catch (error) {
            console.error("Error marking message as read:", error);
            throw new Error("Failed to mark message as read: " + error.message);
        }
    }

    async deleteMessage(messageId) {
        try {
            const response = await axiosInstance.delete(`/message/${messageId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting message:", error);
            throw new Error("Failed to delete message: " + error.message);
        }
    }
}

const messageService = new MessageService();
export default messageService;