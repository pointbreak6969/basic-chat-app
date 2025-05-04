import axiosInstance from "@/lib/Api";

class AuthService {
    async login(data) {
        try {
           
        const response = await axiosInstance.post("/user/login", data);
        return response.data;
        } catch (error) {
        throw error.response.data;
        }
    }
    
    async logout() {
        try {
        const response = await axiosInstance.post("/user/logout", {});
        return response.data;
        } catch (error) {
        throw error.response.data;
        }
    }
    
    async register({fullName, email, password}) {
        console.log("Registering user with data:", {
            fullName,
            email,
            password
        }); // Debugging line
        try {
        const response = await axiosInstance.post("/user/register", {
           fullName, email, password
        });
        return response.data;
        } catch (error) {
        throw error
        }
    }
    async getCurrentUser() {
        try {
            const response = await axiosInstance.get("/user/me");
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
}
const authService = new AuthService();
export default authService;