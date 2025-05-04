import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 8000,
    withCredentials: true, // Important for cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  // axiosInstance.interceptors.request.use(
  //   (config) => {
  //     // No need to manually add Authorization header
  //     // The browser will automatically send cookies with requests
  //     // and your backend will extract the token from the cookies
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  // // Response interceptor
  // axiosInstance.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   async (error) => {
  //     const originalRequest = error.config;

  //     // If the error status is 401 and we haven't retried the request yet
  //     // Also check if the original request was NOT the refresh token request itself to prevent infinite loop
  //     if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== `${BASE_URL}/user/refresh`) {
  //       originalRequest._retry = true;

  //       try {
  //         // Attempt to refresh the token using the correct endpoint
  //         const refreshResponse = await axios.post(
  //           `${BASE_URL}/user/refresh`, // Corrected URL
  //           {},
  //           {
  //             withCredentials: true, // Important for sending and receiving cookies
  //           }
  //         );

  //         // If token refresh was successful (check statusCode based on ApiResponse)
  //         if (refreshResponse.data?.statusCode === 200) { // Corrected status check
  //           // Retry the original request - the cookie is now updated
  //           // Make sure to return the promise here
  //           return axiosInstance(originalRequest);
  //         } else {
  //            // If refresh response is not 200, treat it as a failure
  //            console.error("Token refresh failed with status:", refreshResponse.data?.statusCode);
  //            // Redirect to login page or dispatch logout action
  //            window.location.href = '/login'; // Consider dispatching logout instead for better state management
  //            return Promise.reject(new Error("Token refresh failed")); // Reject with a specific error
  //         }
  //       } catch (refreshError) {
  //         // Handle the refresh token error (e.g., refresh token expired or invalid)
  //         console.error("Error during token refresh:", refreshError);
  //         // Redirect to login page or dispatch logout action
  //         window.location.href = '/login'; // Consider dispatching logout instead

  //         return Promise.reject(refreshError); // Reject the promise
  //       }
  //     }

  //     // If it's not a 401, already retried, or the refresh request itself failed, reject the promise
  //     // Use error.response?.data which contains the ApiError details from the backend
  //     return Promise.reject(error.response?.data || error);
  //   }
  // );

  export default axiosInstance;