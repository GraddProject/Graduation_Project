using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence.Data.Configuration
{
    public class MedicalTestConfiguration : IEntityTypeConfiguration<MedicalTest>
    {
        public void Configure(EntityTypeBuilder<MedicalTest> builder)
        {
            builder.HasOne(M => M.Patient)
                .WithMany(P => P.MedicalTests)
                .HasForeignKey(M => M.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(m => m.FileName)
               .HasMaxLength(255)
               .IsRequired();

            builder.Property(m => m.FilePath)
                   .HasMaxLength(1000)
                   .IsRequired();

            builder.Property(m => m.UploadedAt)
                   .HasDefaultValueSql("GETDATE()");
        }
    }
}
