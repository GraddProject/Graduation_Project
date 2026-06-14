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
    public class PatientConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasOne(P => P.User)
                .WithOne(U => U.Patient)
                .HasForeignKey<Patient>(P => P.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(P => P.Doctor)
                .WithMany(D => D.Patients)
                .HasForeignKey(P => P.DoctorID)
                .OnDelete(DeleteBehavior.Restrict);



            builder.OwnsOne(p => p.MedicalInfo, medicalBuilder =>
            {
                // GDM
                medicalBuilder.Property(m => m.HadGestationalDiabetesBefore)
                    .HasColumnName("HadGestationalDiabetesBefore");

                medicalBuilder.Property(m => m.HasFamilyHistoryOfDiabetes)
                    .HasColumnName("HasFamilyHistoryOfDiabetes");

                medicalBuilder.Property(m => m.HadUnexplainedPrenatalLoss)
                    .HasColumnName("HadUnexplainedPrenatalLoss");

                medicalBuilder.Property(m => m.HadLargeChildOrBirthDefault)
                    .HasColumnName("HadLargeChildOrBirthDefault");

                medicalBuilder.Property(m => m.HasPCOS)
                    .HasColumnName("HasPCOS");

                medicalBuilder.Property(m => m.HasSedentaryLifestyle)
                    .HasColumnName("HasSedentaryLifestyle");

                medicalBuilder.Property(m => m.HasPrediabetes)
                    .HasColumnName("HasPrediabetes");


                // Preeclampsia
                medicalBuilder.Property(m => m.Gravida)
                    .HasColumnName("Gravida");

                medicalBuilder.Property(m => m.Parity)
                    .HasColumnName("Parity");

                medicalBuilder.Property(m => m.HasChronicHypertension)
                    .HasColumnName("HasChronicHypertension");

                medicalBuilder.Property(m => m.HasPregestationalDiabetes)
                    .HasColumnName("HasPregestationalDiabetes");

                medicalBuilder.Property(m => m.HasChronicKidneyDisease)
                    .HasColumnName("HasChronicKidneyDisease");

                medicalBuilder.Property(m => m.HadPreviousPreeclampsia)
                    .HasColumnName("HadPreviousPreeclampsia");

                medicalBuilder.Property(m => m.HasFamilyHistoryOfPreeclampsia)
                    .HasColumnName("HasFamilyHistoryOfPreeclampsia");


                medicalBuilder.Property(m => m.PregnancyWeek)
                              .HasComputedColumnSql("(DATEDIFF(DAY, [PregnancyStartDate], GETDATE()) / 7) + 1", stored: false);

                medicalBuilder.Property(p => p.Age)
                   .HasComputedColumnSql("DATEDIFF(YEAR, [DateOfBirth], GETDATE()) " +
                   "- CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, [DateOfBirth], GETDATE()), [DateOfBirth]) > GETDATE() THEN 1 ELSE 0 END"
                   , stored: false);


                medicalBuilder.Property(m => m.BMI)
                    .HasComputedColumnSql(
                        "CASE WHEN [Height] IS NULL OR [Weight] IS NULL OR [Height] <= 0 " +
                        "THEN NULL " +
                        "ELSE ROUND((CAST([Weight] AS decimal(18,2)) * 10000.0) / ([Height] * [Height]), 2) END",
                        stored: false);

                medicalBuilder.Property(m => m.Age).HasColumnName("Age");
                medicalBuilder.Property(m => m.DateOfBirth).HasColumnName("DateOfBirth");
                medicalBuilder.Property(m => m.Height).HasColumnName("Height");
                medicalBuilder.Property(m => m.Weight).HasColumnName("Weight");
                medicalBuilder.Property(m => m.BMI).HasColumnName("BMI");
                medicalBuilder.Property(m => m.BloodType).HasColumnName("BloodType").HasMaxLength(5);
                medicalBuilder.Property(m => m.NumberOfPregnancies).HasColumnName("NumberOfPregnancies");
                medicalBuilder.Property(m => m.PregnancyStartDate).HasColumnName("PregnancyStartDate");
                medicalBuilder.Property(m => m.PregnancyWeek).HasColumnName("PregnancyWeek");
            });
        }
    }
}
