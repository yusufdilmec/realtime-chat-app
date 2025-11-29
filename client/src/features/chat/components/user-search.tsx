import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/store/useChatStore";
import { useDebounce } from "@/hooks/use-debounce";

export function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const { searchResults, isSearching, searchUsers, clearSearch, startConversation } = useChatStore();

  useEffect(() => {
    if (debouncedSearch) {
      searchUsers(debouncedSearch);
    } else {
      clearSearch();
    }
  }, [debouncedSearch, searchUsers, clearSearch]);

  const handleUserClick = async (userId: string) => {
    await startConversation(userId);
    setSearchQuery("");
    clearSearch();
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Kullanıcı ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {searchQuery && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {searchResults.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                <AvatarFallback>
                  {user.fullName?.substring(0, 2).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              {user.isOnline && (
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {searchQuery && !isSearching && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-md shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
          Kullanıcı bulunamadı
        </div>
      )}
    </div>
  );
}
