using DomainLayer.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Persistence.Data.Configuration
{
    public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
    {
        public void Configure(EntityTypeBuilder<Doctor> builder)
        {
            builder.HasOne(D => D.User)
                .WithOne(U => U.Doctor)
                .HasForeignKey<Doctor>(D => D.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            var specializationsComparer = new ValueComparer<List<string>?>(
                    (c1, c2) =>
                        c1 == null && c2 == null ||
                        c1 != null && c2 != null && c1.SequenceEqual(c2),

                    c => c == null
                        ? 0
                        : c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),

                    c => c == null
                        ? null
                        : c.ToList()
                );

            builder.Property(d => d.Specializations)
                .HasConversion(
                    v => v == null
                        ? null
                        : JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),

                    v => string.IsNullOrWhiteSpace(v)
                        ? null
                        : JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null))
                .HasColumnType("nvarchar(max)")
                .Metadata.SetValueComparer(specializationsComparer);
        }
    }
}
