import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ChatUser } from "@/types";
import { useChatStore } from "@/store/useChatStore";

interface UserListItemProps {
  user: ChatUser;
  isSelected?: boolean;
  onClick: () => void;
}

export function UserListItem({ user, isSelected, onClick }: UserListItemProps) {
  const initials = user.fullName?.substring(0, 2).toUpperCase() || "??";
  const unreadCounts = useChatStore((state) => state.unreadCounts);
  const unreadCount = unreadCounts[user.id] || 0;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-4 border-b transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isSelected && "bg-sidebar-accent text-sidebar-accent-foreground"
      )}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatarUrl} alt={user.fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {/* Online Status */}
        {user.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 text-left overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm truncate">{user.fullName}</span>
          {user.lastMessage && (
            <span className="text-xs text-muted-foreground">
              {new Date(user.lastMessage.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {/* Last Message */}
        {user.lastMessage && (
          <p className="text-xs text-muted-foreground truncate mt-1">
            {user.lastMessage.content}
          </p>
        )}

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full mt-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}
