using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using server.api.DTOs;
using server.server.domain.Entities;
using server.server.infrastructure.Data;

namespace server.api.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;
        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var senderId = Context.UserIdentifier;

            if (string.IsNullOrEmpty(senderId))
            {
                throw new HubException("Unauthorized");
            }
            
            var message = new Message
            {
                Id = Guid.NewGuid(),
                SenderId = senderId,
                ReceiverId = createMessageDto.ReceiverId,
                Content = createMessageDto.Content,
                Timestamp = DateTime.UtcNow,
                IsRead = false
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            var messageDto = new MessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                Content = message.Content,
                Timestamp = message.Timestamp,
                IsRead = message.IsRead
            };

            // Alıcıya mesajı gönder
            await Clients.User(message.ReceiverId).SendAsync("ReceiveMessage", messageDto);
            
            // Gönderene de onay gönder
            await Clients.Caller.SendAsync("MessageSent", messageDto);
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
                Console.WriteLine($"User {userId} connected with connection {Context.ConnectionId}");
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
                Console.WriteLine($"User {userId} disconnected");
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}