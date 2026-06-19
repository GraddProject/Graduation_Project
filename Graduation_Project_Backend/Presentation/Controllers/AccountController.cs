using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ServicesAbstraction.AuthServices;
using Shared.DTos.IdentityModuleDTo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(IAccountService _accountService) : ControllerBase
    {
        [Authorize]
        [HttpGet("CurrentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var Email = User.FindFirstValue(ClaimTypes.Email);
            var AppUser = await _accountService.GetCurrentUserAsync(Email!);
            return Ok(AppUser);
        }


        [HttpPost("ConfirmEmail")]
        public async Task<ActionResult> ConfirmEmail(ConfirmEmailDto dto)
        {
            await _accountService.ConfirmEmailAsync(dto);
            return Ok(new { message = "Account confirmed and password set successfully! You can login now." });
        }


        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto dto)
        {
            var result = await _accountService.LoginAsync(dto);
            return Ok(result);
        }
    }
}
