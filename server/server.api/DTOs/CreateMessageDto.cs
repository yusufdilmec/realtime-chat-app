using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.api.DTOs
{
    public class CreateMessageDto
    {
        public required string ReceiverId { get; set; }
        public required string Content { get; set; }
    }
}