using DomainLayer.Contracts;
using DomainLayer.IdentityModule;
using DomainLayer.Models;
using Microsoft.AspNetCore.Identity;
using Persistence.Data;
using Persistence.Repositories;

namespace Persistence
{
    public class DataSeeding(UserManager<ApplicationUser> _userManager,
        RoleManager<IdentityRole> _roleManager
        , StoreIdentityDbContext _identityDbContext
        , IUnitOfWork _unitOfWork) : IDataSeeding
    {
        public async Task IdentityDataSeedingAsync()
        {
            try
            {
                var roles = new List<string> { "Admin", "Doctor", "Patient" };

                foreach (var role in roles)
                {
                    if (!await _roleManager.RoleExistsAsync(role))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(role));
                    }
                }


                var admins = new List<ApplicationUser>
                {
                    new ApplicationUser()
                    {
                        Email = "Loay@gmail.com",
                        DisplayName = "Loay",
                        PhoneNumber = "01123062981",
                        UserName = "Loay",
                        EmailConfirmed = true,
                        CreatedAt = DateTime.Now
                    },
                    new ApplicationUser()
                    {
                        Email = "Mariam@gmail.com",
                        DisplayName = "Mariam",
                        PhoneNumber = "01151660962",
                        UserName = "Mariam",
                        EmailConfirmed = true,
                        CreatedAt = DateTime.Now
                    },
                    new ApplicationUser()
                    {
                        Email = "Maha@gmail.com",
                        DisplayName = "Maha",
                        PhoneNumber = "01000769828",
                        UserName = "Maha",
                        EmailConfirmed = true,
                        CreatedAt = DateTime.Now
                    },
                    new ApplicationUser()
                    {
                        Email = "Shahd@gmail.com",
                        DisplayName = "Shahd",
                        PhoneNumber = "01010861461",
                        UserName = "Shahd",
                        EmailConfirmed = true,
                        CreatedAt = DateTime.Now
                    },

                    };
                foreach (var adminUser in admins)
                {
                    var existingAdmin = await _userManager.FindByEmailAsync(adminUser.Email!);
                    if (existingAdmin == null)
                    {
                        var result = await _userManager.CreateAsync(adminUser, "Hj01012345$");

                        if (result.Succeeded)
                        {
                            await _userManager.AddToRoleAsync(adminUser, "Admin");
                        }
                    }
                }


                await _identityDbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
            }
        }


        public async Task SeedDoctorsAndPatientsAsync()
        {
            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var existingDoctors = await doctorRepo.GetAllAsync();

            if (existingDoctors.Any())
                return;

            var random = new Random();
            var bloodTypes = new[] { "A+", "O+", "B+", "AB+", "O-" };

            for (int i = 1; i <= 20; i++)
            {
                var docUser = new ApplicationUser
                {
                    DisplayName = $"Dr. Test {i}",
                    Email = $"doctor{i}@herjourney.com",
                    UserName = $"doctor{i}",
                    PhoneNumber = $"010000000{i:    D2}",
                    EmailConfirmed = true,
                    CreatedAt = DateTime.Now
                };

                var docResult = await _userManager.CreateAsync(docUser, "Test@1234");

                if (docResult.Succeeded)
                {
                    await _userManager.AddToRoleAsync(docUser, "Doctor");

                    var doctor = new Doctor
                    {
                        UserId = docUser.Id,
                        YearsOfExperience = random.Next(5, 20)
                    };

                    await doctorRepo.AddAsync(doctor);
                    await _unitOfWork.SaveChangesAsync();
                    var patientRepo = _unitOfWork.GetRepository<Patient>();
                    for (int p = 1; p <= 2; p++)
                    {
                        var patUser = new ApplicationUser
                        {
                            DisplayName = $"Patient {p} (Doc {i})",
                            Email = $"patient{i}_{p}@herjourney.com",
                            UserName = $"patient{i}_{p}",
                            PhoneNumber = $"01100000{i:D2}{p}",
                            EmailConfirmed = true,
                            CreatedAt = DateTime.Now
                        };

                        var patResult = await _userManager.CreateAsync(patUser, "Test@1234");

                        if (patResult.Succeeded)
                        {
                            await _userManager.AddToRoleAsync(patUser, "Patient");

                            int age = random.Next(20, 40);

                            var patient = new Patient
                            {
                                UserId = patUser.Id,
                                DoctorID = doctor.Id,
                                MedicalInfo = new MedicalData
                                {
                                    DateOfBirth = DateOnly.FromDateTime(DateTime.Now.AddYears(-age)),
                                    Age = age,
                                    BloodType = bloodTypes[random.Next(bloodTypes.Length)],
                                    Height = random.Next(155, 175),
                                    Weight = random.Next(60, 90),
                                    PregnancyWeek = random.Next(4, 36),
                                    NumberOfPregnancies = random.Next(1, 4),
                                    PregnancyStartDate = DateOnly.FromDateTime(DateTime.Now.AddDays(-(random.Next(4, 36) * 7)))
                                }
                            };

                            await patientRepo.AddAsync(patient);
                        }
                    }
                    await _unitOfWork.SaveChangesAsync();
                }
            }
        }
    }
}