"use client";
import * as React from "react";
import { Command, MessageSquare } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { data } from "@/features/chat/data/mock-data";
import { ModeToggle } from "./mode-toggle";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { UserSearch } from "@/features/chat/components/user-search";
import { UserListItem } from "@/features/chat/components/user-list-item";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();
  const user = useAuthStore((state) => state.user);
  const { conversations, selectedUserId, setSelectedUser, loadConversations } = useChatStore();

  // Sayfa yüklendiğinde konuşmaları getir
  React.useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: "Mesajlar",
                      hidden: false,
                    }}
                    onClick={() => {
                      setActiveItem({ title: "Mesajlar", url: "#", icon: MessageSquare, isActive: true });
                      setOpen(true);
                    }}
                    isActive={true}
                    className="px-2.5 md:px-2"
                  >
                    <MessageSquare />
                    <span>Mesajlar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <ModeToggle />

          <NavUser
            user={{
              name: user?.fullName || "User",
              email: user?.email || "user@example.com",
              avatar: user?.avatarUrl || "/avatars/default.jpg",
            }}
          />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              Mesajlar
            </div>
          </div>
          <UserSearch />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Henüz konuşma yok. Yukarıdan kullanıcı ara!
                </div>
              ) : (
                conversations.map((conversation) => (
                  <UserListItem
                    key={conversation.userId}
                    user={conversation.user}
                    isSelected={selectedUserId === conversation.userId}
                    onClick={() => setSelectedUser(conversation.userId)}
                  />
                ))
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
