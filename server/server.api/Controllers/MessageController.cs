using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.api.DTOs;
using server.server.domain.Entities;
using server.server.infrastructure.Data;

namespace server.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public MessageController(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        /// <summary>
        /// Get message history with a specific user
        /// </summary>
        /// <param name="userId">The other user's ID</param>
        /// <param name="page">Page number (default: 1)</param>
        /// <param name="pageSize">Items per page (default: 50)</param>
        /// <returns>List of messages</returns>
        [HttpGet("with/{userId}")]
        public async Task<IActionResult> GetMessagesWithUser(
            string userId, 
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 50)
        {
            var currentUserId = _userManager.GetUserId(User);

            if (currentUserId == null)
            {
                return Unauthorized();
            }

            var messages = await _context.Messages
                .Where(m => 
                    (m.SenderId == currentUserId && m.ReceiverId == userId) ||
                    (m.SenderId == userId && m.ReceiverId == currentUserId))
                .OrderBy(m => m.Timestamp)  // Eskiden yeniye (ASC)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MessageDto
                {
                    Id = m.Id,
                    SenderId = m.SenderId,
                    ReceiverId = m.ReceiverId,
                    Content = m.Content,
                    Timestamp = m.Timestamp,
                    IsRead = m.IsRead
                })
                .ToListAsync();

            var hasMore = await _context.Messages
                .Where(m => 
                    (m.SenderId == currentUserId && m.ReceiverId == userId) ||
                    (m.SenderId == userId && m.ReceiverId == currentUserId))
                .CountAsync() > page * pageSize;

            return Ok(new { messages, hasMore });
        }

        /// <summary>
        /// Mark a message as read
        /// </summary>
        /// <param name="messageId">Message ID</param>
        /// <returns>Success status</returns>
        [HttpPut("{messageId}/read")]
        public async Task<IActionResult> MarkAsRead(Guid messageId)
        {
            var currentUserId = _userManager.GetUserId(User);

            if (currentUserId == null)
            {
                return Unauthorized();
            }

            var message = await _context.Messages.FindAsync(messageId);

            if (message == null)
            {
                return NotFound("Message not found.");
            }

            // Only the receiver can mark as read
            if (message.ReceiverId != currentUserId)
            {
                return Forbid();
            }

            message.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        /// <summary>
        /// Get unread message count
        /// </summary>
        /// <returns>Unread count per user</returns>
        [HttpGet("unread-counts")]
        public async Task<IActionResult> GetUnreadCounts()
        {
            var currentUserId = _userManager.GetUserId(User);

            if (currentUserId == null)
            {
                return Unauthorized();
            }

            var unreadCounts = await _context.Messages
                .Where(m => m.ReceiverId == currentUserId && !m.IsRead)
                .GroupBy(m => m.SenderId)
                .Select(g => new
                {
                    UserId = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            return Ok(unreadCounts);
        }

        /// <summary>
        /// Get conversation list with last messages
        /// </summary>
        /// <returns>List of conversations</returns>
        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            var currentUserId = _userManager.GetUserId(User);

            if (currentUserId == null)
            {
                return Unauthorized();
            }

            // Get all users that the current user has messages with
            var conversationUserIds = await _context.Messages
                .Where(m => m.SenderId == currentUserId || m.ReceiverId == currentUserId)
                .Select(m => m.SenderId == currentUserId ? m.ReceiverId : m.SenderId)
                .Distinct()
                .ToListAsync();

            if (!conversationUserIds.Any())
            {
                return Ok(new List<ConversationDto>());
            }

            var conversations = new List<ConversationDto>();

            foreach (var userId in conversationUserIds)
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null) continue;

                var lastMessage = await _context.Messages
                    .Where(m => 
                        (m.SenderId == currentUserId && m.ReceiverId == userId) ||
                        (m.SenderId == userId && m.ReceiverId == currentUserId))
                    .OrderByDescending(m => m.Timestamp)
                    .FirstOrDefaultAsync();

                var unreadCount = await _context.Messages
                    .Where(m => m.SenderId == userId && m.ReceiverId == currentUserId && !m.IsRead)
                    .CountAsync();

                conversations.Add(new ConversationDto
                {
                    UserId = user.Id,
                    User = new UserDto
                    {
                        Id = user.Id,
                        FullName = user.FullName,
                        Email = user.Email!,
                        AvatarUrl = user.AvatarUrl
                    },
                    LastMessage = lastMessage != null ? new LastMessageDto
                    {
                        Content = lastMessage.Content,
                        Timestamp = lastMessage.Timestamp,
                        IsRead = lastMessage.IsRead
                    } : null,
                    LastMessageAt = lastMessage?.Timestamp ?? DateTime.MinValue,
                    UnreadCount = unreadCount
                });
            }

            // Sort by last message timestamp
            var sortedConversations = conversations
                .OrderByDescending(c => c.LastMessageAt)
                .ToList();

            return Ok(sortedConversations);
        }
    }
}
