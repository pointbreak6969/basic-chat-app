import UserAvatar from "./UserAvatar"
import { FileText, Play, Download } from "lucide-react"

function MessageBubble({ message, isOwn, showAvatar }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return <span className="text-gray-400 ml-1">✓</span>
      case "delivered":
        return <span className="text-gray-500 ml-1">✓✓</span>
      case "seen":
        return <span className="text-purple-500 ml-1">✓✓</span>
      default:
        return null
    }
  }

  const renderMessageContent = () => {
    switch (message.type) {
      case "text":
        return <p className="whitespace-pre-wrap">{message.content.text}</p>

      case "file":
        if (message.content.fileType?.startsWith("image/")) {
          return (
            <div className="mt-1">
              <img
                src={message.content.fileUrl || "/placeholder.svg"}
                alt={message.content.fileName || "Image"}
                className="max-w-xs rounded-lg max-h-60 object-cover"
              />
              <div className="flex items-center mt-1 text-sm">
                <span className="truncate flex-1">{message.content.fileName}</span>
                <button className="p-1 rounded-full hover:bg-gray-200">
                  <Download size={16} />
                </button>
              </div>
            </div>
          )
        } else {
          return (
            <div className="flex items-center mt-1 bg-white p-2 rounded-lg">
              <FileText size={24} className="text-purple-600 mr-2" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{message.content.fileName}</p>
                <p className="text-xs text-gray-500">{(message.content.fileSize / 1024 / 1024).toFixed(1)} MB</p>
              </div>
              <button className="p-1 rounded-full hover:bg-gray-200">
                <Download size={16} />
              </button>
            </div>
          )
        }

      case "voice":
        return (
          <div className="flex items-center bg-white p-2 rounded-lg">
            <button className="p-1 rounded-full bg-purple-100 text-purple-600 mr-2">
              <Play size={16} />
            </button>
            <div className="w-32 h-2 bg-gray-200 rounded-full">
              <div className="w-1/3 h-full bg-purple-500 rounded-full"></div>
            </div>
            <span className="ml-2 text-xs text-gray-500">
              {Math.floor(message.content.duration / 60)}:{(message.content.duration % 60).toString().padStart(2, "0")}
            </span>
          </div>
        )

      default:
        return <p>Unsupported message type</p>
    }
  }

  return (
    <div className={`flex mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && showAvatar && (
        <div className="mr-2 flex-shrink-0">
          <UserAvatar src={message.sender.profilePicture} size="sm" />
        </div>
      )}

      <div className={`max-w-xs md:max-w-md ${!isOwn && !showAvatar ? "ml-8" : ""}`}>
        {!isOwn && showAvatar && <p className="text-xs text-gray-500 mb-1 ml-1">{message.sender.fullName}</p>}

        <div className={`rounded-lg p-3 ${isOwn ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"}`}>
          {renderMessageContent()}
        </div>

        <div className="flex items-center mt-1">
          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          {isOwn && getStatusIcon(message.status)}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
