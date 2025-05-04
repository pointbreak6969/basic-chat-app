import { useState } from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import "../../src/App.css";

function Home() {
    const [activeConversation, setActiveConversation] = useState(null)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          activeConversation={activeConversation}
          setActiveConversation={setActiveConversation}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
        <ChatArea activeConversation={activeConversation} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
      </div>
    )
  }
export default Home;