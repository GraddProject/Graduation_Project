using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.IdentityModuleDTo
{
    public class UserDto
    {
        public string Email { get; set; } = default!;
        public string? Token { get; set; }
        public string DisplayName { get; set; } = default!;
        public List<string> Role { get; set; } = default!;
    }
}
