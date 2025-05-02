import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Friend from "../models/Friends.js";

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

const addFriend = asyncHandler(async (req, res)=>{
    const userId = req.user._id;
    const {friendId} = req.body;
    if(!friendId) return next(new ApiError(400, "Friend ID is required"))
    const friend = await Friend.create({userA: userId, userB: friendId})
    return res.json(new ApiResponse(200, "Friend added successfully", friend))
})

const removeFriend = asyncHandler(async (req, res)=>{
    const userId = req.user._id;
    const {friendId} = req.body;
    if(!friendId) return next(new ApiError(400, "Friend ID is required"))
    const friend = await Friend.findOneAndDelete({userA: userId, userB: friendId})
    if(!friend) return next(new ApiError(404, "Friend not found"))
    return res.json(new ApiResponse(200, "Friend removed successfully", friend))
})

export {getFriends, addFriend, removeFriend}