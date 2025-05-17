import UserAvatar from "./UserAvatar"

function ConversationItem({ conversation, isActive, currentUser }) {
  const getTitle = () => {
    return conversation.displayName || "Unnamed Conversation";
  }

  const getAvatar = () => {
    return conversation.displayPicture || null;
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const messageDate = new Date(timestamp)

    // If today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // If this week, show day name
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: "short" })
    }

    // Otherwise show date
    return messageDate.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <span className="text-gray-400">✓</span>
      case "delivered":
        return <span className="text-gray-500">✓✓</span>
      case "seen":
        return <span className="text-purple-500">✓✓</span>
      default:
        return null
    }
  }

  const getLastMessagePreview = () => {
    if (!conversation.lastMessage) {
      return "No messages yet";
    }
    
    return conversation.lastMessage.text || "";
  }
  
  const getLastMessageTime = () => {
    if (!conversation.lastMessage || !conversation.lastMessage.timestamp) {
      return "";
    }
    
    return formatTime(conversation.lastMessage.timestamp);
  }

  return (
    <div
      className={`p-3 flex items-center hover:bg-gray-100 cursor-pointer ${isActive ? "bg-gray-100" : ""}`}
    >
      <UserAvatar profilePicture={getAvatar()} fullName={getTitle()} />
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">{getTitle()}</p>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
            {getLastMessageTime()}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <p className="truncate flex-1">{getLastMessagePreview()}</p>
          <div className="ml-1 flex-shrink-0">
            {conversation.lastMessage && getStatusIcon(conversation.lastMessage.status)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversationItem
