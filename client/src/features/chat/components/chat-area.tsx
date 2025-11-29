import { useEffect, useRef } from "react";
import { MessageBubble } from "@/features/chat/components/message-buble";
import { ChatInput } from "./chat-input";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { Loader2 } from "lucide-react";

export function ChatArea() {
  const { messages, selectedUser, selectedUserId, sendMessage, isLoadingMessages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);

  // Mesajlar her güncellendiğinde en alta scroll et
  useEffect(() => {
    // Küçük bir gecikme ile scroll yap (DOM'un güncellenmesi için)
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!selectedUserId) {
      alert("Önce bir kullanıcı seçin!");
      return;
    }
    sendMessage(selectedUserId, content);
  };

  // Kullanıcı seçilmemişse bilgilendirme göster
  if (!selectedUserId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Mesajlaşmaya başla</h2>
        <p className="text-muted-foreground">
          Sol taraftan bir kullanıcı seçin veya yeni bir konuşma başlatın
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Chat Header */}
      {selectedUser && (
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.fullName} />
              <AvatarFallback>
                {selectedUser.fullName?.substring(0, 2).toUpperCase() || "??"}
              </AvatarFallback>
            </Avatar>
            {selectedUser.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{selectedUser.fullName}</h3>
            <p className="text-xs text-muted-foreground">
              {selectedUser.isOnline ? "Çevrimiçi" : "Çevrimdışı"}
            </p>
          </div>
        </div>
      )}

      {/* Mesaj Listesi */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-10">
            Henüz mesaj yok. İlk mesajı sen gönder! 👋
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={`msg-${msg.id}`}
                content={msg.content}
                isOwnMessage={msg.senderId === user?.id}
                timestamp={new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                status={msg.isRead ? "read" : "sent"}
                senderName={msg.senderId === user?.id ? user?.fullName : selectedUser?.fullName}
                senderAvatar={msg.senderId === user?.id ? user?.avatarUrl : selectedUser?.avatarUrl}
              />
            ))}
            <div ref={messagesEndRef} style={{ height: "1px" }} />
          </>
        )}
      </div>

      {/* Input Alanı */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}

// Import eksiklerini ekle
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
