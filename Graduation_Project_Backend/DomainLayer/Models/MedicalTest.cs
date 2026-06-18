using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Models
{
    public class MedicalTest
    {
        public int Id { get; set; }

        public string FileName { get; set; } = default!;
        public string FilePath { get; set; } = default!;

        public DateTime UploadedAt { get; set; } = DateTime.Now;

        public int PatientId { get; set; }
        public Patient Patient { get; set; } = default!;
    }
}
