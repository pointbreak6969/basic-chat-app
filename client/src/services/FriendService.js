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
    async respondToFriendRequest(requestId, action) {
        try {
            const response = await axiosInstance.post("/friends/respondToFriendRequest", { requestId, action });
            return response.data;
        } catch (error) {
            throw new Error("Failed to respond to friend request");
        }
    }
}

const friendService = new FriendService();
export default friendService;