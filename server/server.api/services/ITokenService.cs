using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.server.domain.Entities;

namespace server.api.services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}