import { useState, useRef, useEffect } from "react"
import { Phone, Video, Info, ArrowLeft, Paperclip, Mic, Send, ImageIcon, File } from "lucide-react"
import MessageBubble from "./MessageBuble"
import UserAvatar from "./UserAvatar"
import { useParams, useOutletContext, useSearchParams, useNavigate } from "react-router-dom"

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

// Mock messages for the active conversation
const getMockMessages = (conversationId) => {
  const baseMessages = [
    {
      _id: "1",
      sender: { _id: "2", fullName: "Jane Smith", profilePicture: "/placeholder.svg?height=40&width=40" },
      type: "text",
      content: { type: "text", text: "Hey there! How are you doing today?" },
      status: "seen",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      _id: "2",
      sender: { _id: "1", fullName: "You", profilePicture: "/placeholder.svg?height=40&width=40" },
      type: "text",
      content: { type: "text", text: "I'm good, thanks! Just working on this new project." },
      status: "seen",
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
    },
    {
      _id: "3",
      sender: { _id: "2", fullName: "Jane Smith", profilePicture: "/placeholder.svg?height=40&width=40" },
      type: "text",
      content: { type: "text", text: "That sounds interesting! What kind of project is it?" },
      status: "seen",
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
    },
    {
      _id: "4",
      sender: { _id: "1", fullName: "You", profilePicture: "/placeholder.svg?height=40&width=40" },
      type: "text",
      content: { type: "text", text: "It's a chat application, similar to Messenger. I'm building it with React." },
      status: "seen",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      _id: "5",
      sender: { _id: "2", fullName: "Jane Smith", profilePicture: "/placeholder.svg?height=40&width=40" },
      type: "file",
      content: {
        type: "file",
        fileUrl: "/placeholder.svg?height=200&width=300",
        fileName: "design-mockup.png",
        fileSize: 2500000,
        fileType: "image/png",
      },
      status: "seen",
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
    },
    {
      _id: "6",
      sender: { _id: "2", fullName: "Jane Smith", profilePicture: "/placeholder.svg?height=40&width=40" },
      type: "text",
      content: { type: "text", text: "Here's a mockup that might help with your design!" },
      status: "seen",
      timestamp: new Date(Date.now() - 1000 * 60 * 39),
    },
    {
      _id: "7",
      sender: { _id: "1", fullName: "You", profilePicture: "/placeholder.svg?height=40&width=40" },
      type: "text",
      content: { type: "text", text: "Thanks! This looks great. I'll use it as a reference." },
      status: "delivered",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      _id: "8",
      sender: { _id: "1", fullName: "You", profilePicture: "/placeholder.svg?height=40&width=40" },
      type: "voice",
      content: {
        type: "voice",
        fileUrl: "#",
        duration: 15,
      },
      status: "delivered",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
    },
    {
      _id: "9",
      sender: { _id: "2", fullName: "Jane Smith", profilePicture: "/placeholder.svg?height=40&width=40" },
      type: "text",
      content: {
        type: "text",
        text: "I'll check your voice note later. By the way, do you need any help with the project?",
      },
      status: "delivered",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
  ]

  // Add more messages for group chats
  if (conversationId === "3") {
    return [
      ...baseMessages,
      {
        _id: "10",
        sender: { _id: "3", fullName: "John Doe", profilePicture: "/placeholder.svg?height=40&width=40" },
        type: "text",
        content: { type: "text", text: "Hey everyone! When is our next meeting?" },
        status: "seen",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
      },
      {
        _id: "11",
        sender: { _id: "4", fullName: "Mike Johnson", profilePicture: "/placeholder.svg?height=40&width=40" },
        type: "text",
        content: { type: "text", text: "I think it's scheduled for tomorrow at 3pm." },
        status: "seen",
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
      },
    ]
  }

  return baseMessages
}

function ChatArea() {
  const { conversationId } = useParams()
  const [searchParams] = useSearchParams()
  const [setIsMobileSidebarOpen] = useOutletContext()
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [activeConversation, setActiveConversation] = useState(null)
  const messagesEndRef = useRef(null)

  // Check if this is a new conversation from friend selection
  const isNewConversation = searchParams.get('new') === 'true'
  const friendId = searchParams.get('friendId')
  const friendName = searchParams.get('friendName')

  // Find the active conversation based on URL param
  useEffect(() => {
    if (conversationId) {
      // In a real app you would fetch this from an API
      // For now, we use the mock data
      const conversation = mockConversations.find(conv => conv._id === conversationId)
      
      // If this is a "new" conversation from selecting a friend in the sidebar
      if (isNewConversation && friendId && friendName && conversation) {
        // Override conversation participant info with the selected friend info
        // This is just for demo purposes - in a real app, you'd create a proper conversation
        const modifiedConversation = {
          ...conversation,
          participants: [
            {
              _id: friendId,
              fullName: friendName,
              profilePicture: "/placeholder.svg?height=40&width=40"
            }
          ]
        }
        setActiveConversation(modifiedConversation)
      } else {
        setActiveConversation(conversation || null)
      }
    } else {
      setActiveConversation(null)
    }
  }, [conversationId, isNewConversation, friendId, friendName])

  useEffect(() => {
    if (activeConversation) {
      let conversationMessages = getMockMessages(activeConversation._id)
      
      // If this is a new conversation from friend selection, add a welcome message
      if (isNewConversation && friendId) {
        const welcomeMessage = {
          _id: "welcome-" + Date.now(),
          sender: { _id: "1", fullName: "You", profilePicture: "/placeholder.svg?height=40&width=40" },
          type: "text",
          content: { type: "text", text: `Hey ${friendName}! I just wanted to say hello.` },
          status: "sent",
          timestamp: new Date(),
        }
        
        // Add welcome message to beginning of conversation
        conversationMessages = [...conversationMessages, welcomeMessage]
      }
      
      setMessages(conversationMessages)
    } else {
      setMessages([])
    }
  }, [activeConversation, isNewConversation, friendId, friendName])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim() || !activeConversation) return

    const newMessage = {
      _id: Date.now().toString(),
      sender: { _id: "1", fullName: "You", profilePicture: "/placeholder.svg?height=40&width=40" },
      type: "text",
      content: { type: "text", text: message },
      status: "sent",
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const getConversationTitle = () => {
    if (!activeConversation) return ""

    if (activeConversation.type === "private") {
      return activeConversation.participants[0].fullName
    } else {
      return activeConversation.metadata.name
    }
  }

  const getConversationAvatar = () => {
    if (!activeConversation) return ""

    if (activeConversation.type === "private") {
      return activeConversation.participants[0].profilePicture
    } else {
      return activeConversation.metadata.avatar
    }
  }

  if (!activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Welcome to Chatty</h2>
          <p className="text-gray-500 mt-2">Select a conversation to start chatting</p>
          <button
            className="md:hidden mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            Show Conversations
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <button
            className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <UserAvatar
            profilePicture={getConversationAvatar()}
            fullName={getConversationTitle()}
          />
          <div className="ml-3">
            <p className="font-medium">{getConversationTitle()}</p>
            {activeConversation.type === "private" ? (
              <p className="text-xs text-green-500">Online</p>
            ) : (
              <p className="text-xs text-gray-500">{activeConversation.participants.length} members</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Phone size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Video size={20} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Info size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => {
          const showAvatar =
            msg.sender._id !== "1" && (index === 0 || messages[index - 1].sender._id !== msg.sender._id)

          return <MessageBubble key={msg._id} message={msg} isOwn={msg.sender._id === "1"} showAvatar={showAvatar} />
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <div className="relative">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
            >
              <Paperclip size={20} />
            </button>

            {showAttachmentOptions && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex space-x-2">
                <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-purple-600">
                  <ImageIcon size={20} />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-purple-600">
                  <File size={20} />
                </button>
                <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-purple-600">
                  <Mic size={20} />
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 mx-2 rounded-full bg-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {message.trim() ? (
            <button type="submit" className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700">
              <Send size={20} />
            </button>
          ) : (
            <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
              <Mic size={20} />
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default ChatArea
