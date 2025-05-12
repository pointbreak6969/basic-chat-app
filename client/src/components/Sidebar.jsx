"use client"

import { useState, useEffect } from "react"
import { Search, Settings, Plus, X } from "lucide-react"
import ConversationItem from "./ConversationItem"
import UserAvatar from "./UserAvatar"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
// Mock data for conversations
const mockConversations = [
  {
    _id: "1",
    type: "private",
    participants: [{ _id: "2", fullName: "Jane Smith", profilePicture: "/placeholder.svg?height=40&width=40" }],
    lastMessage: {
      text: "Hey, how are you doing?",
      timeStamp: new Date(Date.now() - 1000 * 60 * 5),
      status: "seen",
    },
  },
  {
    _id: "2",
    type: "private",
    participants: [{ _id: "3", fullName: "John Doe", profilePicture: "/placeholder.svg?height=40&width=40" }],
    lastMessage: {
      text: "Can we meet tomorrow?",
      timeStamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "delivered",
    },
  },
  {
    _id: "3",
    type: "group",
    participants: [
      { _id: "2", fullName: "Jane Smith", profilePicture: "/placeholder.svg?height=40&width=40" },
      { _id: "3", fullName: "John Doe", profilePicture: "/placeholder.svg?height=40&width=40" },
      { _id: "4", fullName: "Mike Johnson", profilePicture: "/placeholder.svg?height=40&width=40" },
    ],
    metadata: {
      name: "Project Team",
      description: "Team discussion",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: {
      text: "Meeting at 3pm",
      timeStamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: "sent",
    },
  },
  {
    _id: "4",
    type: "private",
    participants: [{ _id: "5", fullName: "Sarah Williams", profilePicture: "/placeholder.svg?height=40&width=40" }],
    lastMessage: {
      text: "Thanks for your help!",
      timeStamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: "seen",
    },
  },
  {
    _id: "5",
    type: "group",
    participants: [
      { _id: "6", fullName: "Alex Brown", profilePicture: "/placeholder.svg?height=40&width=40" },
      { _id: "7", fullName: "Emily Davis", profilePicture: "/placeholder.svg?height=40&width=40" },
      { _id: "8", fullName: "Chris Wilson", profilePicture: "/placeholder.svg?height=40&width=40" },
    ],
    metadata: {
      name: "Friends Group",
      description: "Weekend plans",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: {
      text: "Who's free this weekend?",
      timeStamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      status: "seen",
    },
  },
]

// Mock data for friends
const mockFriends = [
  { _id: "2", fullName: "Jane Smith", profilePicture: "/placeholder.svg?height=40&width=40", status: "online" },
  { _id: "3", fullName: "John Doe", profilePicture: "/placeholder.svg?height=40&width=40", status: "offline" },
  { _id: "4", fullName: "Mike Johnson", profilePicture: "/placeholder.svg?height=40&width=40", status: "online" },
  { _id: "5", fullName: "Sarah Williams", profilePicture: "/placeholder.svg?height=40&width=40", status: "offline" },
  { _id: "6", fullName: "Alex Brown", profilePicture: "/placeholder.svg?height=40&width=40", status: "online" },
  { _id: "7", fullName: "Emily Davis", profilePicture: "/placeholder.svg?height=40&width=40", status: "online" },
  { _id: "8", fullName: "Chris Wilson", profilePicture: "/placeholder.svg?height=40&width=40", status: "offline" },
  { _id: "9", fullName: "Lisa Taylor", profilePicture: "/placeholder.svg?height=40&width=40", status: "online" },
  { _id: "10", fullName: "David Miller", profilePicture: "/placeholder.svg?height=40&width=40", status: "offline" },
]

// Mock current user
// const currentUser = {
//   _id: "1",
//   fullName: "You",
//   profilePicture: "/placeholder.svg?height=40&width=40",
// }

function Sidebar({ isMobileSidebarOpen, setIsMobileSidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFriendsList, setShowFriendsList] = useState(false)
  const [friendSearchQuery, setFriendSearchQuery] = useState("")
  const [filteredFriends, setFilteredFriends] = useState(mockFriends)
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth.userData)

  const filteredConversations = mockConversations.filter((conv) => {
    if (conv.type === "private") {
      return conv.participants[0].fullName.toLowerCase().includes(searchQuery.toLowerCase())
    } else {
      return conv.metadata.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
  })

  useEffect(() => {
    setFilteredFriends(
      mockFriends.filter((friend) => friend.fullName.toLowerCase().includes(friendSearchQuery.toLowerCase())),
    )
  }, [friendSearchQuery])

  const handleFriendClick = (friend) => {
    // Find if there's an existing conversation with this friend
    const existingConversation = mockConversations.find(
      (conv) => conv.type === "private" && conv.participants[0]._id === friend._id
    )

    if (existingConversation) {
      // Navigate to existing conversation
      navigate(`/chat/${existingConversation._id}`)
    } else {
      // In a real app, you would create a new conversation here
      // For now, simulate creating a conversation by navigating to the first conversation
      // This is just for demo purposes - in a real app you'd create a new conversation record
      console.log("Would create new conversation with:", friend.fullName)
      
      // For demo: Navigate to first conversation and pretend it's with this friend
      // In a real app, you would create a new conversation and navigate to it
      navigate(`/chat/1?new=true&friendId=${friend._id}&friendName=${encodeURIComponent(friend.fullName)}`)
    }
    
    setShowFriendsList(false)
    setIsMobileSidebarOpen(false)
  }

  return (
    <div
      className={`${isMobileSidebarOpen ? "block" : "hidden"} md:block w-full md:w-80 bg-white border-r border-gray-200 h-full flex flex-col z-10 ${isMobileSidebarOpen ? "absolute" : "relative"}`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-purple-600">Chatty</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setShowFriendsList(!showFriendsList)}>
            <Plus size={20} className="text-gray-600" />
          </button>
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X size={20} className="text-gray-600" />
          </button>
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
            <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
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
              <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
            </div>
            <h3 className="font-medium text-gray-700 mb-2">Friends</h3>
            {filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className="p-2 flex items-center hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => handleFriendClick(friend)}
              >
                <UserAvatar profilePicture={friend.profilePicture} fullName={friend.fullName} />
                <div className="ml-3">
                  <p className="font-medium">{friend.fullName}</p>
                  <p className={`text-xs ${friend.status === "online" ? "text-green-500" : "text-gray-500"}`}>
                    {friend.status === "online" ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <Link to={`/chat/${conversation._id}`} key={conversation._id} onClick={() => setIsMobileSidebarOpen(false)}>
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
          <UserAvatar profilePicture={currentUser.profilePicture} fullName={currentUser.fullName} />
          <div className="ml-3">
            <p className="font-medium">{currentUser.fullName}</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
