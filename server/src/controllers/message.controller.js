import Message from "../models/Messages.js";
import Conversations from "../models/Conversation.js";
import { getReceiverSocketId, io } from "../utils/socket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFile } from "../utils/aws.js";

/**
 * Helper function to get display text for non-text message types
 */
const getDisplayTextForMessageType = (type, fileName = null) => {
  switch (type) {
    case "image":
      return "📷 Image";
    case "voice":
      return "🎤 Voice message";
    case "file":
      return `📎 ${fileName || "File"}`;
    default:
      return "New message";
  }
};

/**
 * Get messages for a conversation with pagination
 * @route GET /api/messages/:conversationId
 * @access Private
 */
export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const userId = req.user._id;

  // Check if conversation exists and user is a participant
  const conversation = await Conversations.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (!conversation.participants.some(p => p.toString() === userId.toString())) {
    throw new ApiError(403, "You are not part of this conversation");
  }

  // Set up options for pagination
  const options = {
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [
      { path: "sender", select: "fullName profilePicture email" },
      { path: "replyTo" }
    ]
  };

  // Fetch messages with pagination
  const messages = await Message.paginate(
    { conversation: conversationId },
    options
  );

  // Mark messages as read by this user
  const unreadMessageIds = messages.docs
    .filter(
      msg => 
        msg.sender._id.toString() !== userId.toString() && 
        !msg.readBy.some(id => id.toString() === userId.toString())
    )
    .map(msg => msg._id);

  if (unreadMessageIds.length > 0) {
    await Message.updateMany(
      { _id: { $in: unreadMessageIds } },
      { $addToSet: { readBy: userId } }
    );
    
    // Emit socket event for read status update
    // Convert Mongoose documents to plain objects for socket emission
    const readMessages = messages.docs
      .filter(msg => unreadMessageIds.includes(msg._id))
      .map(msg => msg.toObject ? msg.toObject() : msg);
    
    if (readMessages.length > 0) {
      readMessages.forEach(msg => {
        const senderSocketId = getReceiverSocketId(msg.sender._id.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit("messageRead", {
            messageId: msg._id,
            readBy: userId
          });
        }
      });
    }
  }

  // Format the pagination information
  const pagination = {
    total: messages.totalDocs,
    page: messages.page,
    limit: messages.limit,
    pages: messages.totalPages,
    hasNextPage: messages.hasNextPage,
    hasPrevPage: messages.hasPrevPage
  };

  return res
    .status(200)
    .json(new ApiResponse(200, { messages: messages.docs, pagination }, "Messages fetched successfully"));
});

/**
 * Send a new message to a conversation
 * @route POST /api/messages/:conversationId
 * @access Private
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { text, fileUrl, fileName, fileSize, fileType, duration, replyToId } = req.body;
  const { conversationId } = req.params;
  const senderId = req.user._id;

  // Find conversation and check if user is a participant
  const conversation = await Conversations.findById(conversationId)
    .populate("participants", "_id");
    
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  // Verify sender is part of the conversation
  const isSenderInConversation = conversation.participants.some(
    participant => participant._id.toString() === senderId.toString()
  );

  if (!isSenderInConversation) {
    throw new ApiError(403, "You are not a participant in this conversation");
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
    deliveredTo: [], // Initially empty
    readBy: [],      // Initially empty
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

    // Populate sender info for the socket emission
    const populatedMessageForSocket = await Message.findById(newMessage._id)
      .populate("sender", "fullName profilePicture")
      .populate("replyTo");

    // Emit new message event to all online receivers
    onlineReceivers.forEach(receiver => {
      io.to(receiver.socketId).emit("newMessage", {
        message: populatedMessageForSocket,
        conversation: conversationId
      });
    });
  }

  // Populate sender info in the response
  const populatedMessage = await Message.findById(newMessage._id)
    .populate("sender", "fullName profilePicture")
    .populate("replyTo");

  return res.status(201).json(
    new ApiResponse(
      201, 
      populatedMessage, 
      "Message sent successfully"
    )
  );
});

/**
 * Upload file for a message
 * @route POST /api/messages/upload
 * @access Private
 */
export const uploadMessageFile = asyncHandler(async (req, res) => {
  const file = req.file;
  
  if (!file) {
    throw new ApiError(400, "No file provided");
  }
  
  try {
    // Upload file to AWS or your storage solution
    const fileUrl = await uploadFile(file);
    
    return res.status(200).json(
      new ApiResponse(
        200, 
        { 
          fileUrl,
          fileName: file.originalname,
          fileSize: file.size,
          fileType: file.mimetype
        }, 
        "File uploaded successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "File upload failed", error.message);
  }
});

/**
 * Mark messages as delivered
 * @route PATCH /api/messages/deliver/:conversationId
 * @access Private
 */
export const markAsDelivered = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  // Check if conversation exists and user is a participant
  const conversation = await Conversations.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (!conversation.participants.some(p => p.toString() === userId.toString())) {
    throw new ApiError(403, "You are not part of this conversation");
  }

  // Mark all messages as delivered that were not sent by the current user
  const result = await Message.updateMany(
    { 
      conversation: conversationId,
      sender: { $ne: userId },
      deliveredTo: { $ne: userId }
    },
    { $addToSet: { deliveredTo: userId } }
  );

  // Find affected messages and emit socket events
  if (result.modifiedCount > 0) {
    const deliveredMessages = await Message.find({
      conversation: conversationId,
      deliveredTo: userId,
      sender: { $ne: userId }
    }).distinct("sender");

    // Emit delivery status updates to senders
    deliveredMessages.forEach(senderId => {
      const senderSocketId = getReceiverSocketId(senderId.toString());
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageDelivered", {
          conversationId,
          deliveredTo: userId
        });
      }
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200, 
      { count: result.modifiedCount }, 
      "Messages marked as delivered"
    )
  );
});

/**
 * Mark messages as read
 * @route PATCH /api/messages/read/:messageId
 * @access Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  // Check if user is part of the conversation
  const conversation = await Conversations.findById(message.conversation);
  if (!conversation.participants.some(p => p.toString() === userId.toString())) {
    throw new ApiError(403, "You are not part of this conversation");
  }

  // Mark message as read by this user if not already read
  if (!message.readBy.includes(userId)) {
    message.readBy.push(userId);
    await message.save();

    // Emit socket event for read status update
    const senderSocketId = getReceiverSocketId(message.sender.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageRead", {
        messageId: message._id,
        readBy: userId
      });
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200, 
      message, 
      "Message marked as read"
    )
  );
});

/**
 * Delete a message
 * @route DELETE /api/messages/:messageId
 * @access Private
 */
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId);
  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  // Verify the user is the sender of the message
  if (message.sender.toString() !== userId.toString()) {
    throw new ApiError(403, "You can only delete your own messages");
  }

  // Check if this is the last message in the conversation
  const conversation = await Conversations.findById(message.conversation);
  
  await Message.findByIdAndDelete(messageId);

  // If this was the last message, update the conversation's lastMessage
  if (conversation.lastMessage?._id?.toString() === messageId) {
    // Find the new last message
    const newLastMessage = await Message.findOne(
      { conversation: conversation._id },
      {},
      { sort: { createdAt: -1 } }
    );

    if (newLastMessage) {
      await Conversations.findByIdAndUpdate(
        conversation._id,
        {
          lastMessage: {
            _id: newLastMessage._id,
            text: newLastMessage.type === "text" ? 
              newLastMessage.content.text : 
              getDisplayTextForMessageType(newLastMessage.type, newLastMessage.content.fileName),
            timestamp: newLastMessage.createdAt
          }
        }
      );
    } else {
      // No messages left in the conversation
      await Conversations.findByIdAndUpdate(
        conversation._id,
        { $unset: { lastMessage: 1 } }
      );
    }
  }

  // Emit socket event for message deletion
  const participants = conversation.participants
    .filter(p => p.toString() !== userId.toString())
    .map(p => p.toString());

  participants.forEach(participantId => {
    const socketId = getReceiverSocketId(participantId);
    if (socketId) {
      io.to(socketId).emit("messageDeleted", {
        messageId,
        conversationId: conversation._id
      });
    }
  });

  return res.status(200).json(
    new ApiResponse(
      200, 
      { messageId }, 
      "Message deleted successfully"
    )
  );
});