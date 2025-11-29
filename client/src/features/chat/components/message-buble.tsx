import { cn } from "@/utils/cn";
import { Check, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageBubbleProps {
  content: string;
  isOwnMessage: boolean; // Mesaj benim mi?
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  senderName?: string;
  senderAvatar?: string;
}

export function MessageBubble({
  content,
  isOwnMessage,
  timestamp,
  status = "sent",
  senderName,
  senderAvatar,
}: MessageBubbleProps) {
  const displayName = isOwnMessage ? "Sen" : senderName || "User";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div
      className={cn(
        "flex mt-2 space-x-3 max-w-[75%]",
        // Eğer mesaj benimse sağa yasla ve sıralamayı tersine çevir
        isOwnMessage 
          ? "ml-auto flex-row-reverse space-x-reverse" 
          : "mr-auto"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={senderAvatar} alt={displayName} />
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className="flex flex-col max-w-md">
        {/* Sender Name */}
        <span
          className={cn(
            "text-xs font-medium mb-1 px-1",
            isOwnMessage ? "text-right" : "text-left"
          )}
        >
          {displayName}
        </span>

        {/* Message Bubble */}
        <div
          className={cn(
            "relative px-4 py-2 text-sm shadow-sm break-words",
            isOwnMessage
              ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm" // Benim mesajım (Köşeli kenar sağ üstte)
              : "bg-muted text-foreground rounded-2xl rounded-tl-sm" // Karşı taraf (Köşeli kenar sol üstte)
          )}
        >
          <p className="leading-relaxed">{content}</p>

        {/* Zaman ve Okundu Bilgisi */}
        <div
          className={cn(
            "flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70",
            isOwnMessage
              ? "text-primary-foreground/90"
              : "text-muted-foreground"
          )}
        >
          <span>{timestamp}</span>
          {isOwnMessage && (
            <span>
              {status === "sent" && <Check className="w-3 h-3" />}
              {status === "read" && <CheckCheck className="w-3 h-3" />}
            </span>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
