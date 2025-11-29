import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage(""); // Inputu temizle
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-background border-t">
      <div className="flex items-center gap-2">
        {/* Dosya Ekleme Butonu */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Paperclip className="w-5 h-5" />
          <span className="sr-only">Dosya ekle</span>
        </Button>

        {/* Mesaj Input */}
        <div className="relative flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bir mesaj yazın..."
            className="pr-10 py-6 rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
          {/* Emoji Butonu (Input içinde sağda) */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-8 w-8"
          >
            <Smile className="w-5 h-5" />
          </Button>
        </div>

        {/* Gönder Butonu */}
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          size="icon"
          className="rounded-full shrink-0"
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">Gönder</span>
        </Button>
      </div>
    </div>
  );
}
