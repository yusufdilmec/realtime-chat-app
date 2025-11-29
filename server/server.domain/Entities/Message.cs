using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.server.domain.Entities
{
    public class Message
    {
        public Guid Id { get; set; }
        public required string Content { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
        public required string SenderId { get; set; }
        public virtual User Sender { get; set; } = null!;
        public required string ReceiverId { get; set; }
        public virtual User Receiver { get; set; } = null!;
    }
}