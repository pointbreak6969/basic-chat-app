// import { disconnect } from "mongoose";
// import {Server as SocketIOServer} from "socket.io";
// const setupSocket = (server)=>{
//     const io = new SocketIOServer(server, {
//         cors: {
//             origin: process.env.ORIGIN,
//             methods: ["GET", "POST"],
//             credentials : true
//         }
//     })
//     const disconnect = (socket)=>{
//         console.log(`User disconnected with id: ${socket.id}`);
//         for (const [userId, socketId] of userSocketMap.entries()) {
//             if (socketId === socket.id) {
//                 userSocketMap.delete(userId);
//                 console.log(`User disconnected with id: ${userId}`);
//                 break;
//             } 
//         }
//     }
//     const userSocketMap = new Map()
//     io.on("connection", (socket)=>{
//         const userId = socket.handshake.query.userId;
//         if (userId) {
//             userSocketMap.set(userId, socket.id);
//             console.log(`User connected with id: ${userId}`);
//         } else {
//             console.log("User connected with no id");
//         }
//         socket.on("disconnect", ()=>{
//             disconnect(socket)
//         })
//     })
// }
// export default setupSocket;