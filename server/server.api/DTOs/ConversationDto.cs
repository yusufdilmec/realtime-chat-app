using System;

namespace server.api.DTOs
{
    public class ConversationDto
    {
        public required string UserId { get; set; }
        public required UserDto User { get; set; }
        public LastMessageDto? LastMessage { get; set; }
        public DateTime LastMessageAt { get; set; }
        public int UnreadCount { get; set; }
    }

    public class LastMessageDto
    {
        public required string Content { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }
    }
}
