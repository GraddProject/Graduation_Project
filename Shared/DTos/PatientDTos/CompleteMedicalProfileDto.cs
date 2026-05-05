using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTos.PatientDTos
{
    public class CompleteMedicalProfileDto
    {
        public IFormFile? ProfileImage { get; set; }
        public DateOnly? DateOfBirth { get; set; }

        public DateOnly? PregnancyStartDate { get; set; }

        public string? BloodType { get; set; } = default!;

        public int? Height { get; set; }

        public int? Weight { get; set; }

        public int? NumberOfPregnancies { get; set; }
    }
}
