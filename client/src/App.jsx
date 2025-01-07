import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Chat from "./pages/chat"
import Profile from "./pages/profile"
import Auth from "./pages/auth"
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to ="/auth"/>} />
      </Routes>
    </BrowserRouter>
  )
} 
export default App