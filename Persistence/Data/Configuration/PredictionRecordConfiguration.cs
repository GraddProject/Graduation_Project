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
    public class PredictionRecordConfiguration : IEntityTypeConfiguration<PredictionRecord>
    {
        public void Configure(EntityTypeBuilder<PredictionRecord> builder)
        {
            builder.HasKey(p => p.Id);

            builder.HasOne(p => p.Patient)
                  .WithMany(p => p.PredictionRecords)
                  .HasForeignKey(p => p.PatientId)
                  .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(p => p.Doctor)
                  .WithMany(d => d.PredictionRecords)
                  .HasForeignKey(p => p.DoctorId)
                  .OnDelete(DeleteBehavior.NoAction);

            builder.Property(p => p.Type)
                  .HasConversion<string>()
                  .HasMaxLength(50)
                  .IsRequired();

            builder.Property(p => p.Result)
                  .HasMaxLength(100)
                  .IsRequired();

            builder.Property(p => p.Confidence)
                  .HasColumnType("decimal(5,2)")
                  .IsRequired();

            builder.Property(p => p.InputJson)
                  .HasColumnType("nvarchar(max)")
                  .IsRequired();

            builder.Property(p => p.RawResponseJson)
                  .HasColumnType("nvarchar(max)")
                  .IsRequired();

            builder.Property(p => p.CreatedAt)
                  .HasDefaultValueSql("GETDATE()");
        }
    }
}
