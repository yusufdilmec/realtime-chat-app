using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.api.DTOs
{
    public class UserDto
    {
        public required string Id { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
