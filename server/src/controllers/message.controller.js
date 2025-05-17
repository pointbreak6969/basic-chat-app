import User from "../models/Users.js";
import Message from "../models/Messages.js";
import Conversations from "../models/Conversation.js";
import { getReceiverSocketId, io } from "../utils/socket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFile } from "../utils/aws.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const getMessages = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { conversationId } = req.params;
    const myId = req.user._id;

    // Count total messages for pagination metadata
    const totalMessages = await Message.countDocuments({
      $or: [
        { sender: myId, receiver: id },
        { sender: id, receiver: myId },
      ],
    });

    // Fetch messages with pagination
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: id },
        { sender: id, receiver: myId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Prepare pagination info
    const pagination = {
      total: totalMessages,
      page,
      limit,
      pages: Math.ceil(totalMessages / limit)
    };
    
    return res
      .status(200)
      .json(new ApiResponse(200, { messages, pagination }, "Messages fetched successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      "Failed to fetch messages",
      error.message
    );
  }
});

export const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { text, fileUrl, fileName, fileSize, fileType, duration, replyToId } = req.body;
    const { id: conversationId } = req.params;
    const senderId = req.user._id;

    // Find conversation and populate participants
    const conversation = await Conversations.findById(conversationId)
      .populate("participants", "_id");
      
    if (!conversation) {
      throw new ApiError(
        404,
        "Conversation not found",
        "The specified conversation does not exist."
      );
    }

    // Verify sender is part of the conversation
    const isSenderInConversation = conversation.participants.some(
      participant => participant._id.toString() === senderId.toString()
    );

    if (!isSenderInConversation) {
      throw new ApiError(
        403,
        "Unauthorized",
        "You are not a participant in this conversation."
      );
    }

    // Determine message type based on content
    let messageType = "text";
    if (fileUrl) {
      if (fileType?.startsWith("image/")) {
        messageType = "image";
      } else if (fileType?.startsWith("audio/")) {
        messageType = "voice";
      } else {
        messageType = "file";
      }
    }

    // Create message content object
    const messageContent = {
      ...(text && { text }),
      ...(fileUrl && { fileUrl }),
      ...(fileName && { fileName }),
      ...(fileSize && { fileSize }),
      ...(fileType && { fileType }),
      ...(duration && { duration })
    };

    // Create new message
    const newMessage = await Message.create({
      conversation: conversationId,
      sender: senderId,
      type: messageType,
      content: messageContent,
      status: "sent",
      ...(replyToId && { replyTo: replyToId })
    });

    // Get receivers (all participants except sender)
    const receivers = conversation.participants
      .filter(participant => participant._id.toString() !== senderId.toString())
      .map(participant => participant._id);

    // Update last message in conversation
    await Conversations.findByIdAndUpdate(conversationId, {
      lastMessage: {
        _id: newMessage._id,
        text: text || getDisplayTextForMessageType(messageType, fileName),
        timestamp: new Date()
      }
    });

    // Emit socket event to all receivers
    if (receivers.length > 0) {
      // Get socket IDs for all receivers who are online
      const onlineReceivers = receivers.map(receiverId => {
        const socketId = getReceiverSocketId(receiverId.toString());
        return { receiverId: receiverId.toString(), socketId };
      }).filter(receiver => receiver.socketId);

      // Emit new message event to all online receivers
      onlineReceivers.forEach(receiver => {
        io.to(receiver.socketId).emit("newMessage", {
          message: newMessage,
          conversation: conversationId
        });
      });
    }

    // Populate sender info in the response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "fullName profilePicture")

    return res.status(201).json(
      new ApiResponse(
        201, 
        populatedMessage, 
        "Message sent successfully"
      )
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Failed to send message",
      error.message
    );
  }
});

