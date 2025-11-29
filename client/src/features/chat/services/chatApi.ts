import api from "@/lib/api";
import type {
  ChatUser,
  UserSearchResult,
  Conversation,
  Message,
} from "@/types";

export const chatApi = {
  // Kullanıcı arama
  searchUsers: async (query: string): Promise<UserSearchResult[]> => {
    const response = await api.get<UserSearchResult[]>(
      `/User/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  // Tüm kullanıcıları getir
  getAllUsers: async (): Promise<UserSearchResult[]> => {
    const response = await api.get<UserSearchResult[]>("/User/all");
    return response.data;
  },

  // Kullanıcı detayı
  getUserDetails: async (userId: string): Promise<ChatUser> => {
    const response = await api.get<ChatUser>(`/User/${userId}`);
    return response.data;
  },

  // Mevcut kullanıcı profili
  getCurrentUser: async (): Promise<ChatUser> => {
    const response = await api.get<ChatUser>("/User/me");
    return response.data;
  },

  // Belirli bir kullanıcıyla mesaj geçmişini getir
  getMessagesWithUser: async (
    userId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<{ messages: Message[]; hasMore: boolean }> => {
    const response = await api.get<{ messages: Message[]; hasMore: boolean }>(
      `/Message/with/${userId}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Konuşma listesini getir
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>("/Message/conversations");
    return response.data;
  },

  // Yeni konuşma başlat
  startConversation: async (userId: string): Promise<Conversation> => {
    const user = await chatApi.getUserDetails(userId);
    return {
      userId: user.id,
      user: user,
      lastMessageAt: new Date(),
      unreadCount: 0,
    };
  },

  // Mesajı okundu olarak işaretle
  markAsRead: async (messageId: string): Promise<void> => {
    await api.put(`/Message/${messageId}/read`);
  },

  // Okunmamış mesaj sayıları
  getUnreadCounts: async (): Promise<{ userId: string; count: number }[]> => {
    const response = await api.get<{ userId: string; count: number }[]>(
      "/Message/unread-counts"
    );
    return response.data;
  },
};
