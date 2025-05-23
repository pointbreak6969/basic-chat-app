import axiosInstance from "@/lib/Api";

class FriendService {
    async getFriends(query) {
        try {
            const response = await axiosInstance.get(`/friends/getFriends?query=${query}`);
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
    async getRecommendations(page = 1, limit = 10) {
        try {
            const response = await axiosInstance.get(`/user/explore?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error("Failed to get friend recommendations");
        }
    }
    
    async respondToFriendRequest(requestId, accept) {
        try {
            console.log("Responding to friend request:", { requestId, accept });
            const response = await axiosInstance.post("/friends/respondToFriendRequest", { requestId, accept });
            return response.data;
        } catch (error) {
            throw new Error("Failed to respond to friend request");
        }
    }
}

const friendService = new FriendService();
export default friendService;