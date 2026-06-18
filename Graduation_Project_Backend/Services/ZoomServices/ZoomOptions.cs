using System.ComponentModel.DataAnnotations;

namespace Services.ZoomServices
{
    public class ZoomOptions
    {
        [Required]
        public string AccountId { get; set; } = default!;

        [Required]
        public string ClientId { get; set; } = default!;

        [Required]
        public string ClientSecret { get; set; } = default!;

        // Usually "me" for the account owner. You can replace it with a concrete Zoom user id/email.
        [Required]
        public string HostUserId { get; set; } = "me";

        public string Timezone { get; set; } = "Africa/Cairo";
    }
}
