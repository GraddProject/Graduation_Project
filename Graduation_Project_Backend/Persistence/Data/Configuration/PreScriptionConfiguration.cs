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
    public class PreScriptionConfiguration : IEntityTypeConfiguration<PreScription>
    {
        public void Configure(EntityTypeBuilder<PreScription> builder)
        {
            builder.HasOne(P=>P.MedicalHistory)
                .WithMany(M=>M.PreScriptions)
                .HasForeignKey(P=>P.MedicalHistoryId)
                .OnDelete(DeleteBehavior.Cascade);


            builder.Property(p => p.MedicationName)
                .HasMaxLength(200)
                .IsRequired();

            builder.Property(p => p.Dosage)
                   .HasMaxLength(100);

            builder.Property(p => p.Duration)
                   .HasMaxLength(100);

            builder.Property(p => p.Instructions)
                   .HasMaxLength(500);

            builder.Property(p => p.CreatedAt)
                   .HasDefaultValueSql("GETDATE()");
        }
    }
}
