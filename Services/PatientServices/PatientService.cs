using AutoMapper;
using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models;
using Microsoft.AspNetCore.Http;
using Services.Specifications.AppointmentSpecifications;
using Services.Specifications.MedicalHistorySpecification;
using Services.Specifications.MedicalTestSpecifications;
using Services.Specifications.PatientSpecifications;
using ServicesAbstraction.Common;
using ServicesAbstraction.NotificationAbstraction;
using ServicesAbstraction.PatientAbstraction;
using ServicesAbstraction.ZoomAbstraction;
using Shared.DTos.AppointmentDTos;
using Shared.DTos.MedicalHistoryDTos;
using Shared.DTos.MedicalTestDTos;
using Shared.DTos.NotificationDTos;
using Shared.DTos.PatientDTos;
using Shared.DTos.ZoomDTos;
using Shared.ErrorModels;
using System.Globalization;

namespace Services.PatientServices
{
    public class PatientService(IUnitOfWork _unitOfWork, IMapper _mapper,
        IFileStorageService _fileStorageService, INotificationService _notificationService
        , IZoomMeetingService _zoomMeetingService) : IPatientService
    {
        //public async Task<bool> CompleteProfileAsync(string userId, CompleteMedicalProfileDto profileDto)
        //{
        //    var psepc = new PatientByIdSpecification(userId);
        //    var prepo = _unitOfWork.GetRepository<Patient>();
        //    var patient = await prepo.GetByIdAsync(psepc);

        //    if (patient == null) throw new PatientNotFoundException(userId);

        //    _mapper.Map(profileDto, patient.MedicalInfo);
        //    prepo.Update(patient);
        //    await _unitOfWork.SaveChangesAsync();
        //    return true;
        //}



        public async Task<ServiceResponse> CompleteProfileAsync(string userId, CompleteMedicalProfileDto profileDto)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedException();

            if (profileDto is null)
                throw new BadRequestException("Profile data is required.");

            var patientRepo = _unitOfWork.GetRepository<Patient>();

            var patient = await patientRepo.GetByIdAsync(new PatientByIdSpecification(userId));

            if (patient is null)
                throw new PatientNotFoundException(userId);

            if (patient.User is null)
                throw new BadRequestException("Patient user data is not loaded.");

            ValidateProfileImage(profileDto.ProfileImage);

            ValidateMedicalProfileData(profileDto);

            var oldProfileImagePath = patient.User.ProfileImagePath;
            string? uploadedObjectName = null;

            try
            {
                if (profileDto.ProfileImage is not null && profileDto.ProfileImage.Length > 0)
                {
                    var objectName = BuildProfileImageObjectName("patients", patient.Id, profileDto.ProfileImage.FileName);

                    uploadedObjectName = await _fileStorageService.UploadFileAsync(profileDto.ProfileImage, objectName);

                    patient.User.ProfileImagePath = uploadedObjectName;
                }
                patient.MedicalInfo ??= new MedicalData();

                _mapper.Map(profileDto, patient.MedicalInfo);

                patientRepo.Update(patient);

                await _unitOfWork.SaveChangesAsync();

                if (!string.IsNullOrWhiteSpace(uploadedObjectName) &&
                    !string.IsNullOrWhiteSpace(oldProfileImagePath))
                {
                    try
                    {
                        await _fileStorageService.DeleteFileAsync(oldProfileImagePath);
                    }
                    catch
                    {
                    }
                }
                return new ServiceResponse
                {
                    Status = true,
                    Message = "Profile completed successfully."
                };
            }
            catch
            {
                if (!string.IsNullOrWhiteSpace(uploadedObjectName))
                {
                    try
                    {
                        await _fileStorageService.DeleteFileAsync(uploadedObjectName);
                    }
                    catch
                    {
                    }
                }

                throw;
            }
        }


        private static void ValidateMedicalProfileData(CompleteMedicalProfileDto profileDto)
        {
            var errors = new List<string>();

            if (profileDto.Height.HasValue && profileDto.Height <= 0)
                errors.Add("Height must be greater than 0.");

            if (profileDto.Weight.HasValue && profileDto.Weight <= 0)
                errors.Add("Weight must be greater than 0.");

            if (profileDto.NumberOfPregnancies.HasValue && profileDto.NumberOfPregnancies < 0)
                errors.Add("Number of pregnancies cannot be negative.");

            if (profileDto.Gravida.HasValue && profileDto.Gravida < 0)
                errors.Add("Gravida cannot be negative.");

            if (profileDto.Parity.HasValue && profileDto.Parity < 0)
                errors.Add("Parity cannot be negative.");

            if (profileDto.Gravida.HasValue &&
                profileDto.Parity.HasValue &&
                profileDto.Parity > profileDto.Gravida)
            {
                errors.Add("Parity cannot be greater than Gravida.");
            }

            if (profileDto.DateOfBirth.HasValue &&
                profileDto.DateOfBirth.Value > DateOnly.FromDateTime(DateTime.Today))
            {
                errors.Add("Date of birth cannot be in the future.");
            }

            if (profileDto.PregnancyStartDate.HasValue &&
                profileDto.PregnancyStartDate.Value > DateOnly.FromDateTime(DateTime.Today))
            {
                errors.Add("Pregnancy start date cannot be in the future.");
            }

            if (errors.Any())
                throw new BadRequestException(errors);
        }




        public async Task<IEnumerable<AvailabilitySlotDto>> GetAllSlotsAsync(string Email)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            var PRepo = _unitOfWork.GetRepository<Patient>();
            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var SlotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();

            var spec = new PatientDetailsSpecification(Email);
            var patient = await PRepo.GetByIdAsync(spec);

            if (patient is null)
                throw new PatientNotFoundException(Email);

            var doctor = await DRepo.GetByIdAsync(patient.DoctorID);

            if (doctor == null)
                throw new DoctorNotFoundException("Doctor not found.");

            var slotSpec = new AvailableDoctorSlotsSpecification(doctor.Id);
            var slots = await SlotRepo.GetAllAsync(slotSpec);

            return _mapper.Map<IEnumerable<AvailabilitySlotDto>>(slots);
        }


        public async Task<IEnumerable<PatientAppointmentDto>> GetMyAppointmentsAsync(string email, AppointmentStatusDto? status = null)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var patient = await patientRepo.GetByIdAsync(
                new PatientByEmailForAppointmentSpecification(email));

            if (patient is null)
                throw new PatientNotFoundException(email);

            await CompleteExpiredConfirmedAppointmentsForPatientAsync(patient.Id);

            AppointmentStatus? domainStatus = null;

            if (status.HasValue)
            {
                domainStatus = status.Value switch
                {
                    //AppointmentStatusDto.Pending => AppointmentStatus.Pending,
                    AppointmentStatusDto.Confirmed => AppointmentStatus.Confirmed,
                    AppointmentStatusDto.Canceled => AppointmentStatus.Canceled,
                    AppointmentStatusDto.Completed => AppointmentStatus.Completed,
                    AppointmentStatusDto.ReschedulePending => AppointmentStatus.ReschedulePending,

                    _ => throw new BadRequestException("Invalid appointment status.")
                };
            }

            var appointments = await appointmentRepo.GetAllAsync(
                new PatientAppointmentsSpecificationStatus(patient.Id, domainStatus));

            return appointments.Select(a => new PatientAppointmentDto
            {
                Id = a.Id,

                Date = a.AvailabilitySlot.StartAt.ToString("yyyy-MM-dd"),
                DateLabel = a.AvailabilitySlot.StartAt.ToString("MMM dd"),
                Time = a.AvailabilitySlot.StartAt.ToString("hh:mm tt"),
                Duration = $"{(int)a.AvailabilitySlot.Duration.TotalMinutes} mins",

                DoctorName = a.Doctor.User.DisplayName,

                AppointmentType = string.IsNullOrWhiteSpace(a.SessionName)
                    ? "General Consultation"
                    : a.SessionName,

                VisitType = a.AvailabilitySlot.Type.ToString(),

                Status = a.Status.ToString(),
                IsOnline = a.AvailabilitySlot.Type == DomainLayer.Models.AppointmentType.Online,
                CanJoinOnlineSession = CanUseOnlineSession(a),
                OnlineSessionUrl = a.AvailabilitySlot.Type == DomainLayer.Models.AppointmentType.Online ? a.ZoomJoinUrl : null
            });
        }



        public async Task<ServiceResponse> BookAppointmentAsync(string Email, BookAppointmentDto dto)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            if (dto is null)
                throw new BadRequestException("Appointment data is required.");

            var sessionName = string.IsNullOrWhiteSpace(dto.SessionName)
                ? "General Consultation"
                : dto.SessionName.Trim();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var slotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var patient = await patientRepo.GetByIdAsync(
                new PatientByEmailForAppointmentSpecification(Email));

            if (patient is null)
                throw new PatientNotFoundException(Email);

            var slot = await slotRepo.GetByIdAsync(
                new AvailabilitySlotForBookingSpecification(dto.SlotId));

            if (slot is null)
                throw new SlotNotFoundException(dto.SlotId);

            if (slot.StartAt <= DateTime.Now)
                throw new BadRequestException("This slot is no longer available.");

            if (slot.Appointment is not null)
                throw new BadRequestException("This slot is already booked.");

            if (slot.DoctorId != patient.DoctorID)
                throw new BadRequestException("You can only book appointments with your assigned doctor.");

            var appointment = new Appointment
            {
                SessionName = sessionName,
                PatientId = patient.Id,
                DoctorId = slot.DoctorId,
                AvailabilitySlotId = slot.Id,
                Status = AppointmentStatus.Confirmed,
                CreatedAt = DateTime.Now
            };

            if (slot.Type == DomainLayer.Models.AppointmentType.Online)
            {
                var zoomMeeting = await _zoomMeetingService.CreateMeetingAsync(
                    BuildZoomTopic(sessionName, patient.User.DisplayName),
                    slot.StartAt,
                    slot.Duration);

                ApplyZoomMeeting(appointment, zoomMeeting);
            }

            await appointmentRepo.AddAsync(appointment);

            await _unitOfWork.SaveChangesAsync();

            await _notificationService.CreateAndSendAsync(
                  slot.Doctor.UserId,
                  "New Appointment Booked",
                  $"{patient.User.DisplayName} booked appointment at {slot.StartAt:dd/MM/yyyy hh:mm tt}.",
                  NotificationTypeDto.AppointmentBooked,
                  relatedEntityType: "Appointment",
                  relatedEntityId: appointment.Id);

            if (slot.Type == DomainLayer.Models.AppointmentType.Online)
            {
                await _notificationService.CreateAndSendAsync(
                    patient.UserId,
                    "Online Session Ready",
                    $"Your Zoom session is ready for {slot.StartAt:dd/MM/yyyy hh:mm tt}.",
                    NotificationTypeDto.OnlineSessionReady,
                    relatedEntityType: "Appointment",
                    relatedEntityId: appointment.Id);
            }
            return new ServiceResponse
            {
                Status = true,
                Message = "Appointment booked successfully."
            };
        }



        public async Task<ServiceResponse> CancelAppointmentAsync(string email, int appointmentId)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var patient = await patientRepo.GetByIdAsync(
                new PatientByEmailForAppointmentSpecification(email));

            if (patient is null)
                throw new PatientNotFoundException(email);

            var appointment = await appointmentRepo.GetByIdAsync(
                new PatientAppointmentByIdSpecification(patient.Id, appointmentId));

            if (appointment is null)
                throw new BadRequestException(new List<string>
        {
            "Appointment not found or does not belong to this patient."
        });

            if (appointment.Status != AppointmentStatus.Confirmed)
            {
                throw new BadRequestException(new List<string>
        {
            "Only confirmed appointments can be canceled."
        });
            }

            if (appointment.AvailabilitySlot is null)
                throw new BadRequestException(new List<string>
        {
            "Appointment slot not found."
        });

            var doctorUserId = appointment.Doctor.UserId;
            var patientName = patient.User.DisplayName;
            var appointmentTime = appointment.AvailabilitySlot.StartAt;
            var sessionName = string.IsNullOrWhiteSpace(appointment.SessionName)
                ? "General Consultation"
                : appointment.SessionName;

            await DeleteZoomMeetingIfExistsAsync(appointment);
            appointmentRepo.Remove(appointment);

            await _unitOfWork.SaveChangesAsync();

            await _notificationService.CreateAndSendAsync(
                doctorUserId,
                "Appointment Canceled By Patient",
                $"{patientName} canceled appointment at {appointmentTime:dd/MM/yyyy hh:mm tt}.",
                NotificationTypeDto.AppointmentCanceled
                );

            return new ServiceResponse
            {
                Status = true,
                Message = "Appointment canceled successfully. The slot is available again."
            };
        }


        public async Task<ServiceResponse> AcceptRescheduleAsync(string email, int appointmentId)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var patient = await patientRepo.GetByIdAsync(
                new PatientByEmailForAppointmentSpecification(email));

            if (patient is null)
                throw new PatientNotFoundException(email);

            var appointment = await appointmentRepo.GetByIdAsync(
                new PatientAppointmentByIdSpecification(patient.Id, appointmentId));

            if (appointment is null)
                throw new BadRequestException(new List<string> { "Appointment not found or does not belong to this patient." });

            if (appointment.Status != AppointmentStatus.ReschedulePending)
                throw new BadRequestException(new List<string> { "This appointment is not waiting for reschedule approval." });

            if (appointment.AvailabilitySlot is null)
                throw new BadRequestException(new List<string> { "Appointment slot not found." });

            if (appointment.AvailabilitySlot.StartAt <= DateTime.Now)
                throw new BadRequestException(new List<string> { "This appointment time is no longer valid." });

            appointment.Status = AppointmentStatus.Confirmed;

            appointmentRepo.Update(appointment);

            await _unitOfWork.SaveChangesAsync();

            await _notificationService.CreateAndSendAsync(
                appointment.Doctor.UserId,
                "Reschedule Accepted",
                $"{patient.User.DisplayName} accepted the new appointment time: {appointment.AvailabilitySlot.StartAt:dd/MM/yyyy hh:mm tt}.",
                NotificationTypeDto.AppointmentRescheduleAccepted,
                relatedEntityType: "Appointment",
                relatedEntityId: appointment.Id);

            return new ServiceResponse
            {
                Status = true,
                Message = "Reschedule accepted successfully."
            };
        }


        public async Task<ServiceResponse> RejectRescheduleAsync(string email, int appointmentId)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var patient = await patientRepo.GetByIdAsync(
                new PatientByEmailForAppointmentSpecification(email));

            if (patient is null)
                throw new PatientNotFoundException(email);

            var appointment = await appointmentRepo.GetByIdAsync(
                new PatientAppointmentByIdSpecification(patient.Id, appointmentId));

            if (appointment is null)
                throw new BadRequestException(new List<string> { "Appointment not found or does not belong to this patient." });

            if (appointment.Status != AppointmentStatus.ReschedulePending)
                throw new BadRequestException(new List<string> { "This appointment is not waiting for reschedule approval." });

            if (appointment.AvailabilitySlot is null)
                throw new BadRequestException(new List<string> { "Appointment slot not found." });

            var rejectedSlotTime = appointment.AvailabilitySlot.StartAt;
            var doctorUserId = appointment.Doctor.UserId;
            var patientName = patient.User.DisplayName;

            await DeleteZoomMeetingIfExistsAsync(appointment);
            appointmentRepo.Remove(appointment);

            await _unitOfWork.SaveChangesAsync();

            await _notificationService.CreateAndSendAsync(
                doctorUserId,
                "Reschedule Rejected",
                $"{patientName} rejected the proposed appointment time: {rejectedSlotTime:dd/MM/yyyy hh:mm tt}.",
                NotificationTypeDto.AppointmentRescheduleRejected,
                null);

            return new ServiceResponse
            {
                Status = true,
                Message = "Reschedule rejected. Appointment has been removed and the slot is available again."
            };
        }
        public async Task<MedicalTestDto> UploadMedicalTestAsync(string userId, UploadMedicalTestDto dto)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedException();

            if (dto is null || dto.File is null || dto.File.Length == 0)
                throw new BadRequestException("Medical test file is required.");

            var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(dto.File.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                throw new BadRequestException("Only pdf, jpg, jpeg, and png files are allowed.");

            const long maxFileSize = 10 * 1024 * 1024;
            if (dto.File.Length > maxFileSize)
                throw new BadRequestException("File size must not exceed 10 MB.");

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var medicalTestRepo = _unitOfWork.GetRepository<MedicalTest>();

            var patient = await patientRepo.GetByIdAsync(new PatientByIdSpecification(userId));
            if (patient == null)
                throw new PatientNotFoundException(userId);

            var objectName = BuildMedicalTestObjectName(patient.Id, dto.File.FileName);

            string? uploadedObjectName = null;

            try
            {
                uploadedObjectName = await _fileStorageService.UploadFileAsync(dto.File, objectName);

                var medicalTest = new MedicalTest
                {
                    FileName = dto.File.FileName,
                    FilePath = uploadedObjectName,
                    UploadedAt = DateTime.Now,
                    PatientId = patient.Id
                };

                await medicalTestRepo.AddAsync(medicalTest);

                var saved = await _unitOfWork.SaveChangesAsync();

                if (saved <= 0)
                    throw new BadRequestException("Failed to save medical test.");

                var doctorRepo = _unitOfWork.GetRepository<Doctor>();
                var doctor = await doctorRepo.GetByIdAsync(patient.DoctorID);

                if (doctor is not null)
                {
                    await _notificationService.CreateAndSendAsync(
                        doctor.UserId,
                        "New Medical Test Uploaded",
                        $"{patient.User.DisplayName} uploaded a new medical test.",
                        NotificationTypeDto.MedicalTestUploaded,
                        relatedEntityType: "MedicalTest",
                        relatedEntityId: medicalTest.Id);
                }

                return _mapper.Map<MedicalTestDto>(medicalTest);


                //await medicalTestRepo.AddAsync(medicalTest);

                //return await _unitOfWork.SaveChangesAsync() > 0
                //    ? _mapper.Map<MedicalTestDto>(medicalTest)
                //    : throw new BadRequestException("Failed to save medical test.");
            }
            catch
            {
                if (!string.IsNullOrWhiteSpace(uploadedObjectName))
                {
                    try
                    {
                        await _fileStorageService.DeleteFileAsync(uploadedObjectName);
                    }
                    catch
                    {
                    }
                }

                throw;
            }
        }



        public async Task<IEnumerable<MedicalTestListDto>> GetMyMedicalTestsAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedException();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var medicalTestRepo = _unitOfWork.GetRepository<MedicalTest>();

            var patient = await patientRepo.GetByIdAsync(new PatientByIdSpecification(userId));
            if (patient == null)
                throw new PatientNotFoundException(userId);

            var tests = await medicalTestRepo.GetAllAsync(new PatientMedicalTestsSpecification(patient.Id));

            return _mapper.Map<IEnumerable<MedicalTestListDto>>(tests.OrderByDescending(t => t.UploadedAt));
        }

        public async Task<MedicalTestFileDto> ViewMedicalTestAsync(string userId, int medicalTestId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedException();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var medicalTestRepo = _unitOfWork.GetRepository<MedicalTest>();

            var patient = await patientRepo.GetByIdAsync(new PatientByIdSpecification(userId));
            if (patient == null)
                throw new PatientNotFoundException(userId);

            var medicalTest = await medicalTestRepo.GetByIdAsync(
                new PatientMedicalTestsSpecification(patient.Id, medicalTestId));

            if (medicalTest == null)
                throw new BadRequestException("Medical test not found.");

            var fileResult = await _fileStorageService.DownloadFileAsync(medicalTest.FilePath);
            fileResult.FileName = medicalTest.FileName;

            return fileResult;
        }

        public async Task<ServiceResponse> DeleteMedicalTestAsync(string userId, int medicalTestId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedException();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var medicalTestRepo = _unitOfWork.GetRepository<MedicalTest>();

            var patient = await patientRepo.GetByIdAsync(new PatientByIdSpecification(userId));
            if (patient == null)
                throw new PatientNotFoundException(userId);

            var medicalTest = await medicalTestRepo.GetByIdAsync(
                new PatientMedicalTestsSpecification(patient.Id, medicalTestId));

            if (medicalTest == null)
                throw new BadRequestException("Medical test not found.");

            if (!string.IsNullOrWhiteSpace(medicalTest.FilePath))
            {
                await _fileStorageService.DeleteFileAsync(medicalTest.FilePath);
            }

            medicalTestRepo.Remove(medicalTest);

            return await _unitOfWork.SaveChangesAsync() > 0
                ? new ServiceResponse
                {
                    Status = true,
                    Message = "Medical test deleted successfully."
                }
                : new ServiceResponse
                {
                    Status = false,
                    Message = "Medical test was not deleted."
                };
        }

        public async Task<OnlineSessionLinkDto> GetPatientOnlineSessionLinkAsync(string email, int appointmentId)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var patient = await patientRepo.GetByIdAsync(
                new PatientByEmailForAppointmentSpecification(email));

            if (patient is null)
                throw new PatientNotFoundException(email);

            var appointment = await appointmentRepo.GetByIdAsync(
                new PatientAppointmentByIdSpecification(patient.Id, appointmentId));

            if (appointment is null)
                throw new BadRequestException(new List<string> { "Appointment not found or does not belong to this patient." });

            if (appointment.Status != AppointmentStatus.Confirmed)
                throw new BadRequestException(new List<string> { "Only confirmed appointments can be joined online." });

            if (appointment.AvailabilitySlot is null ||
                appointment.AvailabilitySlot.Type != DomainLayer.Models.AppointmentType.Online)
                throw new BadRequestException(new List<string> { "This appointment is not an online session." });

            if (appointment.AvailabilitySlot.StartAt.Add(appointment.AvailabilitySlot.Duration) <= DateTime.Now)
                throw new BadRequestException(new List<string> { "This online session has already ended." });

            if (string.IsNullOrWhiteSpace(appointment.ZoomJoinUrl))
                throw new BadRequestException(new List<string> { "Zoom link is not available for this appointment." });

            return new OnlineSessionLinkDto
            {
                AppointmentId = appointment.Id,
                JoinUrl = appointment.ZoomJoinUrl,
                Password = appointment.ZoomPassword,
                StartAt = appointment.AvailabilitySlot.StartAt,
                DurationMinutes = (int)appointment.AvailabilitySlot.Duration.TotalMinutes,
                CanJoinNow = CanUseOnlineSession(appointment)
            };
        }

        public async Task<PatientDashboardProfileDto> GetMyDashboardProfileAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var predictionRepo = _unitOfWork.GetRepository<PredictionRecord>();

            var patient = await patientRepo.GetByIdAsync(
                new PatientDetailsSpecification(email));

            if (patient is null)
                throw new PatientNotFoundException(email);

            if (patient.User is null)
                throw new BadRequestException("Patient user data is not loaded.");

            var doctor = await doctorRepo.GetByIdAsync(
                new DoctorDetailsSpecification(patient.DoctorID));

            var medicalInfo = patient.MedicalInfo ?? new MedicalData();

            var predictions = await predictionRepo.GetAllAsync(
                new PatientPredictionsSpecification(patient.Id));

            var latestGdm = predictions
                .Where(p => p.Type == PredictionType.GDM)
                .OrderByDescending(p => p.CreatedAt)
                .ThenByDescending(p => p.Id)
                .FirstOrDefault();

            var latestPreeclampsia = predictions
                .Where(p => p.Type == PredictionType.Preeclampsia)
                .OrderByDescending(p => p.CreatedAt)
                .ThenByDescending(p => p.Id)
                .FirstOrDefault();

            var pregnancyWeek = GetPregnancyWeek(medicalInfo);
            var trimester = GetTrimester(pregnancyWeek);

            return new PatientDashboardProfileDto
            {
                PatientId = patient.Id,

                DisplayName = patient.User.DisplayName,
                Email = patient.User.Email ?? string.Empty,
                PhoneNumber = patient.User.PhoneNumber,
                ProfileImageUrl = await GenerateImageUrlAsync(patient.User.ProfileImagePath),

                PregnancyLabel = BuildPregnancyLabel(trimester, pregnancyWeek),
                Trimester = trimester,
                PregnancyWeek = pregnancyWeek,
                PregnancyTipTitle = BuildPregnancyTipTitle(trimester),
                PregnancyTip = BuildPregnancyTip(trimester),

                BloodType = medicalInfo.BloodType,
                HeightCm = medicalInfo.Height,
                WeightKg = medicalInfo.Weight,
                NumberOfPregnancies = medicalInfo.NumberOfPregnancies,

                GdmRisk = GetRiskLevel(latestGdm?.Confidence),
                GdmConfidencePercentage = ToPercentage(latestGdm?.Confidence),

                PreeclampsiaRisk = GetRiskLevel(latestPreeclampsia?.Confidence),
                PreeclampsiaConfidencePercentage = ToPercentage(latestPreeclampsia?.Confidence),

                DateOfBirth = medicalInfo.DateOfBirth?.ToString(
                    "MMMM dd, yyyy",
                    CultureInfo.InvariantCulture),

                Doctor = doctor is null ? null : new PatientDashboardDoctorDto
                {
                    DoctorId = doctor.Id,
                    DisplayName = doctor.User?.DisplayName ?? string.Empty,
                    Email = doctor.User?.Email,
                    PhoneNumber = doctor.User?.PhoneNumber,
                    ProfileImageUrl = await GenerateImageUrlAsync(doctor.User?.ProfileImagePath),
                    YearsOfExperience = doctor.YearsOfExperience,
                    Location = doctor.Location,
                    Specializations = doctor.Specializations ?? []
                }
            };
        }




        public async Task<IEnumerable<PatientMedicalHistoryMonthGroupDto>> GetMyMedicalHistoriesAsync(string userId, PatientMedicalHistoryQueryParams queryParams)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedException();

            queryParams ??= new PatientMedicalHistoryQueryParams();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var medicalHistoryRepo = _unitOfWork.GetRepository<MedicalHistory>();

            var patient = await patientRepo.GetByIdAsync(new PatientByIdSpecification(userId));

            if (patient is null)
                throw new PatientNotFoundException(userId);

            var histories = await medicalHistoryRepo.GetAllAsync(
                new PatientMedicalHistoriesSpecification(
                    patient.Id,
                    queryParams.HasPrediction,
                    queryParams.Sort));

            var items = histories.Select(h =>
            {
                var prediction = h.PredictionRecord;

                return new
                {
                    MonthKey = new DateTime(h.CreatedAt.Year, h.CreatedAt.Month, 1),

                    Item = new PatientMedicalHistoryTimelineItemDto
                    {
                        MedicalHistoryId = h.Id,

                        Diagnosis = h.Diagnosis,
                        VitalSigns = h.VitalSigns,
                        Notes = h.Notes,

                        CreatedAt = h.CreatedAt,
                        Date = h.CreatedAt.ToString("MMM dd, yyyy", CultureInfo.InvariantCulture),
                        Time = h.CreatedAt.ToString("hh:mm tt", CultureInfo.InvariantCulture),

                        //DoctorName = h.CreatedByDoctor?.User?.DisplayName,

                        HasPrediction = prediction is not null,

                        Prediction = prediction is null
                            ? null
                            : new PatientMedicalHistoryPredictionDto
                            {
                                PredictionRecordId = prediction.Id,
                                Type = prediction.Type.ToString(),
                                Result = prediction.Result,
                                RiskLevel = GetRiskLevel(prediction.Confidence),
                                ConfidencePercentage = ToPercentage(prediction.Confidence) ?? 0,
                                CreatedAt = prediction.CreatedAt
                            },

                        Prescriptions = h.PreScriptions
                            .OrderByDescending(p => p.CreatedAt)
                            .Select(p => new PatientMedicalHistoryPrescriptionDto
                            {
                                PrescriptionId = p.Id,
                                MedicationName = p.MedicationName,
                                Dosage = p.Dosage,
                                Duration = p.Duration,
                                Instructions = p.Instructions,
                                CreatedAt = p.CreatedAt
                            })
                            .ToList()
                    }
                };
            }).ToList();

            var grouped = items
                .GroupBy(x => x.MonthKey)
                .Select(g => new PatientMedicalHistoryMonthGroupDto
                {
                    Month = g.Key.ToString("MMMM yyyy", CultureInfo.InvariantCulture),
                    Items = queryParams.Sort == PatientMedicalHistorySort.Oldest
                        ? g.Select(x => x.Item).OrderBy(x => x.CreatedAt).ToList()
                        : g.Select(x => x.Item).OrderByDescending(x => x.CreatedAt).ToList()
                });

            return queryParams.Sort == PatientMedicalHistorySort.Oldest
                ? grouped.OrderBy(g => DateTime.ParseExact(g.Month, "MMMM yyyy", CultureInfo.InvariantCulture)).ToList()
                : grouped.OrderByDescending(g => DateTime.ParseExact(g.Month, "MMMM yyyy", CultureInfo.InvariantCulture)).ToList();
        }




        public async Task<IEnumerable<PatientPrescriptionDto>> GetMyPrescriptionsAsync(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedException();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var medicalHistoryRepo = _unitOfWork.GetRepository<MedicalHistory>();

            var patient = await patientRepo.GetByIdAsync(new PatientByIdSpecification(userId));

            if (patient is null)
                throw new PatientNotFoundException(userId);

            var histories = await medicalHistoryRepo.GetAllAsync(
                new PatientMedicalHistoriesSpecification(patient.Id));

            return histories
                .SelectMany(h => h.PreScriptions)
                .Select(p => new PatientPrescriptionDto
                {
                    MedicationName = p.MedicationName,
                    Dosage = p.Dosage,
                    Duration = p.Duration,
                    Instructions = p.Instructions
                })
                .ToList();
        }




        public async Task<PatientLastVisitSummaryDto?> GetMyLastVisitSummaryAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var patientRepo = _unitOfWork.GetRepository<Patient>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();
            var medicalHistoryRepo = _unitOfWork.GetRepository<MedicalHistory>();

            var patient = await patientRepo.GetByIdAsync(
                new PatientByEmailForAppointmentSpecification(email));

            if (patient is null)
                throw new PatientNotFoundException(email);

            await CompleteExpiredConfirmedAppointmentsForPatientAsync(patient.Id);

            var appointments = await appointmentRepo.GetAllAsync(
                new PatientLastCompletedAppointmentSpecification(patient.Id));

            var lastVisit = appointments.FirstOrDefault();

            if (lastVisit is null || lastVisit.AvailabilitySlot is null)
                throw new BadRequestException("No completed appointment found for this patient.");

            var visitDate = lastVisit.AvailabilitySlot.StartAt;

            var histories = await medicalHistoryRepo.GetAllAsync(
                new PatientMedicalHistoryByVisitDateSpecification(
                    patient.Id,
                    lastVisit.DoctorId,
                    visitDate));

            var medicalHistory = histories.FirstOrDefault();

            if (medicalHistory is null)
                throw new BadRequestException($"No medical history found on visit date: {visitDate.Date:yyyy-MM-dd}");

            return new PatientLastVisitSummaryDto
            {
                MedicalHistoryId = medicalHistory.Id,

                Date = medicalHistory.CreatedAt.ToString(
                    "MMM dd, yyyy",
                    CultureInfo.InvariantCulture),

                Diagnosis = medicalHistory.Diagnosis,
                VitalSigns = medicalHistory.VitalSigns,
                Notes = medicalHistory.Notes
            };
        }





        private static string BuildMedicalTestObjectName(int patientId, string fileName)
        {
            var extension = Path.GetExtension(fileName);
            var originalName = Path.GetFileNameWithoutExtension(fileName);

            var safeName = string.Concat(originalName
                .Where(c => char.IsLetterOrDigit(c) || c == '-' || c == '_'))
                .Trim();

            if (string.IsNullOrWhiteSpace(safeName))
                safeName = "medical-test";

            var now = DateTime.Now;
            var uniqueFileName = $"{Guid.NewGuid()}-{safeName}{extension}";

            return $"medical-tests/patients/{patientId}/{now:yyyy}/{now:MM}/{uniqueFileName}";
        }

        private async Task CompleteExpiredConfirmedAppointmentsForPatientAsync(int patientId)
        {
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var appointments = await appointmentRepo.GetAllAsync(
                new PatientConfirmedAppointmentsSpecification(patientId));

            var now = DateTime.Now;

            var expiredAppointments = appointments
                .Where(a => a.AvailabilitySlot.StartAt.Add(a.AvailabilitySlot.Duration) <= now)
                .ToList();

            if (!expiredAppointments.Any())
                return;

            foreach (var appointment in expiredAppointments)
            {
                appointment.Status = AppointmentStatus.Completed;
                appointmentRepo.Update(appointment);
            }

            await _unitOfWork.SaveChangesAsync();
        }



        private static void ValidateProfileImage(IFormFile? file)
        {
            if (file is null || file.Length == 0)
                return;

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                throw new BadRequestException("Only jpg, jpeg, and png images are allowed.");

            const long maxFileSize = 5 * 1024 * 1024;

            if (file.Length > maxFileSize)
                throw new BadRequestException("Profile image size must not exceed 5 MB.");
        }

        private static string BuildProfileImageObjectName(string ownerType, int ownerId, string fileName)
        {
            var extension = Path.GetExtension(fileName);
            var originalName = Path.GetFileNameWithoutExtension(fileName);

            var safeName = string.Concat(originalName
                .Where(c => char.IsLetterOrDigit(c) || c == '-' || c == '_'))
                .Trim();

            if (string.IsNullOrWhiteSpace(safeName))
                safeName = "profile-image";

            var now = DateTime.Now;
            var uniqueFileName = $"{Guid.NewGuid()}-{safeName}{extension}";

            return $"profile-images/{ownerType}/{ownerId}/{now:yyyy}/{now:MM}/{uniqueFileName}";
        }


        private static string BuildZoomTopic(string sessionName, string patientName)
        {
            var safeSessionName = string.IsNullOrWhiteSpace(sessionName)
                ? "General Consultation"
                : sessionName.Trim();

            var safePatientName = string.IsNullOrWhiteSpace(patientName)
                ? "Patient"
                : patientName.Trim();

            return $"HerJourney - {safeSessionName} - {safePatientName}";
        }

        private static void ApplyZoomMeeting(Appointment appointment, ZoomMeetingResult zoomMeeting)
        {
            appointment.OnlineMeetingProvider = "Zoom";
            appointment.ZoomMeetingId = zoomMeeting.Id;
            appointment.ZoomJoinUrl = zoomMeeting.JoinUrl;
            appointment.ZoomStartUrl = zoomMeeting.StartUrl;
            appointment.ZoomPassword = zoomMeeting.Password;
            appointment.ZoomCreatedAt = DateTime.Now;
            appointment.ZoomUpdatedAt = DateTime.Now;
        }

        private static void ClearZoomMeeting(Appointment appointment)
        {
            appointment.OnlineMeetingProvider = null;
            appointment.ZoomMeetingId = null;
            appointment.ZoomJoinUrl = null;
            appointment.ZoomStartUrl = null;
            appointment.ZoomPassword = null;
            appointment.ZoomUpdatedAt = DateTime.Now;
        }

        private async Task DeleteZoomMeetingIfExistsAsync(Appointment appointment)
        {
            if (appointment.ZoomMeetingId.HasValue)
            {
                await _zoomMeetingService.DeleteMeetingAsync(appointment.ZoomMeetingId.Value);
                ClearZoomMeeting(appointment);
            }
        }

        private static bool CanUseOnlineSession(Appointment appointment)
        {
            if (appointment.AvailabilitySlot is null ||
                appointment.AvailabilitySlot.Type != DomainLayer.Models.AppointmentType.Online ||
                appointment.Status != AppointmentStatus.Confirmed)
                return false;

            var now = DateTime.Now;
            var startAt = appointment.AvailabilitySlot.StartAt;
            var endAt = startAt.Add(appointment.AvailabilitySlot.Duration);

            return now >= startAt.AddMinutes(-15) && now <= endAt;
        }



        private async Task<string?> GenerateImageUrlAsync(string? objectName)
        {
            if (string.IsNullOrWhiteSpace(objectName))
                return null;

            return await _fileStorageService.GenerateReadUrlAsync(
                objectName,
                TimeSpan.FromHours(12));
        }

        private static int? GetPregnancyWeek(MedicalData medicalInfo)
        {
            if (medicalInfo.PregnancyWeek.HasValue && medicalInfo.PregnancyWeek.Value > 0)
                return medicalInfo.PregnancyWeek.Value;

            if (!medicalInfo.PregnancyStartDate.HasValue)
                return null;

            var today = DateOnly.FromDateTime(DateTime.Today);
            var days = today.DayNumber - medicalInfo.PregnancyStartDate.Value.DayNumber;

            if (days < 0)
                return null;

            return Math.Min(42, (days / 7) + 1);
        }

        private static string? GetTrimester(int? pregnancyWeek)
        {
            if (!pregnancyWeek.HasValue || pregnancyWeek.Value <= 0)
                return null;

            if (pregnancyWeek.Value <= 13)
                return "1st Trimester";

            if (pregnancyWeek.Value <= 27)
                return "2nd Trimester";

            return "3rd Trimester";
        }

        private static string? BuildPregnancyLabel(string? trimester, int? pregnancyWeek)
        {
            if (!pregnancyWeek.HasValue)
                return null;

            if (string.IsNullOrWhiteSpace(trimester))
                return $"Week {pregnancyWeek.Value}";

            return $"{trimester} - Week {pregnancyWeek.Value}";
        }

        private static decimal? ToPercentage(decimal? confidence)
        {
            if (!confidence.HasValue)
                return null;

            return confidence.Value <= 1
                ? Math.Round(confidence.Value * 100, 2)
                : Math.Round(confidence.Value, 2);
        }

        private static string GetRiskLevel(decimal? confidence)
        {
            if (!confidence.HasValue)
                return "Not Predicted";

            var percentage = ToPercentage(confidence) ?? 0;

            if (percentage >= 75)
                return "High Risk";

            if (percentage >= 50)
                return "Moderate Risk";

            return "Low Risk";
        }


        private static string? BuildPregnancyTipTitle(string? trimester)
        {
            return trimester switch
            {
                "1st Trimester" => "Your baby is starting to grow",
                "2nd Trimester" => "Your baby is becoming more active",
                "3rd Trimester" => "Your baby is getting ready for birth",
                _ => null
            };
        }

        private static string? BuildPregnancyTip(string? trimester)
        {
            return trimester switch
            {
                "Trimester 1" or "1st Trimester" =>
                    "Focus on rest, hydration, and taking your prenatal vitamins regularly.",

                "Trimester 2" or "2nd Trimester" =>
                    "This is a good time to track your baby’s movement and keep up with your routine checkups.",

                "Trimester 3" or "3rd Trimester" =>
                    "Prepare your birth plan, monitor baby movements, and contact your doctor if you notice anything unusual.",

                _ => null
            };
        }


    }
}

//#region
//public async Task<IEnumerable<MedicalTestDto>> GetMyMedicalTestsAsync(string userId)
//{
//    if (string.IsNullOrWhiteSpace(userId))
//        throw new UnauthorizedException();

//    var patientRepo = _unitOfWork.GetRepository<Patient>();
//    var medicalTestRepo = _unitOfWork.GetRepository<MedicalTest>();

//    var patient = await patientRepo.GetByIdAsync(new PatientByIdSpecification(userId));
//    if (patient == null)
//        throw new PatientNotFoundException(userId);

//    var tests = await medicalTestRepo.GetAllAsync(new PatientMedicalTestsSpecification(patient.Id));

//    return _mapper.Map<IEnumerable<MedicalTestDto>>(tests.OrderByDescending(m => m.UploadedAt));
//}

//public async Task<ServiceResponse> DeleteMedicalTestAsync(string userId, int medicalTestId)
//{
//    if (string.IsNullOrWhiteSpace(userId))
//        throw new UnauthorizedException();

//    var patientRepo = _unitOfWork.GetRepository<Patient>();
//    var medicalTestRepo = _unitOfWork.GetRepository<MedicalTest>();

//    var patient = await patientRepo.GetByIdAsync(new PatientByIdSpecification(userId));
//    if (patient == null)
//        throw new PatientNotFoundException(userId);

//    var medicalTest = await medicalTestRepo.GetByIdAsync(new PatientMedicalTestsSpecification(patient.Id, medicalTestId));
//    if (medicalTest == null)
//        throw new BadRequestException("Medical test not found.");

//    if (!string.IsNullOrWhiteSpace(medicalTest.FilePath))
//    {
//        await _fileStorageService.DeleteFileAsync(medicalTest.FilePath);
//    }

//    medicalTestRepo.Remove(medicalTest);

//    return await _unitOfWork.SaveChangesAsync() > 0
//        ? new ServiceResponse { Status = true, Message = "Medical test deleted successfully." }
//        : new ServiceResponse { Status = false, Message = "Medical test was not deleted." };
//}
//#endregion