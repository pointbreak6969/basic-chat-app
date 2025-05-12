import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "../../src/App.css";

function Home() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
        <Outlet context={[setIsMobileSidebarOpen]} />
      </div>
    )
  }
export default Home;