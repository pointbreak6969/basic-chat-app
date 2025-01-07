import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ContactsContainer from "./components/contacts-container"
import EmptyChatContainer from "./components/empty-chat-container"
import ChatContainer from "./components/chat-container"

const Chat = () => {
  const {userInfo} = useProfile()
  const navigate = useNavigate()
  useEffect(()=>{
    if (!userInfo) {
      toast("Please complete profile")
      navigate("/profile")
    }
  }, [userInfo, navigate])
  
  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
    <ContactsContainer/>
    <EmptyChatContainer/>
    <ChatContainer/>
    </div>
  )
}
export default Chat