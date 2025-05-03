// app/components/MessageInput.tsx


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, ImageIcon, Smile, Send } from "lucide-react";

export default function MessageInput() {
  const [message, setMessage] = useState('');

  

  return (
    <form  className="p-4 border-t border-zinc-800 flex items-center gap-2">
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        
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
        className={`rounded-full ${
          message.trim() 
            ? 'text-blue-500 hover:text-blue-400' 
            : 'text-zinc-400'
        } hover:bg-zinc-800`}
        disabled={!message.trim()}
      >
        <Send size={20} />
      </Button>
    </form>
  );
}