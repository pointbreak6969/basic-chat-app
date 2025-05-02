import { Server } from "socket.io";
import http from "http";
import { app } from "../app.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
  pingTimeout: 60000, // 60 seconds
  transports: ["websocket", "polling"],
  allowEIO3: true, // for compatibility with older clients
});

const userSocketMap = new Map(); //used to store online users and their socket ids
//used to store online users and their socket ids

export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId); // get the socket id of the user from the map
}
export function getOnlineUsers() {
  return Object.fromEntries(userSocketMap); // get all the online users from the map
}

io.on("connection", (socket) => {
  console.log("New socket connection", socket.id);
  const userId = socket.handshake.query.userId; // get userId from query params
  if (userId) {
    userSocketMap.set(userId, socket.id); // store userId and socketId in the map
  }

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    if (userId) {
      userSocketMap.delete(userId); // remove userId and socketId from the map
    }
  });
  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});
export { server, io };
