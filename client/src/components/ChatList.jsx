
import { useState } from 'react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";



export default function ChatList({ chats, activeChatId }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-zinc-800">
        <h1 className="text-xl font-bold">messenger</h1>
        <Button size="icon" variant="ghost" className="rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
            <line x1="18" y1="8" x2="23" y2="13"></line>
            <line x1="23" y1="8" x2="18" y2="13"></line>
          </svg>
        </Button>
      </div>
      
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
          <Input 
            placeholder="Search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500"
          />
        </div>
      </div>
      
      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredChats.map(chat => (
            <Link 
              href={`/chat/${chat.id}`} 
              key={chat.id}
              className={`flex items-center p-3 rounded-lg ${activeChatId === chat.id ? 'bg-zinc-800' : 'hover:bg-zinc-800'}`}
            >
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={chat.avatar} alt={chat.name} />
                <AvatarFallback className="bg-zinc-700">{chat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium truncate">{chat.name}</h3>
                  <span className="text-xs text-zinc-400">{chat.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-400 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unreadCount && (
                <div className="ml-2 bg-blue-600 rounded-full h-5 w-5 flex items-center justify-center">
                  <span className="text-xs">{chat.unreadCount}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </ScrollArea>
      
      {/* Bottom Navigation (Mobile Only) */}
      <div className="md:hidden flex justify-around p-3 border-t border-zinc-800">
        <Button variant="ghost" size="icon" className="rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </Button>
      </div>
    </div>
  );
}