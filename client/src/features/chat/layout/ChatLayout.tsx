import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeConnection, disconnectConnection } = useChatStore();
  
  useEffect(() => {
    // Bildirim izni iste
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Sayfa açılınca bağlan
    initializeConnection();

    // Sayfadan ayrılınca (unmount) bağlantıyı kopar
    return () => {
      disconnectConnection();
    };
  }, [initializeConnection, disconnectConnection]);

  return (
    // defaultOpen={true} sidebar'ın varsayılan olarak açık gelmesini sağlar
    <SidebarProvider defaultOpen={true} className="h-screen overflow-hidden">
      {/* Sol Menü */}
      <AppSidebar />

      {/* Sağ Ana İçerik (Inset) */}
      <SidebarInset className="flex flex-col h-full overflow-hidden">
        {/* Header (Opsiyonel: Chat başlığı, Sidebar toggle butonu) */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Live Chat</span>
            {/* Bağlantı durumunu gösteren küçük bir indikatör */}
            <ConnectionStatus />
          </div>
        </header>

        {/* Ana Mesaj Alanı */}
        <div className="flex-1 overflow-y-auto p-4 bg-muted/20">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function ConnectionStatus() {
  const isConnected = useChatStore((s) => s.isConnected);
  return (
    <span
      className={`w-2 h-2 rounded-full ${
        isConnected ? "bg-green-500" : "bg-red-500 animate-pulse"
      }`}
    ></span>
  );
}
