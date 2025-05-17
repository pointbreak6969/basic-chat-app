"use client";

import { useState, useEffect } from "react";
import { Search, Settings, MessageCirclePlus, X, UserPlus } from "lucide-react";
import ConversationItem from "./ConversationItem";
import UserAvatar from "./UserAvatar";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import friendService from "@/services/FriendService";
import conversationService from "@/services/conversationService";
import useSWR from "swr";

function Sidebar({ isMobileSidebarOpen, setIsMobileSidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);
  const { data: friends = [] } = useSWR("friends", () =>
    friendService.getFriends(friendSearchQuery).then((res) => res.data.friends)
  );
  const { data: conversationsData = { data: [] } } = useSWR("conversations", () =>
    conversationService.getConversations()
  );
  
  const conversations = conversationsData.data || [];
  
  const filteredConversations = conversations.filter((conv) => {
    if (conv.conversationType === "private") {
      return conv.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return conv.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  useEffect(() => {
    setFilteredFriends(
      friends.filter((friend) =>
        friend.fullName.toLowerCase().includes(friendSearchQuery.toLowerCase())
      )
    );
  }, [friendSearchQuery, friends]);

  const handleFriendClick = (friend) => {
    // Find if there's an existing conversation with this friend
    const existingConversation = conversations.find(
      (conv) =>
        conv.conversationType === "private" && 
        conv.participantInfo && 
        conv.participantInfo._id === friend._id
    );

    if (existingConversation) {
      // Navigate to existing conversation
      navigate(`/chat/${existingConversation._id}`);
    } else {
      // In a real app, you would create a new conversation here
      // For now, simulate creating a conversation by navigating to the first conversation
      // This is just for demo purposes - in a real app you'd create a new conversation record
      console.log("Would create new conversation with:", friend.fullName);

      // For demo: Navigate to first conversation and pretend it's with this friend
      // In a real app, you would create a new conversation and navigate to it
      navigate(
        `/chat/new?new=true&friendId=${friend._id}`
      );
    }

    setShowFriendsList(false);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div
      className={`${
        isMobileSidebarOpen ? "block" : "hidden"
      } md:block w-full md:w-80 bg-white border-r border-gray-200 h-full flex flex-col z-10 ${
        isMobileSidebarOpen ? "absolute" : "relative"
      }`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-purple-600">Chatty</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Link to="/settings">
              <Settings size={20} className="text-gray-600" />
            </Link>
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setShowFriendsList(!showFriendsList)}
          >
            <MessageCirclePlus size={20} className="text-gray-600" />
          </button>
          {/* <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X size={20} className="text-gray-600" />
          </button> */}
        </div>
      </div>

      {!showFriendsList && (
        <div className="p-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full p-2 pl-9 rounded-full bg-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-500"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {showFriendsList ? (
          <div className="p-3 border-b border-gray-200">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search friends..."
                className="w-full p-2 pl-9 rounded-full bg-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={friendSearchQuery}
                onChange={(e) => setFriendSearchQuery(e.target.value)}
              />
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-gray-500"
              />
            </div>
            <h3 className="font-medium text-gray-700 mb-2">Friends</h3>
            {filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className="p-2 flex items-center hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => handleFriendClick(friend)}
              >
                <UserAvatar
                  profilePicture={friend.profilePicture}
                  fullName={friend.fullName}
                />
                <div className="ml-3">
                  <p className="font-medium">{friend.fullName}</p>
                  <p
                    className={`text-xs ${
                      friend.status === "online"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {friend.status === "online" ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <Link
              to={`/chat/${conversation._id}`}
              key={conversation._id}
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <ConversationItem
                conversation={conversation}
                isActive={conversationId === conversation._id}
                currentUser={currentUser}
              />
            </Link>
          ))
        )}
      </div>

      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center">
          <UserAvatar
            profilePicture={currentUser.profilePicture}
            fullName={currentUser.fullName}
          />
          <div className="ml-3">
            <p className="font-medium">{currentUser.fullName}</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
