import apiClient from "@/lib/client-api";
import { useAppStore } from "@/store";
import { useEffect, useRef } from "react";
const MessageContainer = () => {
  const scrollRef = useRef(null);
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();
  useEffect(() => {
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);
  const getMessages = async ()=>{
    try {
      const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE, {id: selectedChatData._id}, {withCredentials: true})
      if (response.data.messages ) {
        setSelectedChatMessages(response.data.messages)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((messages) => {
      const messageDate = moment(messages.timestamp).format("DD/MM/YYYY");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={messages._id}>
          {showDate && (
            <div className="text-center text-gray-200 my-2">
              {moment(messages.timestamp).format("LL")}
            </div>
          )}{" "}
          {selectedChatType === "contact" && renderDMMessages(messages)}
        </div>
      );
    });
  };
  const renderDMMessages = (messages) => {
    return (
      <div
        className={`${
          messages.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {messages.messageType === "text" && (
          <div
            className={`${
              messages.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/90 border-[#ffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {messages.content}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(messages.timestamp).format("LT")}
        </div>
      </div>
    );
  };
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw]">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  );
};
export default MessageContainer;
