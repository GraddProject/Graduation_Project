using AutoMapper;
using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models;
using Services.Specifications.AppointmentSpecifications;
using Services.Specifications.DoctorSpecifications;
using Services.Specifications.MedicalHistorySpecification;
using Services.Specifications.MedicalTestSpecifications;
using Services.Specifications.PatientSpecifications;
using Services.Specifications.PreScriptionSpecifications;
using ServicesAbstraction.Common;
using ServicesAbstraction.DoctorAbstraction;
using ServicesAbstraction.NotificationAbstraction;
using Shared.DTos.AppointmentDTos;
using Shared.DTos.DoctorDTos;
using Shared.DTos.MedicalHistoryDTos;
using Shared.DTos.MedicalTestDTos;
using Shared.DTos.NotificationDTos;
using Shared.ErrorModels;
using AppointmentType = DomainLayer.Models.AppointmentType;

namespace Services.DoctorServices
{
    public class DoctorService(IUnitOfWork _unitOfWork, IMapper _mapper, IFileStorageService _fileStorageService,
                                INotificationService _notificationService) : IDoctorService
    {
        public async Task<bool> AddAvailabilitySlotAsync(string Email, AddAvailabilitySlotDto addAvailabilitySlot)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            if (addAvailabilitySlot is null)
                throw new BadRequestException("Availability slot data is required.");

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var SlotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();

            var spec = new DoctorDetailsSpecification(Email);
            var doctor = await DRepo.GetByIdAsync(spec);

            if (doctor == null)
                throw new DoctorNotFoundException("Doctor not found.");

            if (addAvailabilitySlot.StartAt <= DateTime.Now)
                throw new BadRequestException("Start time must be in the future.");

            if (addAvailabilitySlot.DurationInMinutes <= 0)
                throw new BadRequestException("Duration must be greater than zero.");

            var newEnd = addAvailabilitySlot.StartAt.AddMinutes(addAvailabilitySlot.DurationInMinutes);

            var slotSpec = new DoctorAvailabilitySlotsSpecification(doctor.Id);
            var existingSlots = await SlotRepo.GetAllAsync(slotSpec);

            var hasOverlap = existingSlots.Any(slot =>
                addAvailabilitySlot.StartAt < slot.StartAt.Add(slot.Duration) &&
                newEnd > slot.StartAt);

            if (hasOverlap)
                throw new BadRequestException("This availability slot overlaps with another existing slot.");
            var availabilitySlot = _mapper.Map<AvailabilitySlot>(addAvailabilitySlot);
            availabilitySlot.DoctorId = doctor.Id;

            //var availabilitySlot = new AvailabilitySlot
            //{
            //    DoctorId = doctor.Id,
            //    StartAt = addAvailabilitySlot.StartAt,
            //    Duration = TimeSpan.FromMinutes(addAvailabilitySlot.DurationInMinutes),
            //    Type = (DomainLayer.Models.AppointmentType)addAvailabilitySlot.Type
            //};


            await SlotRepo.AddAsync(availabilitySlot);
            return await _unitOfWork.SaveChangesAsync() > 0;
        }


        public async Task<IEnumerable<AvailabilitySlotDto>> GetMyAvailabilitySlotsAsync(string Email)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();
            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var SlotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();

            var spec = new DoctorDetailsSpecification(Email);
            var doctor = await DRepo.GetByIdAsync(spec);

            if (doctor == null)
                throw new DoctorNotFoundException("Doctor not found.");

            var slotSpec = new DoctorAvailabilitySlotsSpecification(doctor.Id);
            var Slots = await SlotRepo.GetAllAsync(slotSpec);


            return _mapper.Map<IEnumerable<AvailabilitySlotDto>>(Slots);
            //return Slots.Select(slot => new AvailabilitySlotDto
            //{
            //    Id = slot.Id,
            //    StartAt = slot.StartAt,
            //    DurationInMinutes = (int)slot.Duration.TotalMinutes,
            //    Type = (Shared.DTos.AppointmentDTos.AppointmentType)slot.Type,
            //    IsBooked = slot.Appointment is not null
            //});
        }


        public async Task<IEnumerable<DoctorAppointmentDto>> GetDoctorAppointmentsAsync(string Email, AppointmentStatusDto? status = null)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var doctor = await DRepo.GetByIdAsync(new DoctorDetailsSpecification(Email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");
            AppointmentStatus? domainStatus = null;

            if (status.HasValue)
            {
                domainStatus = status.Value switch
                {
                    AppointmentStatusDto.Pending => AppointmentStatus.Pending,
                    AppointmentStatusDto.Confirmed => AppointmentStatus.Confirmed,
                    AppointmentStatusDto.Canceled => AppointmentStatus.Canceled,
                    AppointmentStatusDto.Completed => AppointmentStatus.Completed,
                    AppointmentStatusDto.ReschedulePending => AppointmentStatus.ReschedulePending,

                    _ => throw new BadRequestException("Invalid appointment status.")
                };
            }
            var appointments = await appointmentRepo.GetAllAsync(new DoctorAppointmentsSpecification(doctor.Id, domainStatus));

            return appointments.Select(a => new DoctorAppointmentDto
            {
                Id = a.Id,

                Date = a.AvailabilitySlot.StartAt.ToString("yyyy-MM-dd"),
                DateLabel = a.AvailabilitySlot.StartAt.ToString("MMM dd"),
                Time = a.AvailabilitySlot.StartAt.ToString("hh:mm tt"),
                Duration = $"{(int)a.AvailabilitySlot.Duration.TotalMinutes} mins",

                PatientName = a.Patient.User.DisplayName,

                AppointmentType = string.IsNullOrWhiteSpace(a.SessionName)
                    ? "General Consultation"
                    : a.SessionName,

                VisitType = a.AvailabilitySlot.Type.ToString(),

                Status = a.Status.ToString()
            });
        }

        public async Task<ServiceResponse> ConfirmAppointmentAsync(string email, int appointmentId)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var appointment = await appointmentRepo.GetByIdAsync(
                new DoctorAppointmentByIdSpecification(doctor.Id, appointmentId));

            if (appointment is null)
                throw new BadRequestException("Appointment not found or does not belong to this doctor.");

            if (appointment.Status != AppointmentStatus.Pending)
                throw new BadRequestException("Only pending appointments can be confirmed.");

            if (appointment.AvailabilitySlot.StartAt <= DateTime.Now)
                throw new BadRequestException("Cannot confirm an appointment in the past.");

            appointment.Status = AppointmentStatus.Confirmed;

            appointmentRepo.Update(appointment);

            await _unitOfWork.SaveChangesAsync();

            await _notificationService.CreateAndSendAsync(
                appointment.Patient.UserId,
                "Appointment Confirmed",
                $"Your appointment at {appointment.AvailabilitySlot.StartAt:dd/MM/yyyy hh:mm tt} has been confirmed.",
                NotificationTypeDto.AppointmentConfirmed,
                appointment.Id);

            return new ServiceResponse
            {
                Status = true,
                Message = "Appointment confirmed successfully."
            };
        }

        public async Task<ServiceResponse> CancelAppointmentAsync(string email, int appointmentId)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var appointment = await appointmentRepo.GetByIdAsync(
                new DoctorAppointmentByIdSpecification(doctor.Id, appointmentId));

            if (appointment is null)
                throw new BadRequestException("Appointment not found or does not belong to this doctor.");

            if (appointment.Status == AppointmentStatus.Canceled)
                throw new BadRequestException("Appointment is already canceled.");

            if (appointment.Status == AppointmentStatus.Completed)
                throw new BadRequestException("Completed appointments cannot be canceled.");

            appointment.Status = AppointmentStatus.Canceled;

            appointmentRepo.Update(appointment);

            await _unitOfWork.SaveChangesAsync();

            await _notificationService.CreateAndSendAsync(
                appointment.Patient.UserId,
                "Appointment Canceled",
                $"Your appointment at {appointment.AvailabilitySlot.StartAt:dd/MM/yyyy hh:mm tt} has been canceled.",
                NotificationTypeDto.AppointmentCanceled,
                appointment.Id);

            return new ServiceResponse
            {
                Status = true,
                Message = "Appointment canceled successfully."
            };
        }


        public async Task<ServiceResponse> RequestRescheduleAppointmentAsync(string email,int appointmentId,RescheduleAppointmentDto dto)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            if (dto is null)
                throw new BadRequestException(new List<string> { "Reschedule data is required." });

            if (dto.NewStartAt <= DateTime.Now)
                throw new BadRequestException(new List<string> { "New appointment time must be in the future." });

            if (dto.DurationMinutes <= 0)
                throw new BadRequestException(new List<string> { "Duration must be greater than zero." });

            DomainLayer.Models.AppointmentType domainType = dto.Type switch
            {
                Shared.DTos.AppointmentDTos.AppointmentType.Online
                    => DomainLayer.Models.AppointmentType.Online,

                Shared.DTos.AppointmentDTos.AppointmentType.Offline
                    => DomainLayer.Models.AppointmentType.Offline,

                _ => throw new BadRequestException(new List<string> { "Invalid appointment type." })
            };
            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();
            var slotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var appointment = await appointmentRepo.GetByIdAsync(
                new DoctorAppointmentByIdSpecification(doctor.Id, appointmentId));

            if (appointment is null)
                throw new BadRequestException(new List<string> { "Appointment not found or does not belong to this doctor." });

            if (appointment.AvailabilitySlot is null)
                throw new BadRequestException(new List<string> { "This appointment has no slot to reschedule." });

            if (appointment.Status != AppointmentStatus.Pending &&
                appointment.Status != AppointmentStatus.Confirmed)
                throw new BadRequestException(new List<string> { "Only pending or confirmed appointments can be rescheduled." });

            var newDuration = TimeSpan.FromMinutes(dto.DurationMinutes);
            var currentSlot = appointment.AvailabilitySlot;

            var doctorSlots = await slotRepo.GetAllAsync(
                new DoctorAvailabilitySlotsSpecification(doctor.Id));

            var hasOverlap = doctorSlots.Any(slot =>
                slot.Id != currentSlot.Id &&
                IsOverlapping(dto.NewStartAt, newDuration, slot.StartAt, slot.Duration));

            if (hasOverlap)
                throw new BadRequestException(new List<string> { "This time overlaps with another slot." });

            var oldStartAt = currentSlot.StartAt;

            currentSlot.StartAt = dto.NewStartAt;
            currentSlot.Duration = newDuration;
            currentSlot.Type = (AppointmentType)dto.Type;

            appointment.Status = AppointmentStatus.ReschedulePending;

            slotRepo.Update(currentSlot);
            appointmentRepo.Update(appointment);

            await _unitOfWork.SaveChangesAsync();

            await _notificationService.CreateAndSendAsync(
                appointment.Patient.UserId,
                "Appointment Reschedule Request",
                $"Doctor requested to change your appointment from {oldStartAt:dd/MM/yyyy hh:mm tt} to {currentSlot.StartAt:dd/MM/yyyy hh:mm tt}.",
                NotificationTypeDto.AppointmentRescheduled,
                appointment.Id);

            return new ServiceResponse
            {
                Status = true,
                Message = "Reschedule request sent successfully."
            };
        }



        public async Task<ServiceResponse> UpdateAvailabilitySlotAsync(string Email, int SlotId, UpdateAvailabilitySlotDto dto)
        {

            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            if (dto is null)
                throw new BadRequestException("Availability slot data is required.");

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var SlotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();

            var doctor = await DRepo.GetByIdAsync(new DoctorDetailsSpecification(Email));
            if (doctor == null)
                throw new DoctorNotFoundException("Doctor not found.");
            var slotspec = new DoctorAvailabilitySlotByIdSpecification(SlotId, doctor.Id);

            var slot = await SlotRepo.GetByIdAsync(slotspec);
            if (slot == null)
                throw new SlotNotFoundException(SlotId);

            if (slot.Appointment is not null)
                throw new BadRequestException("Booked slot cannot be updated.");

            if (dto.StartAt <= DateTime.Now)
                throw new BadRequestException("Start time must be in the future.");

            if (dto.DurationInMinutes <= 0)
                throw new BadRequestException("Duration must be greater than zero.");

            var newEnd = dto.StartAt.AddMinutes(dto.DurationInMinutes);

            var existingSlots = await SlotRepo.GetAllAsync(new DoctorAvailabilitySlotsSpecification(doctor.Id));

            var hasOverlap = existingSlots
                .Where(s => s.Id != SlotId)
                .Any(s =>
                    dto.StartAt < s.StartAt.Add(s.Duration) &&
                    newEnd > s.StartAt);

            if (hasOverlap)
                throw new BadRequestException("This availability slot overlaps with another existing slot.");

            slot.StartAt = dto.StartAt;
            slot.Duration = TimeSpan.FromMinutes(dto.DurationInMinutes);
            slot.Type = (DomainLayer.Models.AppointmentType)dto.Type;
            SlotRepo.Update(slot);
            return await _unitOfWork.SaveChangesAsync() > 0 ? new ServiceResponse { Status = true, Message = "Availability slot updated successfully." }
                                                            : new ServiceResponse { Status = true, Message = "No changes were made." };
        }

        public async Task<ServiceResponse> DeleteAvailabilitySlotAsync(string email, int slotId)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var SlotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();

            var spec = new DoctorDetailsSpecification(email);
            var doctor = await DRepo.GetByIdAsync(spec);
            if (doctor == null)
                throw new DoctorNotFoundException("Doctor not found.");

            var slotspec = new DoctorAvailabilitySlotByIdSpecification(slotId, doctor.Id);
            var slot = await SlotRepo.GetByIdAsync(slotspec);
            if (slot == null)
                throw new SlotNotFoundException(slotId);

            if (slot.Appointment is not null)
                throw new BadRequestException("Booked slot cannot be deleted.");

            SlotRepo.Remove(slot);
            return await _unitOfWork.SaveChangesAsync() > 0 ? new ServiceResponse { Status = true, Message = "Availability slot deleted successfully." }
                                                            : new ServiceResponse { Status = false, Message = "Availability slot was not deleted." };
        }

        public async Task<IEnumerable<DoctorPatientDto>> GetAllPatientsAsync(string Email)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var Prepo = _unitOfWork.GetRepository<Patient>();

            var spec = new DoctorDetailsSpecification(Email);
            var doctor = await DRepo.GetByIdAsync(spec);
            if (doctor == null)
                throw new DoctorNotFoundException("Doctor not found.");


            var Pspec = new PatientsBelongToSpecifcDoctor(doctor.Id);

            var patients = await Prepo.GetAllAsync(Pspec);

            return _mapper.Map<IEnumerable<DoctorPatientDto>>(patients);
        }

        public async Task<MedicalHistoryDetailsDto> AddMedicalHistoryAsync(string Email, int PatientId, AddMedicalHistoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();


            if (dto is null)
                throw new BadRequestException("Medical history data is required.");

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var PRepo = _unitOfWork.GetRepository<Patient>();
            var MRepo = _unitOfWork.GetRepository<MedicalHistory>();

            var DocotrSpec = new DoctorDetailsSpecification(Email);
            var doctor = await DRepo.GetByIdAsync(DocotrSpec);
            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");


            var PatientSpec = new PatientsBelongToSpecifcDoctor(PatientId, doctor.Id);
            var patient = await PRepo.GetByIdAsync(PatientSpec);

            if (patient is null)
                throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");

            //var medicalHistory = new MedicalHistory
            //{
            //    PatientId = PatientId,
            //    CreatedByDoctorId = doctor.Id,
            //    Diagnosis = dto.Diagnosis,
            //    VitalSigns = dto.VitalSigns,
            //    Notes = dto.Notes,
            //    CreatedAt = DateTime.UtcNow,
            //    PreScriptions = dto.PreScriptions?
            //        .Where(p => !string.IsNullOrWhiteSpace(p.MedicationName))
            //        .Select(p => new PreScription
            //        {
            //            MedicationName = p.MedicationName,
            //            Dosage = p.Dosage,
            //            Duration = p.Duration,
            //            Instructions = p.Instructions,
            //            CreatedAt = DateTime.UtcNow
            //        }).ToList() ?? new List<PreScription>()
            //};
            var medicalHistory = _mapper.Map<MedicalHistory>(dto);
            medicalHistory.PatientId = PatientId;
            medicalHistory.CreatedByDoctorId = doctor.Id;

            await MRepo.AddAsync(medicalHistory);

            return await _unitOfWork.SaveChangesAsync() > 0 ? _mapper.Map<MedicalHistoryDetailsDto>(medicalHistory)
                                                            : throw new BadRequestException("Failed to add medical history.");
        }

        public async Task<MedicalHistoryDetailsDto> UpdateMedicalHistoryAsync(string Email, int PatientId, int MedicalHistoryId, UpdateMedicalHistoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            if (dto is null)
                throw new BadRequestException("Medical history data is required.");
            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var PRepo = _unitOfWork.GetRepository<Patient>();
            var MRepo = _unitOfWork.GetRepository<MedicalHistory>();

            var DocotrSpec = new DoctorDetailsSpecification(Email);
            var doctor = await DRepo.GetByIdAsync(DocotrSpec);
            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var PatientSpec = new PatientsBelongToSpecifcDoctor(PatientId, doctor.Id);
            var patient = await PRepo.GetByIdAsync(PatientSpec);

            if (patient is null)
                throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");

            var MedicalHistorySpec = new PatientMedicalHistoriesSpecification(PatientId, MedicalHistoryId);
            var medicalHistory = await MRepo.GetByIdAsync(MedicalHistorySpec);
            if (medicalHistory is null)
                throw new MedicalHistoryNotFoundException(MedicalHistoryId);


            _mapper.Map(dto, medicalHistory);

            MRepo.Update(medicalHistory);

            return await _unitOfWork.SaveChangesAsync() > 0
                ? _mapper.Map<MedicalHistoryDetailsDto>(medicalHistory)
                : throw new BadRequestException("Failed to update medical history.");

        }

        public async Task<MedicalHistoryDetailsDto> UpdatePrescriptionAsync(string Email, int PatientId, int MedicalHistoryId, int PrescriptionId, UpdatePreScriptionDto dto)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            if (dto is null)
                throw new BadRequestException("Prescription data is required.");

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var PRepo = _unitOfWork.GetRepository<Patient>();
            var PRRepo = _unitOfWork.GetRepository<PreScription>();

            var doctor = await DRepo.GetByIdAsync(new DoctorDetailsSpecification(Email));
            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var patient = await PRepo.GetByIdAsync(new PatientsBelongToSpecifcDoctor(PatientId, doctor.Id));
            if (patient is null)
                throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");

            var prescription = await PRRepo.GetByIdAsync(new PrescriptionByIdSpecification(PatientId, MedicalHistoryId, PrescriptionId));
            if (prescription is null)
                throw new PrescriptionNotFoundException(PrescriptionId);

            _mapper.Map(dto, prescription);

            PRRepo.Update(prescription);

            return await _unitOfWork.SaveChangesAsync() > 0
                ? _mapper.Map<MedicalHistoryDetailsDto>(prescription.MedicalHistory)
                : throw new BadRequestException("Failed to update prescription.");
        }

        public async Task<ServiceResponse> DeleteMedicalHistoryAsync(string Email, int PatientId, int MedicalHistoryId)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var PRepo = _unitOfWork.GetRepository<Patient>();
            var MRepo = _unitOfWork.GetRepository<MedicalHistory>();

            var doctor = await DRepo.GetByIdAsync(new DoctorDetailsSpecification(Email));
            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var patient = await PRepo.GetByIdAsync(new PatientsBelongToSpecifcDoctor(PatientId, doctor.Id));
            if (patient is null)
                throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");

            var medicalHistory = await MRepo.GetByIdAsync(new PatientMedicalHistoriesSpecification(PatientId, MedicalHistoryId));
            if (medicalHistory is null)
                throw new MedicalHistoryNotFoundException(MedicalHistoryId);

            MRepo.Remove(medicalHistory);

            return await _unitOfWork.SaveChangesAsync() > 0
                ? new ServiceResponse { Status = true, Message = "Medical history deleted successfully." }
                : new ServiceResponse { Status = false, Message = "Medical history was not deleted." };
        }
        public async Task<ServiceResponse> DeletePreScriptionAsync(string Email, int PatientId, int MedicalHistoryId, int PrescriptionId)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var PRepo = _unitOfWork.GetRepository<Patient>();
            var PRRepo = _unitOfWork.GetRepository<PreScription>();

            var doctor = await DRepo.GetByIdAsync(new DoctorDetailsSpecification(Email));
            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var patient = await PRepo.GetByIdAsync(new PatientsBelongToSpecifcDoctor(PatientId, doctor.Id));
            if (patient is null)
                throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");

            var prescription = await PRRepo.GetByIdAsync(new PrescriptionByIdSpecification(PatientId, MedicalHistoryId, PrescriptionId));
            if (prescription is null)
                throw new PrescriptionNotFoundException(PrescriptionId);

            PRRepo.Remove(prescription);
            return await _unitOfWork.SaveChangesAsync() > 0 ? new ServiceResponse { Status = true, Message = "Prescription deleted successfully." }
                                                            : new ServiceResponse { Status = false, Message = "Prescription was not deleted." };

        }
        public async Task<IEnumerable<MedicalHistoryDetailsDto>> GetPatientMedicalHistoriesAsync(string Email, int PatientId)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();


            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var PRepo = _unitOfWork.GetRepository<Patient>();
            var MRepo = _unitOfWork.GetRepository<MedicalHistory>();

            var DocotrSpec = new DoctorDetailsSpecification(Email);
            var doctor = await DRepo.GetByIdAsync(DocotrSpec);
            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");


            var PatientSpec = new PatientsBelongToSpecifcDoctor(PatientId, doctor.Id);
            var patient = await PRepo.GetByIdAsync(PatientSpec);

            if (patient is null)
                throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");


            var MedicalHistorySpec = new PatientMedicalHistoriesSpecification(PatientId);
            var medicalhistories = await MRepo.GetAllAsync(MedicalHistorySpec);

            return _mapper.Map<IEnumerable<MedicalHistoryDetailsDto>>(medicalhistories);
        }

        public async Task<MedicalHistoryDetailsDto> GetPatientMedicalHistoryByIdAsync(string Email, int PatientId, int MedicalHistoryId)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();


            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var PRepo = _unitOfWork.GetRepository<Patient>();
            var MRepo = _unitOfWork.GetRepository<MedicalHistory>();

            var DocotrSpec = new DoctorDetailsSpecification(Email);
            var doctor = await DRepo.GetByIdAsync(DocotrSpec);
            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");


            var PatientSpec = new PatientsBelongToSpecifcDoctor(PatientId, doctor.Id);
            var patient = await PRepo.GetByIdAsync(PatientSpec);

            if (patient is null)
                throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");


            var MedicalHistorySpec = new PatientMedicalHistoriesSpecification(PatientId, MedicalHistoryId);
            var medicalHistory = await MRepo.GetByIdAsync(MedicalHistorySpec);
            if (medicalHistory is null)
                throw new MedicalHistoryNotFoundException(MedicalHistoryId);
            return _mapper.Map<MedicalHistoryDetailsDto>(medicalHistory);
        }


        public async Task<IEnumerable<MedicalTestListDto>> GetPatientMedicalTestsAsync(string Email, int PatientId)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var PRepo = _unitOfWork.GetRepository<Patient>();
            var MRepo = _unitOfWork.GetRepository<MedicalTest>();

            var doctor = await DRepo.GetByIdAsync(new DoctorDetailsSpecification(Email));
            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var patient = await PRepo.GetByIdAsync(new PatientsBelongToSpecifcDoctor(PatientId, doctor.Id));
            if (patient is null)
                throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");

            var tests = await MRepo.GetAllAsync(new PatientMedicalTestsSpecification(PatientId));

            return _mapper.Map<IEnumerable<MedicalTestListDto>>(tests.OrderByDescending(t => t.UploadedAt));
        }

        public async Task<MedicalTestFileDto> ViewPatientMedicalTestAsync(string Email, int PatientId, int medicalTestId)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var PRepo = _unitOfWork.GetRepository<Patient>();
            var MRepo = _unitOfWork.GetRepository<MedicalTest>();

            var doctor = await DRepo.GetByIdAsync(new DoctorDetailsSpecification(Email));
            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var patient = await PRepo.GetByIdAsync(new PatientsBelongToSpecifcDoctor(PatientId, doctor.Id));
            if (patient is null)
                throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");

            var medicalTest = await MRepo.GetByIdAsync(
                new PatientMedicalTestsSpecification(PatientId, medicalTestId));

            if (medicalTest is null)
                throw new BadRequestException("Medical test not found.");

            var fileResult = await _fileStorageService.DownloadFileAsync(medicalTest.FilePath);
            fileResult.FileName = medicalTest.FileName;

            return fileResult;
        }


        private static bool IsOverlapping(DateTime firstStart,TimeSpan firstDuration,DateTime secondStart,TimeSpan secondDuration)
        {
            var firstEnd = firstStart.Add(firstDuration);
            var secondEnd = secondStart.Add(secondDuration);

            return firstStart < secondEnd && secondStart < firstEnd;
        }
    }
}
