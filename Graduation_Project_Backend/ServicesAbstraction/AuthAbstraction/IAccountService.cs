using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Shared.DTos.IdentityModuleDTo;

namespace ServicesAbstraction.AuthServices
{
    public interface IAccountService
    {
        Task ConfirmEmailAsync(ConfirmEmailDto dto);

        Task<UserDto> GetCurrentUserAsync(string Email);

        Task<UserDto> LoginAsync(LoginDto loginDto);
    }
}
