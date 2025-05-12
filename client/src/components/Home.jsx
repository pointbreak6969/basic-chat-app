import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import "../../src/App.css";

function Home() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);
    const location = useLocation();
    
    // For mobile: show sidebar by default on home route, hide when on chat route
    useEffect(() => {
      if (location.pathname === '/') {
        setIsMobileSidebarOpen(true);
      } else if (location.pathname.includes('/chat/')) {
        setIsMobileSidebarOpen(false);
      }
    }, [location.pathname]);
  
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