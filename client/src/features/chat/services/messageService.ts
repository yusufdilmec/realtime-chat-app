import { chatHubService } from "@/lib/signalR";
import type { Message } from "@/types";

export interface CreateMessageDto {
  receiverId: string;
  content: string;
}

export const messageService = {
  // SignalR üzerinden mesaj gönder
  sendMessage: async (data: CreateMessageDto): Promise<void> => {
    await chatHubService.sendMessage("SendMessage", data);
  },

  // Mesaj alındığında çağrılacak callback'i kaydet
  onReceiveMessage: (callback: (message: Message) => void): void => {
    chatHubService.on("ReceiveMessage", callback);
  },

  // Mesaj dinlemeyi durdur
  offReceiveMessage: (): void => {
    chatHubService.off("ReceiveMessage");
  },

  // SignalR bağlantısını başlat
  startConnection: async (token: string): Promise<void> => {
    await chatHubService.startConnection(token);
  },

  // SignalR bağlantısını durdur
  stopConnection: async (): Promise<void> => {
    await chatHubService.stopConnection();
  },
};
