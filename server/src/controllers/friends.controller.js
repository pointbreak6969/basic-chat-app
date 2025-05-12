import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Friend from "../models/Friends.js";
import FriendRequest from "../models/Friend_Request.js";

const getFriends = asyncHandler(async (req, res)=>{
    const userId = req.user._id;
    const friends = await Friend.aggregate([
        {
          $match: {
            $or: [
              { userA: userId },
              { userB: userId }
            ]
          }
        },
        {
          $project: {
            _id: 0,
            user: "$userA",
            friend: "$userB"
          }
        },
        {
          $unionWith: {
            coll: "friends",
            pipeline: [
              {
                $match: {
                  $or: [
                    { userA: userId },
                    { userB: userId }
                  ]
                }
              },
              {
                $project: {
                  _id: 0,
                  user: "$userB",
                  friend: "$userA"
                }
              }
            ]
          }
        },
        {
          $match: {
            user: userId
          }
        },
        {
          $group: {
            _id: "$user",
            friends: { $addToSet: "$friend" }
          }
        },
        {
          $project: {
            user: "$_id",
            friends: 1,
            _id: 0
          }
        }
      ])
    return res.json(new ApiResponse(200, "Friends fetched succesfully", friends.length > 0 ? friends[0] : { user: userId, friends: [] }))
})

const addFriend = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { friendId } = req.body;
    
    if (!friendId) return next(new ApiError(400, "Friend ID is required"));
    
    // Check if users are already friends
    const existingFriend = await Friend.findOne({
        $or: [
            { userA: userId, userB: friendId },
            { userA: friendId, userB: userId }
        ]
    });
    
    if (existingFriend) {
        return next(new ApiError(400, "You are already friends with this user"));
    }
    
    // Check if there's already a pending request between these users
    const existingRequest = await FriendRequest.findOne({
        $or: [
            { sender: userId, recipient: friendId },
            { sender: friendId, recipient: userId }
        ]
    });
    
    if (existingRequest) {
        if (existingRequest.sender.toString() === userId.toString()) {
            return next(new ApiError(400, "You have already sent a friend request to this user"));
        } else {
            return next(new ApiError(400, "This user has already sent you a friend request"));
        }
    }
    
    // Create a new friend request
    const friendRequest = await FriendRequest.create({
        sender: userId,
        recipient: friendId
    });
    
    return res.json(new ApiResponse(200, friendRequest, "Friend request sent successfully"));
});

const removeFriend = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const {friendId} = req.body;
    if(!friendId) return next(new ApiError(400, "Friend ID is required"))
    
    const friend = await Friend.findOneAndDelete({
        $or: [
            { userA: userId, userB: friendId },
            { userA: friendId, userB: userId }
        ]
    });
    
    if(!friend) return next(new ApiError(404, "Friend not found"))
    return res.json(new ApiResponse(200, friend, "Friend removed successfully"))
});

const respondToFriendRequest = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { requestId, accept } = req.body;
    
    if (!requestId) return next(new ApiError(400, "Request ID is required"));
    
    const friendRequest = await FriendRequest.findOne({
        _id: requestId,
        recipient: userId,
        status: "pending"
    });
    
    if (!friendRequest) {
        return next(new ApiError(404, "Friend request not found"));
    }
    
    if (accept) {
        // Create a new friend connection
        await Friend.create({
            userA: friendRequest.sender,
            userB: friendRequest.recipient
        });
        
        // Delete the request since it's been accepted
        await FriendRequest.findByIdAndDelete(requestId);
        
        return res.json(new ApiResponse(200, {}, "Friend request accepted"));
    } else {
        // Delete the request since it's been rejected
        await FriendRequest.findByIdAndDelete(requestId);
        
        return res.json(new ApiResponse(200, {}, "Friend request rejected"));
    }
});

const getPendingRequests = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const requests = await FriendRequest.find({
        recipient: userId,
        status: "pending"
    }).populate("sender", "fullName email profilePicture");
    
    return res.json(new ApiResponse(200, requests, "Pending friend requests fetched successfully"));
});

const getSentRequests = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const requests = await FriendRequest.find({
        sender: userId,
        status: "pending"
    }).populate("recipient", "fullName email profilePicture");
    
    return res.json(new ApiResponse(200, requests, "Sent friend requests fetched successfully"));
});

const searchFriends = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { query } = req.query;
  
  if (!query) return next(new ApiError(400, "Query is required"));
  
  const friends = await Friend.aggregate([
    {
      $match: {
        $or: [
          { userA: userId },
          { userB: userId }
        ]
      }
    },
    {
      $project: {
        friend: {
          $cond: {
            if: { $eq: ["$userA", userId] },
            then: "$userB",
            else: "$userA"
          }
        }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "friend",
        foreignField: "_id",
        as: "friendDetails"
      }
    },
    {
      $unwind: "$friendDetails"
    },
    {
      $match: {
        "friendDetails.fullName": { $regex: query, $options: "i" }
      }
    },
    {
      $project: {
        _id: "$friendDetails._id",
        fullName: "$friendDetails.fullName",
        // Include other fields you want to return
      }
    }
  ]);
  
  return res.json(new ApiResponse(200, "Friends fetched successfully", friends));
});

export {
  getFriends, 
  addFriend, 
  removeFriend, 
  searchFriends,
  respondToFriendRequest,
  getPendingRequests,
  getSentRequests
}