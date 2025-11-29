export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  token?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date | string;
  isRead: boolean;
}

// Kullanıcı konuşma listesi için
export interface ChatUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
    isRead: boolean;
  };
  unreadCount?: number;
  isOnline?: boolean;
}

// Arama sonuçları için
export interface UserSearchResult {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  isOnline?: boolean;
}

// Conversation (sohbet geçmişi)
export interface Conversation {
  userId: string;
  user: ChatUser;
  lastMessage?: {
    content: string;
    timestamp: Date | string;
    isRead: boolean;
  };
  lastMessageAt: Date | string;
  unreadCount: number;
}

export interface LoginDto {
  email: string;
  password?: string; // LoginForm'da password zorunlu ama tip esnekliği için
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  fullName: string;
  email: string;
  token: string;
}
