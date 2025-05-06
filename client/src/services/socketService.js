import { io } from "socket.io-client";

let socket;
export const initSocket = (userId) => {
  if (socket && socket.connected) return socket;
  if (!socket) {
    socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
      query: { userId: userId }, // Pass userId as a query parameter
    });
  }
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id); // Ensure socket is connected
  });
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;
