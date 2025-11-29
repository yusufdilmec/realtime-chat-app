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

namespace server.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UserController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        /// <summary>
        /// Search users by name or email
        /// </summary>
        /// <param name="query">Search query (name or email)</param>
        /// <returns>List of matching users</returns>
        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query cannot be empty.");
            }

            var currentUserId = _userManager.GetUserId(User);

            var users = await _userManager.Users
                .Where(u => u.Id != currentUserId && 
                           (u.FullName.Contains(query) || u.Email!.Contains(query)))
                .Take(20)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email!,
                    AvatarUrl = u.AvatarUrl
                })
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// Get all users except current user
        /// </summary>
        /// <returns>List of all users</returns>
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var currentUserId = _userManager.GetUserId(User);

            var users = await _userManager.Users
                .Where(u => u.Id != currentUserId)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email!,
                    AvatarUrl = u.AvatarUrl
                })
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// Get user by ID
        /// </summary>
        /// <param name="id">User ID</param>
        /// <returns>User details</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                AvatarUrl = user.AvatarUrl
            };

            return Ok(userDto);
        }

        /// <summary>
        /// Get current user profile
        /// </summary>
        /// <returns>Current user details</returns>
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = _userManager.GetUserId(User);
            
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                AvatarUrl = user.AvatarUrl
            };

            return Ok(userDto);
        }
    }
}
