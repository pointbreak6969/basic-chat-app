import axiosInstance from "@/lib/Api";

class FriendService {
    async getFriends() {
        try {
            const response = await axiosInstance.get("/friends/getFriends");
            return response.data;
        } catch (error) {
            throw new Error("Failed to fetch friends");
        }
    }
    async addFriend(friendId) {
        try {
            const response = await axiosInstance.post("/friends/addFriend", { friendId });
            return response.data;
        } catch (error) {
            throw new Error("Failed to add friend");
        }
    }
    async getPendingRequests() {
        try {
            const response = await axiosInstance.get("/friends/getPendingRequests");
            return response.data;
        } catch (error) {
            throw new Error("Failed to get pending requests");
        }
    }
    async getSentRequests() {
        try {
            const response = await axiosInstance.get("/friends/getSentRequests");
            return response.data;
        } catch (error) {
            throw new Error("Failed to get sent requests");
        }
    }
    async searchFriends(query) {
        try {
            const response = await axiosInstance.get(`/friends/searchFriends?query=${query}`);
            return response.data;
        } catch (error) {
            throw new Error("Failed to search friends");
        }
    }
    
    async getRecommendations(page = 1, limit = 10) {
        try {
            const response = await axiosInstance.get(`/user/explore?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error("Failed to get friend recommendations");
        }
    }
    
    async respondToFriendRequest(requestId, action) {
        try {
            const response = await axiosInstance.post("/friends/respondToFriendRequest", { requestId, action });
            return response.data;
        } catch (error) {
            throw new Error("Failed to respond to friend request");
        }
    }
    
    async respondToFriendRequest(requestId, action) {
        try {
            const response = await axiosInstance.post("/friends/respondToFriendRequest", { requestId, action });
            return response.data;
        } catch (error) {
            throw new Error("Failed to respond to friend request");
        }
    }
    
    async sendFriendRequest(friendId) {
        try {
            const response = await axiosInstance.post("/friends/sendFriendRequest", { friendId });
            return response.data;
        } catch (error) {
            throw new Error("Failed to send friend request");
        }
    }
}

const friendService = new FriendService();
export default friendService;