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
    public class AvailabilitySlotConfiguration : IEntityTypeConfiguration<AvailabilitySlot>
    {
        public void Configure(EntityTypeBuilder<AvailabilitySlot> builder)
        {
            builder.HasOne(A=>A.Doctor)
                .WithMany(D=>D.AvailabilitySlots)
                .HasForeignKey(A=>A.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(a => a.Type)
                   .HasConversion<string>();
        }
    }
}
