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
    public class MedicalHistoryConfiguration : IEntityTypeConfiguration<MedicalHistory>
    {
        public void Configure(EntityTypeBuilder<MedicalHistory> builder)
        {
            builder.HasOne(M => M.Patient)
                .WithMany(P => P.MedicalHistory)
                .HasForeignKey(M => M.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(M => M.CreatedByDoctor)
                .WithMany(D => D.CreatedMedicalHistories)
                .HasForeignKey(M => M.CreatedByDoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(m => m.Diagnosis)
               .HasMaxLength(500);

            builder.Property(m => m.VitalSigns)
                .HasMaxLength(250);

            builder.Property(m => m.Notes)
                   .HasMaxLength(1000);

            builder.Property(m => m.CreatedAt)
                   .HasDefaultValueSql("GETDATE()");



            builder.HasOne(m => m.PredictionRecord)
                  .WithOne(p => p.MedicalHistory)
                  .HasForeignKey<MedicalHistory>(m => m.PredictionRecordId)
                  .OnDelete(DeleteBehavior.NoAction);

            builder.HasIndex(m => m.PredictionRecordId)
                  .IsUnique()
                  .HasFilter("[PredictionRecordId] IS NOT NULL");
        }
    }
}
