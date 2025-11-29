using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace server.api.services
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            // JWT token'dan NameId claim'ini al (User.Id)
            return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}
