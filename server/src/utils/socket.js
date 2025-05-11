import { Server } from "socket.io";
import http from "http";
import { app } from "../app.js";
import User from "../models/Users.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
 
  pingTimeout: 60000, // 60 seconds
  transports: ["websocket", "polling"],
  allowEIO3: true, // for compatibility with older clients
});

const userSocketMap = new Map(); //used to store online users and their socket ids

// KEEP: This function is still needed to get a single user's socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap.get(userId); // get the socket id of the user from the map
}

// KEEP: This function is still useful for broadcasting online status
export function getOnlineUsers() {
  return Object.fromEntries(userSocketMap); // get all the online users from the map
}

// ADD NEW FUNCTION: To get multiple socket IDs at once for group chats
// export function getSocketIdsForUsers(userIds) {
//   return userIds
//     .map(userId => ({
//       userId,
//       socketId: userSocketMap.get(userId)
//     }))
//     .filter(user => user.socketId);
// }

io.on("connect", async (socket) => {
  console.log("New socket connection", socket.id);
  const userId = socket.handshake.query.userId; // get userId from query params
  
  if (userId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        userSocketMap.set(userId, socket.id); // store userId and socketId in the map
        console.log(`User ${user.fullName} is connected to socket ${socket.id}`);
        
        // ADD: Emit online users list to all clients when someone connects
        // io.emit("onlineUsers", getOnlineUsers());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // ADD: Join conversation rooms for efficient messaging
  // socket.on("joinConversations", async ({ conversationIds }) => {
  //   // If you want to verify user's membership in these conversations:
  //   // const conversations = await Conversations.find({
  //   //   _id: { $in: conversationIds },
  //   //   participants: userId
  //   // });
  //   // const verifiedConversationIds = conversations.map(conv => conv._id.toString());
  //   
  //   // For now, we'll trust the client:
  //   conversationIds.forEach(convId => {
  //     socket.join(`conversation:${convId}`);
  //     console.log(`User ${userId} joined conversation ${convId}`);
  //   });
  // });

  // ADD: Handle message delivery status
  // socket.on("messageDelivered", async ({ messageId }) => {
  //   try {
  //     const message = await Message.findById(messageId);
  //     
  //     if (message && !message.deliveredTo.includes(userId)) {
  //       await Message.findByIdAndUpdate(messageId, {
  //         $addToSet: { deliveredTo: userId }
  //       });
  //       
  //       // Notify sender that message was delivered
  //       const senderSocketId = getReceiverSocketId(message.sender.toString());
  //       if (senderSocketId) {
  //         io.to(senderSocketId).emit("messageDeliveryStatus", {
  //           messageId,
  //           userId: userId,
  //           status: "delivered"
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating message delivery status:", error);
  //   }
  // });

  // ADD: Handle message read status
  // socket.on("messageRead", async ({ messageId, conversationId }) => {
  //   try {
  //     // Mark individual message as read
  //     await Message.findByIdAndUpdate(messageId, {
  //       $addToSet: { readBy: userId }
  //     });
  //     
  //     // Mark all messages in conversation as read
  //     await Message.updateMany(
  //       {
  //         conversation: conversationId,
  //         sender: { $ne: userId },
  //         readBy: { $ne: userId }
  //       },
  //       {
  //         $addToSet: { readBy: userId }
  //       }
  //     );
  //     
  //     // Notify conversation about read status update
  //     io.to(`conversation:${conversationId}`).emit("messageReadStatus", {
  //       conversationId,
  //       userId: userId
  //     });
  //   } catch (error) {
  //     console.error("Error updating message read status:", error);
  //   }
  // });

  // ADD: Typing indicators
  // socket.on("typing", ({ conversationId }) => {
  //   socket.to(`conversation:${conversationId}`).emit("userTyping", {
  //     userId: userId,
  //     conversationId
  //   });
  // });
  // 
  // socket.on("stopTyping", ({ conversationId }) => {
  //   socket.to(`conversation:${conversationId}`).emit("userStoppedTyping", {
  //     userId: userId,
  //     conversationId
  //   });
  // });

  socket.on("disconnect", async () => {
    console.log("User disconnected", socket.id);
    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          console.log(`User ${user.fullName} disconnected from socket ${socket.id}`);
        }
        userSocketMap.delete(userId); // remove userId and socketId from the map
        
        // ADD: Emit updated online users list when someone disconnects
        // io.emit("onlineUsers", getOnlineUsers());
      } catch (error) {
        console.error("Error fetching user data during disconnect:", error);
      }
    }
  });

  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

export { server, io };