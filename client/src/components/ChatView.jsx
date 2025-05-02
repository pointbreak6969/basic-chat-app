// app/components/ChatView.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, Video, MoreHorizontal, ImageIcon, Smile, Paperclip, Send } from "lucide-react";



export default function ChatView() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "Hey, how's it going?",
      timestamp: new Date(2025, 3, 16, 10, 30),
      isCurrentUser: false
    },
    {
      id: "2",
      content: "Pretty good! Just working on that project we discussed.",
      timestamp: new Date(2025, 3, 16, 10, 32),
      isCurrentUser: true
    },
    {
      id: "3",
      content: "How far along are you with the design phase?",
      timestamp: new Date(2025, 3, 16, 10, 35),
      isCurrentUser: false
    },
    {
      id: "4",
      content: "Almost done! I should have the mockups ready by tomorrow.",
      timestamp: new Date(2025, 3, 16, 10, 36),
      isCurrentUser: true
    },
    {
      id: "5",
      content: "That's great news! The client is eager to see them.",
      timestamp: new Date(2025, 3, 16, 10, 38),
      isCurrentUser: false
    },
    {
      id: "6",
      content: "I'll make sure they look perfect before sending them over.",
      timestamp: new Date(2025, 3, 16, 10, 40),
      isCurrentUser: true
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Mock chat data
  const chatName = "Sarah Williams";
  const chatAvatar = "https://randomuser.me/api/portraits/women/44.jpg";

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now().toString(),
        content: newMessage,
        timestamp: new Date(),
        isCurrentUser: true
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center">
          <Avatar className="h-9 w-9 mr-3">
            <AvatarImage src={chatAvatar} alt={chatName} />
            <AvatarFallback className="bg-zinc-700">{chatName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{chatName}</h2>
            <p className="text-xs text-zinc-400">Active now</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full">
            <Phone size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full">
            <Video size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full">
            <MoreHorizontal size={20} />
          </Button>
        </div>
      </div>
      
      {/* Message Area with Winter Theme Background */}
      <div 
        className="flex-1 relative bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/images/winter-chat-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <ScrollArea className="h-full p-4">
          <div className="space-y-4" ref={scrollAreaRef}>
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isCurrentUser && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarImage src={chatAvatar} alt={chatName} />
                    <AvatarFallback className="bg-zinc-700">{chatName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div 
                  className={`rounded-2xl px-4 py-2 max-w-[70%] break-words ${
                    message.isCurrentUser 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-800 text-white'
                  }`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 flex items-center gap-2">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full"
        >
          <Paperclip size={20} />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full"
        >
          <ImageIcon size={20} />
        </Button>
        <div className="flex-1 relative">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message..."
            className="bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 pr-12"
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white hover:bg-transparent"
          >
            <Smile size={20} />
          </Button>
        </div>
        <Button 
          type="submit" 
          variant="ghost" 
          size="icon" 
          className="text-blue-500 hover:text-blue-400 hover:bg-zinc-800 rounded-full"
          disabled={!newMessage.trim()}
        >
          <Send size={20} />
        </Button>
      </form>
    </div>
  );
}