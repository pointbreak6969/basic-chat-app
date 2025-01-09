import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "@/context/SocketContext";
const MessageBar = () => {
  const emojiRef = useRef()
  const socket = useSocket()
  const [message, setMessage] = useState("");
  const {selectedChatType, selectedChatData, userInfo} = useAppStore()
  const handleSendMessage = () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage",{
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      } )
    }
  };
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  useEffect(()=>{
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return ()=>{
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [emojiRef])

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 ">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 ">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={() => {
            setMessage(e.target.value);
          }}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" />
        </button>
      </div>
      <div className="relative">
        <button onClick={()=>{setEmojiPickerOpen(true)}} className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <EmojiComponent  className="text-2xl" />
        </button>
        <div className="absolute bottom-16 right-0" ref={emojiRef}>
          <EmojiPicker theme="dark" open={emojiPickerOpen} onEmojiClick={handleAddEmoji}
          autoFocusSearch={false}
          />
        </div>
      </div>
      <div>
        <button
          onClick={handleSendMessage}
          className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        >
          <SendIcon className="text-2xl" />
        </button>
      </div>
    </div>
  );
};
export default MessageBar;
