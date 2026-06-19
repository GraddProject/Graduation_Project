using AutoMapper;
using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.IdentityModule;
using DomainLayer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ServicesAbstraction.AuthServices;
using Shared.DTos.IdentityModuleDTo;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Numerics;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.AuthServices
{
    public class AccountService(IUnitOfWork _unitOfWork, IMapper _mapper,
                    UserManager<ApplicationUser> _userManager, IConfiguration _configuration) : IAccountService
    {
        public async Task<UserDto> LoginAsync(LoginDto loginDto)
        {
            var User = await _userManager.FindByEmailAsync(loginDto.Email);
            if (User == null)
            {
                throw new UnauthorizedException();
            }
            if (!await _userManager.IsEmailConfirmedAsync(User))
                throw new NotActivatedException();

            var IsPassValid = await _userManager.CheckPasswordAsync(User, loginDto.Password);
            if (IsPassValid)
            {
                return new UserDto
                {
                    DisplayName = User.DisplayName,
                    Email = User.Email!,
                    Role = (List<string>)await _userManager.GetRolesAsync(User),
                    Token = await CreateTokenAsync(User)
                };
            }
            else
            {
                throw new UnauthorizedException();
            }

        }



        public async Task<UserDto> GetCurrentUserAsync(string Email)
        {
            var User = await _userManager.FindByEmailAsync(Email) ?? throw new UserNotFoundException(Email);
            return new UserDto
            {
                DisplayName = User.DisplayName,
                Email = User.Email!,
                Token = await CreateTokenAsync(User),
                Role = (List<string>)await _userManager.GetRolesAsync(User)
            };
        }




        public async Task ConfirmEmailAsync(ConfirmEmailDto dto)
        {
            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null)
                throw new UserIdNotFoundException(dto.UserId);

            var decodedTokenBytes = WebEncoders.Base64UrlDecode(dto.Token);
            var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                throw new BadRequestException(errors);
            }

            var passwordResult = await _userManager.AddPasswordAsync(user, dto.NewPassword);
            if (!passwordResult.Succeeded)
            {
                var errors = passwordResult.Errors.Select(e => e.Description).ToList();
                throw new BadRequestException(errors);
            }


        }





        private async Task<string> CreateTokenAsync(ApplicationUser user)
        {
            var Cliams = new List<Claim>()
            {
                new(ClaimTypes.Email, user.Email!),
                new(ClaimTypes.Name,user.UserName!),
                new(ClaimTypes.NameIdentifier,user.Id)
            };
            var Roles = await _userManager.GetRolesAsync(user);
            foreach (var role in Roles)
                Cliams.Add(new Claim(ClaimTypes.Role, role));
            var SecretKey = _configuration.GetSection("JwtOptions")["SecretKey"];
            var Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
            var Creds = new SigningCredentials(Key, SecurityAlgorithms.HmacSha256);
            var Token = new JwtSecurityToken(
                issuer: _configuration["JwtOptions:Issuer"],
                audience: _configuration["JwtOptions:Audience"],
                claims: Cliams,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: Creds
                );
            return new JwtSecurityTokenHandler().WriteToken(Token);
        }

    }
}
