import { useState, useRef, useEffect } from "react";
import {
  Phone,
  Video,
  Info,
  ArrowLeft,
  Paperclip,
  Mic,
  Send,
  ImageIcon,
  File,
  MessageCircle,
} from "lucide-react";
import MessageBubble from "./MessageBuble";
import UserAvatar from "./UserAvatar";
import {
  useParams,
  useOutletContext,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import conversationService from "@/services/conversationService";
import useSWR, { mutate } from "swr";
import messageService from "@/services/MessageService";

function ChatArea() {
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const [setIsMobileSidebarOpen] = useOutletContext();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch conversation data
  const { data: conversation, error: conversationError } = useSWR(
    conversationId ? `conversation-${conversationId}` : null,
    () =>
      conversationService
        .getConversationById(conversationId)
        .then((res) => res.data)
  );

  // Fetch messages data
  const { data: messageData, error: messageError, mutate: mutateMessages } =
    useSWR(
      conversationId ? `messages-${conversationId}` : null,
      () =>
        messageService
          .getMessages(conversationId, 1, 50)
          .then((res) => res.data)
    );

  // Check if this is a new conversation from friend selection
  const isNewConversation = searchParams.get("new") === "true";
  const friendId = searchParams.get("friendId");

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messageData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !conversationId || isLoading) return;

    setIsLoading(true);
    try {
      // Create the message data object
      const messagePayload = {
        text: message.trim(),
      };

      // Send message to backend
      const response = await messageService.sendMessage(
        conversationId,
        messagePayload
      );

      if (response.success) {
        // Clear input
        setMessage("");

        // Optimistically update the messages list
        if (messageData) {
          const newMessagesList = [response.data, ...messageData.messages];
          mutateMessages(
            {
              ...messageData,
              messages: newMessagesList,
            },
            false
          );
        }

        // Scroll to bottom
        setTimeout(scrollToBottom, 100);

        // Refresh messages from server
        mutateMessages();

        // Also refresh conversations to update last message
        mutate("conversations");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getConversationTitle = () => {
    if (!conversation) return "";

    if (conversation.conversationType === "private") {
      return conversation.displayName || "Unknown User";
    } else {
      return conversation.displayName || "Group Chat";
    }
  };

  const getConversationAvatar = () => {
    if (!conversation) return "";
    return conversation.displayPicture || "/placeholder.svg?height=40&width=40";
  };

  const getOnlineStatus = () => {
    if (!conversation) return "";

    if (conversation.conversationType === "private") {
      return "Online"; // You can implement real online status later
    } else {
      return `${conversation.participants?.length || 0} members`;
    }
  };

  // Loading state
  if (conversationError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-500 mt-2">Failed to load conversation</p>
          <button
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
            onClick={() => navigate("/")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">
            Welcome to Chatty
          </h2>
          <p className="text-gray-500 mt-2">
            Select a conversation to start chatting
          </p>
          <button
            className="md:hidden mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            Show Conversations
          </button>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading conversation...</p>
        </div>
      </div>
    );
  }

  const messages = messageData?.messages || [];
  const hasMessages = messages.length > 0;

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <button
            className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <UserAvatar
            profilePicture={getConversationAvatar()}
            fullName={getConversationTitle()}
          />
          <div className="ml-3">
            <p className="font-medium">{getConversationTitle()}</p>
            <p className="text-xs text-green-500">{getOnlineStatus()}</p>
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
        {!hasMessages ? (
          // Empty conversation UI
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Start the conversation
              </h3>
              <p className="text-gray-500 mb-4">
                Send a message to {getConversationTitle()} to begin chatting
              </p>
              <div className="text-sm text-gray-400">
                Say hello, share a thought, or ask a question!
              </div>
            </div>
          </div>
        ) : (
          // Messages list (reversed since we get them in desc order from backend)
          messages
            .slice()
            .reverse()
            .map((msg, index, reversedArray) => {
              const showAvatar =
                index === 0 ||
                reversedArray[index - 1].sender._id !== msg.sender._id;

              return (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isOwn={false}
                  showAvatar={showAvatar}
                />
              );
            })
        )}
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
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 text-purple-600"
                >
                  <ImageIcon size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 text-purple-600"
                >
                  <File size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 text-purple-600"
                >
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
            disabled={isLoading}
          />

          {message.trim() ? (
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send size={20} />
              )}
            </button>
          ) : (
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Mic size={20} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default ChatArea;
