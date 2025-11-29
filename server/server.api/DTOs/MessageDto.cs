using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.api.DTOs
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public required string SenderId { get; set; }
        public required string ReceiverId { get; set; }
        public required string Content { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }
    }
}