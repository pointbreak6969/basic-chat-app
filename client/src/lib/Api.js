import axios from 'axios';

const BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 8000,
    withCredentials: true, // Important for cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      // No need to manually add Authorization header
      // The browser will automatically send cookies with requests
      // and your backend will extract the token from the cookies
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
  
      // If the error status is 401 and we haven't retried the request yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          // Attempt to refresh the token
          // No need to send the refresh token in the body since it's in the HTTP-only cookie
          const refreshResponse = await axios.post(
            `${BASE_URL}/users/refresh`,
            {},
            {
              withCredentials: true, // Important for sending and receiving cookies
            }
          );
  
          // If token refresh was successful
          // The cookies will be automatically stored by the browser
          if (refreshResponse.data?.status === 200) {
            // Retry the original request - the cookie is now updated
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Handle the refresh token error
          // Usually means we need to log out the user
          
          // Redirect to login page
          window.location.href = '/login';
          
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;