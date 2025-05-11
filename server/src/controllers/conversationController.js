import Conversations from "../models/Conversation.js";
import Message from "../models/Messages.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllConversations = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    
    // First find all conversations where the user is a participant and populate necessary fields
    let conversations = await Conversations.find({ participants: userId })
      .populate({
        path: "participants",
        select: "fullName profilePicture _id"
      })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    
    // Process each conversation to format the response data correctly
    const formattedConversations = conversations.map(conversation => {
      const conversationObj = conversation.toObject();
      
      // Private chat (only 2 participants)
      if (conversation.participants.length === 2) {
        // Find the other participant (not the current user)
        const otherParticipant = conversation.participants.find(
          participant => participant._id.toString() !== userId.toString()
        );
        
        if (otherParticipant) {
          // For private chats, use the other participant's info for display
          conversationObj.displayName = otherParticipant.fullName;
          conversationObj.displayPicture = otherParticipant.profilePicture;
          conversationObj.conversationType = "private";
          conversationObj.participantInfo = otherParticipant;
        }
      } 
      // Group chat (more than 2 participants)
      else if (conversation.participants.length > 2) {
        conversationObj.conversationType = "group";
        
        // If metadata with name exists, use it
        if (conversation.metadata && conversation.metadata.name) {
          conversationObj.displayName = conversation.metadata.name;
          conversationObj.displayPicture = conversation.metadata.avatar || null;
        } 
        // Otherwise, create a name from participants' names (excluding current user)
        else {
          const otherParticipants = conversation.participants
            .filter(participant => participant._id.toString() !== userId.toString())
            .map(participant => participant.fullName);
          
          // Join names with commas
          conversationObj.displayName = otherParticipants.join(", ");
          // You might want to use a default group avatar here
          conversationObj.displayPicture = null;
        }
      }
      
      // Include unread message count (you may need to implement this logic)
      // conversationObj.unreadCount = 0; // Placeholder for unread message functionality
      
      return conversationObj;
    });
    
    return res.status(200).json(
      new ApiResponse(
        200,
        formattedConversations,
        "Conversations fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Failed to fetch conversations", error.message);
  }
});

const createConversation = asyncHandler(async (req, res) => {
  try {
    const { participants, metadata } = req.body;
    const userId = req.user._id;

    if (!participants || participants.length === 0) {
      throw new ApiError(
        400,
        "Participants are required",
        "Please provide at least one participant."
      );
    }

    // Make sure to include unique participants only (avoiding duplicates)
    const uniqueParticipants = [
      ...new Set([userId.toString(), ...participants.map((p) => p.toString())]),
    ];

    // Check if we already have this exact conversation
    const existingConversation = await Conversations.findOne({
      participants: {
        $all: uniqueParticipants,
        $size: uniqueParticipants.length,
      },
    });

    if (existingConversation) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            existingConversation,
            "Conversation already exists"
          )
        );
    }

    // Set up conversation data
    const conversationData = {
      participants: uniqueParticipants,
      creator: userId,
    };

    // Add metadata for group chats (more than 2 participants)
    if (uniqueParticipants.length > 2 && metadata) {
      conversationData.metadata = metadata;
    }

    const newConversation = await Conversations.create(conversationData);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newConversation,
          "Conversation created successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Failed to create conversation", error.message);
  }
});

const getConversationById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversations.findById(id)
      .populate("participants", "fullName profilePicture")
      .populate("latestMessage");

    if (!conversation) {
      throw new ApiError(
        404,
        "Conversation not found",
        "No conversation found with the provided ID."
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, conversation, "Conversation fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Failed to fetch conversation", error.message);
  }
});
export { getAllConversations, createConversation, getConversationById };
