
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace server.server.domain.Entities
{
    public class User : IdentityUser
    {
        public required string FullName { get; set; }
        public string? AvatarUrl { get; set; }

        public virtual ICollection<Message> MessageSent { get; set; } = new List<Message>();
        public virtual ICollection<Message> MessageReceived { get; set; } = new List<Message>();
    }
}