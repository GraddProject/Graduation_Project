using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.DashBoardDTos
{
    public class UserDashBoardDto
    {
        public int Id { get; set; }
        public string? ProfileImageUrl { get; set; }

        public string DisplayName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Role { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public bool Actived { get; set; }

    }
}
