using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.api.DTOs;
using server.api.services;
using server.server.domain.Entities;

namespace server.api.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private SignInManager<User> _signInManager;
        private UserManager<User> _userManager;
        public AuthController(ITokenService tokenService, SignInManager<User> signInManager, UserManager<User> userManager)
        {
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }


        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _userManager.FindByEmailAsync(registerDto.Email) != null)
            {
                return BadRequest("Email is already in use.");
            }

            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var token = _tokenService.CreateToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email!
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded)
            {
                return Unauthorized("Invalid email or password.");
            }

            var token = _tokenService.CreateToken(user);

            var response = new AuthResponseDto
            {
                Token = token,
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email!
            };

            return Ok(response);
        }
    }
}