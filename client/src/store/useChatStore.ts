import { create } from "zustand";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";
import { useAuthStore } from "./useAuthStore";
import { chatApi } from "@/features/chat/services/chatApi";
import type { ChatUser, Conversation, UserSearchResult, Message } from "@/types";

interface ChatState {
  messages: Message[];
  connection: HubConnection | null;
  isConnected: boolean;
  
  // Yeni state'ler
  conversations: Conversation[];
  selectedUserId: string | null;
  selectedUser: ChatUser | null;
  searchResults: UserSearchResult[];
  isSearching: boolean;
  isLoadingMessages: boolean;
  unreadCounts: Record<string, number>;
  
  // Mevcut actions
  initializeConnection: () => Promise<void>;
  disconnectConnection: () => void;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  addMessage: (msg: Message) => void;
  
  // Yeni actions
  setSelectedUser: (userId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  loadMessagesForUser: (userId: string) => Promise<void>;
  clearSearch: () => void;
  startConversation: (userId: string) => Promise<void>;
  clearMessages: () => void;
  showNotification: (title: string, body: string) => void;
  incrementUnreadCount: (userId: string) => void;
  clearUnreadCount: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  connection: null,
  isConnected: false,
  conversations: [],
  selectedUserId: null,
  selectedUser: null,
  searchResults: [],
  isSearching: false,
  isLoadingMessages: false,
  unreadCounts: {},

  initializeConnection: async () => {
    const token = useAuthStore.getState().user?.token;
    
    console.log("🔌 SignalR Connection - Token:", token ? "✅ Var" : "❌ Yok");
    
    if (!token) {
      console.error("❌ Token bulunamadı, SignalR bağlantısı yapılamıyor");
      return;
    }

    if (get().connection?.state === HubConnectionState.Connected) {
      console.log("✅ SignalR zaten bağlı");
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5285/chathub", {
        accessTokenFactory: () => {
          console.log("🎫 SignalR Token factory çağrıldı");
          return token;
        },
      })
      .withAutomaticReconnect()
      .build();

    // Başkasından gelen mesajları dinle
    connection.on("ReceiveMessage", (message: Message) => {
      console.log("📨 Mesaj alındı (ReceiveMessage):", message);
      const currentUserId = get().selectedUserId;
      const currentUser = useAuthStore.getState().user;
      
      // Sadece seçili kullanıcıdan gelen mesajları ekle
      if (message.senderId === currentUserId) {
        set((state) => {
          // Duplicate kontrolü
          const exists = state.messages.some(m => m.id === message.id);
          if (exists) return state;
          return { messages: [...state.messages, message] };
        });
      }
      
      // Eğer mesaj başka bir kullanıcıdan ve o kullanıcı seçili değilse
      if (message.senderId !== currentUserId && message.receiverId === currentUser?.id) {
        // Unread count artır
        get().incrementUnreadCount(message.senderId);
        
        // Bildirim göster
        get().showNotification(
          "Yeni Mesaj",
          `${message.senderId}: ${message.content.substring(0, 50)}...`
        );
      }
    });

    // Kendi gönderdiğimiz mesajların onayını dinle
    connection.on("MessageSent", (message: Message) => {
      console.log("✅ Mesaj gönderildi onayı (MessageSent):", message);
      const currentUserId = get().selectedUserId;
      // Seçili kullanıcıya gönderilen mesajı ekle (kendi mesajımız)
      if (message.receiverId === currentUserId) {
        set((state) => {
          // Duplicate kontrolü
          const exists = state.messages.some(m => m.id === message.id);
          if (exists) return state;
          return { messages: [...state.messages, message] };
        });
      }
    });

    try {
      await connection.start();
      console.log("🟢 SignalR Bağlandı");
      set({ connection, isConnected: true });
    } catch (error) {
      console.error("🔴 SignalR Bağlantı Hatası:", error);
    }
  },

  disconnectConnection: () => {
    const { connection } = get();
    if (connection) {
      connection.stop();
      set({ connection: null, isConnected: false });
    }
  },

  sendMessage: async (receiverId, content) => {
    const { connection } = get();
    if (connection && connection.state === HubConnectionState.Connected) {
      try {
        console.log("📤 Mesaj gönderiliyor:", { receiverId, content });
        // Backend'deki "SendMessage" metodunu çağırır
        // receiverId ve content, CreateMessageDto ile eşleşir
        await connection.invoke("SendMessage", { receiverId, content });
        console.log("✅ Mesaj gönderildi");
      } catch (err) {
        console.error("❌ Mesaj gönderilemedi:", err);
      }
    } else {
      console.error("❌ SignalR bağlantısı yok");
    }
  },

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  // Yeni action'lar
  setSelectedUser: async (userId: string) => {
    try {
      // Önce mevcut mesajları temizle
      set({ messages: [], isLoadingMessages: true });
      
      // Unread count'u temizle
      get().clearUnreadCount(userId);
      
      // Kullanıcı bilgilerini yükle
      const user = await chatApi.getUserDetails(userId);
      set({ selectedUser: user, selectedUserId: userId });
      
      // Eski mesajları yükle
      await get().loadMessagesForUser(userId);
    } catch (error) {
      console.error("Kullanıcı yüklenemedi:", error);
      set({ messages: [] });
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  loadConversations: async () => {
    try {
      const conversations = await chatApi.getConversations();
      set({ conversations });
    } catch (error) {
      console.error("Konuşmalar yüklenemedi:", error);
    }
  },

  searchUsers: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }

    try {
      set({ isSearching: true });
      const results = await chatApi.searchUsers(query);
      set({ searchResults: results });
    } catch (error) {
      console.error("Arama hatası:", error);
      set({ searchResults: [] });
    } finally {
      set({ isSearching: false });
    }
  },

  loadMessagesForUser: async (userId: string) => {
    try {
      set({ isLoadingMessages: true });
      const { messages } = await chatApi.getMessagesWithUser(userId);
      console.log(`📦 ${userId} için ${messages.length} mesaj yüklendi`);
      
      // Backend artık ASCENDING (eski -> yeni) gönderiyor, reverse'e gerek yok
      console.log("📋 Mesaj sırası:", messages.map(m => ({
        id: m.id.substring(0, 8),
        content: m.content.substring(0, 20),
        timestamp: m.timestamp
      })));
      
      set({ messages });
    } catch (error) {
      console.error("Mesajlar yüklenemedi:", error);
      set({ messages: [] });
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  clearSearch: () => {
    set({ searchResults: [], isSearching: false });
  },

  startConversation: async (userId: string) => {
    try {
      const conversation = await chatApi.startConversation(userId);
      set((state) => ({
        conversations: [conversation, ...state.conversations],
      }));
      await get().setSelectedUser(userId);
    } catch (error) {
      console.error("Konuşma başlatılamadı:", error);
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  showNotification: (title: string, body: string) => {
    // Tarayıcı bildirim iznini kontrol et
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/logo.png" });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, { body, icon: "/logo.png" });
          }
        });
      }
    }
  },

  incrementUnreadCount: (userId: string) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    }));
  },

  clearUnreadCount: (userId: string) => {
    set((state) => {
      const newCounts = { ...state.unreadCounts };
      delete newCounts[userId];
      return { unreadCounts: newCounts };
    });
  },
}));
