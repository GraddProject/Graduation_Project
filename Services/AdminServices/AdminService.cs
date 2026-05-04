using AutoMapper;
using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.IdentityModule;
using DomainLayer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Services.Specifications;
using Services.Specifications.PatientSpecifications;
using Services.Specifications.PatientSpecifications;
using ServicesAbstraction.IAdminAbstraction;
using Shared.DTos.DashBoardDTos;
using Shared.DTos.DoctorDTos;
using Shared.DTos.IdentityModuleDTo;
using Shared.DTos.PaginationDTo;
using Shared.DTos.PatientDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Numerics;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Services.AdminServices
{
    public class AdminService(IUnitOfWork _unitOfWork, IMapper _mapper,
                              UserManager<ApplicationUser> _userManager) : IAdminService
    {
        public async Task<UserDto> RegisterDoctorAsync(RegisterDoctorDto registerDoctorDto)
        {
            var User = new ApplicationUser
            {
                DisplayName = registerDoctorDto.DisplayName,
                Email = registerDoctorDto.Email,
                UserName = registerDoctorDto.Email.Split('@')[0],
                PhoneNumber = registerDoctorDto.PhoneNumber,
                EmailConfirmed = false
            };
            var result = await _userManager.CreateAsync(User);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                throw new BadRequestException(errors);
            }


            try
            {
                await _userManager.AddToRoleAsync(User, "Doctor");
                var Doctor = _mapper.Map<Doctor>(registerDoctorDto);
                Doctor.UserId = User.Id;
                await _unitOfWork.GetRepository<Doctor>().AddAsync(Doctor);
                await _unitOfWork.SaveChangesAsync();
                await SendConfirmationEmailLogic(User);

                return new UserDto
                {
                    DisplayName = User.DisplayName,
                    Email = User.Email,
                    Role = new List<string> { "Doctor" }
                };
            }
            catch (Exception ex)
            {
                await _userManager.DeleteAsync(User);
                throw new BadRequestException(new List<string> { "An unexpected error occurred while completing the registration, please try again later." });
            }
        }

        public async Task<UserDto> RegisterPatientAsync(RegisterPatientDto dto)
        {
            var user = new ApplicationUser
            {
                DisplayName = dto.DisplayName,
                Email = dto.Email,
                UserName = dto.Email.Split('@')[0],
                PhoneNumber = dto.PhoneNumber,
                EmailConfirmed = false
            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                throw new BadRequestException(errors);
            }
            try
            {
                await _userManager.AddToRoleAsync(user, "Patient");
                var patient = _mapper.Map<Patient>(dto);
                patient.UserId = user.Id;
                await _unitOfWork.GetRepository<Patient>().AddAsync(patient);
                await _unitOfWork.SaveChangesAsync();
                await SendConfirmationEmailLogic(user);

                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Email = user.Email,
                    Role = new List<string> { "Patient" }
                };
            }
            catch (Exception ex)
            {
                await _userManager.DeleteAsync(user);
                throw new BadRequestException(new List<string> { "An unexpected error occurred while completing the registration, please try again later." });
            }
        }

        //Return List Of Confirmed Doctors Only 
        public async Task<IEnumerable<DoctorSummaryDto>> GetDoctorListAsync()
        {
            // Confirmed EMails
            var spec = new DoctorsConfirmedSpecification();
            var Doctors = await _unitOfWork.GetRepository<Doctor>().GetAllAsync(spec);
            //var doctorsList = Doctors.Select(d => new DoctorSummaryDto
            //{
            //    Id = d.Id,
            //    DisplayName = d.User.DisplayName
            //});
            //return doctorsList;
            // 
            return _mapper.Map<IEnumerable<DoctorSummaryDto>>(Doctors);
        }

        public async Task<DoctorDto> GetDoctorByIdAsync(int Id)
        {
            var spec = new DoctorDetailsSpecification(Id);
            var Doctor = await _unitOfWork.GetRepository<Doctor>().GetByIdAsync(spec) ?? throw new DoctorNotFoundException(Id);

            // NEW (Add Email,Role,Actived,regdate)
            var result = _mapper.Map<DoctorDto>(Doctor);
            return result;
        }

        public async Task<bool> UpdateDoctorAsync(int Id, UpdateDoctorDto updateDoctorDto)
        {
            var Drepo = _unitOfWork.GetRepository<Doctor>();
            var Doctor = await Drepo.GetByIdAsync(Id) ?? throw new DoctorNotFoundException(Id);

            if (updateDoctorDto.YearsOfExperience.HasValue)
            {
                Doctor.YearsOfExperience = updateDoctorDto.YearsOfExperience.Value;
                Drepo.Update(Doctor);
            }
            var User = await _userManager.FindByIdAsync(Doctor.UserId);
            if (User != null)
            {
                User.DisplayName = updateDoctorDto.DisplayName ?? User.DisplayName;
                User.PhoneNumber = updateDoctorDto.PhoneNumber ?? User.PhoneNumber;
                var UpdateResult = await _userManager.UpdateAsync(User!);
                if (!UpdateResult.Succeeded)
                {
                    var errors = UpdateResult.Errors.Select(e => e.Description).ToList();
                    throw new BadRequestException(errors);
                }
            }
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDoctorAsync(int Id)
        {
            var spec = new DoctorDetailsSpecification(Id);
            var Drepo = _unitOfWork.GetRepository<Doctor>();
            var Doctor = await Drepo.GetByIdAsync(spec) ?? throw new DoctorNotFoundException(Id);
            if (Doctor.Patients != null && Doctor.Patients.Any())
                throw new BadRequestException(new List<string> { $"Cannot delete this doctor because they have {Doctor.Patients.Count} registered patient(s). Please reassign or delete the patients first." });

            if (Doctor.Appointments != null && Doctor.Appointments.Any())
            {
                var appRepo = _unitOfWork.GetRepository<Appointment>();
                foreach (var app in Doctor.Appointments.ToList())
                    appRepo.Remove(app);
            }
            string UserId = Doctor.UserId;


            Drepo.Remove(Doctor);
            await _unitOfWork.SaveChangesAsync();

            var User = await _userManager.FindByIdAsync(UserId);
            if (User != null)
            {
                var deleteresult = await _userManager.DeleteAsync(User);
                if (!deleteresult.Succeeded)
                {
                    var errors = deleteresult.Errors.Select(e => e.Description).ToList();
                    throw new BadRequestException(errors);
                }
            }
            return true;
        }


        public async Task<PatientDto> GetPatientById(int Id)
        {
            var spec = new PatientDetailsSpecification(Id);
            var patient = await _unitOfWork.GetRepository<Patient>().GetByIdAsync(spec)
                  ?? throw new PatientNotFoundException(Id);

            return _mapper.Map<PatientDto>(patient);

            // NEW (Add Email,Role,Actived,regdate)


        }


        public async Task<bool> UpdatePatientAsync(int Id, UpdatePatientDto dto)
        {
            var Prepo = _unitOfWork.GetRepository<Patient>();
            var patient = await Prepo.GetByIdAsync(Id) ?? throw new PatientNotFoundException(Id);

            if (dto.Weight.HasValue) patient.MedicalInfo.Weight = dto.Weight.Value;
            if (dto.Height.HasValue) patient.MedicalInfo.Height = dto.Height.Value;
            if (dto.PregnancyStartDate.HasValue) patient.MedicalInfo.PregnancyStartDate = dto.PregnancyStartDate.Value;
            if (dto.NumberOfPregnancies.HasValue) patient.MedicalInfo.NumberOfPregnancies = dto.NumberOfPregnancies.Value;


            if (!string.IsNullOrWhiteSpace(dto.BloodType)) patient.MedicalInfo.BloodType = dto.BloodType;

            if (dto.DateOfBirth.HasValue)
            {
                patient.MedicalInfo.DateOfBirth = dto.DateOfBirth.Value;
            }

            if (dto.DoctorID.HasValue)
            {
                var doctorRepo = _unitOfWork.GetRepository<Doctor>();
                var doctor = await doctorRepo.GetByIdAsync(dto.DoctorID.Value) ?? throw new DoctorNotFoundException(dto.DoctorID.Value);

                var doctorUser = await _userManager.FindByIdAsync(doctor.UserId);
                if (doctorUser == null || !doctorUser.EmailConfirmed)
                {
                    throw new BadRequestException(new List<string> { "Cannot assign patient to this doctor because the doctor's account is not active." });
                }
                patient.DoctorID = dto.DoctorID.Value;
            }



            Prepo.Update(patient);

            var user = await _userManager.FindByIdAsync(patient.UserId);
            if (user != null)
            {
                user.DisplayName = dto.DisplayName ?? user.DisplayName;
                user.PhoneNumber = dto.PhoneNumber ?? user.PhoneNumber;

                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    var errors = updateResult.Errors.Select(e => e.Description).ToList();
                    throw new BadRequestException(errors);
                }
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePatientAsync(int Id)
        {
            var spec = new PatientDetailsSpecification(Id);
            var Prepo = _unitOfWork.GetRepository<Patient>();
            var patient = await Prepo.GetByIdAsync(spec) ?? throw new PatientNotFoundException(Id);


            if (patient.Appointments != null && patient.Appointments.Any())
            {
                var appRepo = _unitOfWork.GetRepository<Appointment>();
                foreach (var appointment in patient.Appointments.ToList())
                {
                    appRepo.Remove(appointment);
                }
            }


            var UserId = patient.UserId;
            Prepo.Remove(patient);

            await _unitOfWork.SaveChangesAsync();

            var User = await _userManager.FindByIdAsync(UserId);
            if (User != null)
            {
                var deleteresult = await _userManager.DeleteAsync(User);
                if (!deleteresult.Succeeded)
                {
                    var errors = deleteresult.Errors.Select(e => e.Description).ToList();
                    throw new BadRequestException(errors);
                }
            }
            return true;
        }


        //public async Task<IEnumerable<UserDashBoardDto>> GetDashboardUsersAsync()
        //{
        //    var Dspec = new DoctorDetailsSpecification();
        //    var Drepo = _unitOfWork.GetRepository<Doctor>();
        //    var Doctors = await Drepo.GetAllAsync(Dspec);
        //    var DoctorsDto = _mapper.Map<IEnumerable<UserDashBoardDto>>(Doctors);
        //    foreach (var Doctor in DoctorsDto)
        //        Doctor.Role = "Doctor";

        //    var Pspec = new PatientDetailsSpecification();
        //    var Prepo = _unitOfWork.GetRepository<Patient>();
        //    var Patients = await Prepo.GetAllAsync(Pspec);
        //    var PatientsDto = _mapper.Map<IEnumerable<UserDashBoardDto>>(Patients);
        //    foreach (var Patient in PatientsDto)
        //        Patient.Role = "Patient";

        //    return DoctorsDto.Concat(PatientsDto)
        //             .OrderByDescending(u => u.CreatedAt)
        //             .ToList();
        //}


        private async Task SendConfirmationEmailLogic(ApplicationUser user)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var frontendBaseUrl = "https://graduation-project-ten-liart.vercel.app/createpass";
            var roles = await _userManager.GetRolesAsync(user);
            var userRole = roles.FirstOrDefault();
            var confirmationLink = $"{frontendBaseUrl}?userId={user.Id}&Email={user.Email}&Role={userRole}&token={encodedToken}";

            var subject = "Account Activation - HerJourney";
            var body = $"<h1>Welcome {user.DisplayName}</h1>" +
                       $"<p>Please confirm your account by clicking this link: <a href='{confirmationLink}'>Click Here</a></p>";

            await SendEmailAsync(user.Email!, subject, body);
        }



        private async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                using var client = new SmtpClient("smtp.gmail.com", 587)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential("loayayad2017@gmail.com", "sljlycgqlkeqrxbi")
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("loayayad2017@gmail.com"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(to);

                await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email Error: {ex.Message}");
            }
        }

        public async Task<PaginatedResult<UserDashBoardDto>> GetDashboardWithFiltersAsync(DashBoardQueryParams queryParams)
        {
            var Dspec = new DoctorDetailsSpecification();
            var Drepo = _unitOfWork.GetRepository<Doctor>();
            var Doctors = await Drepo.GetAllAsync(Dspec);

            var DoctorsDto = _mapper.Map<IEnumerable<UserDashBoardDto>>(Doctors);
            //foreach (var Doctor in DoctorsDto)
            //    Doctor.Role = "Doctor";

            var Pspec = new PatientDetailsSpecification();
            var Prepo = _unitOfWork.GetRepository<Patient>();
            var Patients = await Prepo.GetAllAsync(Pspec);
            var PatientsDto = _mapper.Map<IEnumerable<UserDashBoardDto>>(Patients);
            //foreach (var Patient in PatientsDto)
            //    Patient.Role = "Patient";


            var Data = DoctorsDto.Concat(PatientsDto);

            if (!string.IsNullOrEmpty(queryParams.Role))
            {
                Data = Data.Where(u => u.Role.Equals(queryParams.Role, StringComparison.OrdinalIgnoreCase));
            }


            if (!string.IsNullOrEmpty(queryParams.search))
            {
                Data = Data.Where(u => (u.DisplayName != null && u.DisplayName.ToLower().Contains(queryParams.search.ToLower())) ||
                                       (u.Email != null && u.Email.ToLower().Contains(queryParams.search.ToLower())));
            }

            if (queryParams.FromDate.HasValue)
            {
                Data = Data.Where(u => u.CreatedAt.Date >= queryParams.FromDate.Value.Date);
            }

            if (queryParams.ToDate.HasValue)
            {
                Data = Data.Where(u => u.CreatedAt.Date < queryParams.ToDate.Value.Date.AddDays(1));
            }


            Data = queryParams.sort switch
            {
                BoardSortingOptions.DateDesc => Data.OrderByDescending(u => u.CreatedAt),
                _ => Data.OrderBy(u => u.CreatedAt)
            };

            var totalCount = Data.Count();

            var pagedData = Data
                .Skip((queryParams.pageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToList();

            return new PaginatedResult<UserDashBoardDto>(
                queryParams.pageNumber,
                queryParams.PageSize,
                totalCount,
                pagedData
            );
        }
    }
}
