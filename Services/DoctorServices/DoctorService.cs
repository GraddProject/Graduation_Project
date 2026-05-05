using AutoMapper;
using DomainLayer.Contracts;
using DomainLayer.Exceptions;
using DomainLayer.Models;
using Services.Specifications.AppointmentSpecifications;
using Services.Specifications.MedicalHistorySpecification;
using Services.Specifications.MedicalTestSpecifications;
using Services.Specifications.PatientSpecifications;
using Services.Specifications.PredictionSpecifications;
using Services.Specifications.PreScriptionSpecifications;
using ServicesAbstraction.Common;
using ServicesAbstraction.DoctorAbstraction;
using ServicesAbstraction.NotificationAbstraction;
using Shared.DTos.AppointmentDTos;
using Shared.DTos.DoctorDTos;
using Shared.DTos.MedicalHistoryDTos;
using Shared.DTos.MedicalTestDTos;
using Shared.DTos.NotificationDTos;
using Shared.DTos.PaginationDTo;
using Shared.DTos.PaginationDTo.DoctorDashBoardDTos;
using Shared.DTos.PatientDTos;
using Shared.ErrorModels;
using AppointmentType = DomainLayer.Models.AppointmentType;

namespace Services.DoctorServices
{
    public class DoctorService(IUnitOfWork _unitOfWork, IMapper _mapper, IFileStorageService _fileStorageService,
                                INotificationService _notificationService) : IDoctorService
    {

        public async Task<ServiceResponse> AddWeeklyAvailabilitySlotsAsync(string email, AddWeeklyAvailabilitySlotsDto dto)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            if (dto is null)
                throw new BadRequestException("Availability data is required.");

            if (dto.DaysOfWeek is null || !dto.DaysOfWeek.Any())
                throw new BadRequestException("Please select at least one day.");

            if (dto.StartTime >= dto.EndTime)
                throw new BadRequestException("End time must be after start time.");

            if (dto.SessionDurationInMinutes <= 0)
                throw new BadRequestException("Session duration must be greater than zero.");

            if (dto.RepeatForWeeks < 1 || dto.RepeatForWeeks > 4)
                throw new BadRequestException("Repeat weeks must be between 1 and 4.");

            var totalMinutes = (dto.EndTime - dto.StartTime).TotalMinutes;

            if (totalMinutes < dto.SessionDurationInMinutes)
                throw new BadRequestException("Time range must be greater than or equal to session duration.");

            if (totalMinutes % dto.SessionDurationInMinutes != 0)
                throw new BadRequestException("Time range must be divisible by session duration.");

            var domainType = dto.Type switch
            {
                Shared.DTos.AppointmentDTos.AppointmentType.Online
                    => DomainLayer.Models.AppointmentType.Online,

                Shared.DTos.AppointmentDTos.AppointmentType.Offline
                    => DomainLayer.Models.AppointmentType.Offline,

                _ => throw new BadRequestException("Invalid appointment type.")
            };

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var slotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var existingSlots = await slotRepo.GetAllAsync(
                new DoctorAvailabilitySlotsSpecification(doctor.Id));

            var generatedSlots = new List<AvailabilitySlot>();

            var sessionDuration = TimeSpan.FromMinutes(dto.SessionDurationInMinutes);
            var startDate = dto.StartDate.Date;

            var selectedDays = dto.DaysOfWeek
                .Distinct()
                .ToList();

            for (int week = 0; week < dto.RepeatForWeeks; week++)
            {
                foreach (var day in selectedDays)
                {
                    var daysToAdd = ((int)day - (int)startDate.DayOfWeek + 7) % 7;

                    var currentDate = startDate
                        .AddDays(daysToAdd)
                        .AddDays(week * 7);

                    var currentStart = currentDate.Add(dto.StartTime);
                    var dayEnd = currentDate.Add(dto.EndTime);

                    while (currentStart < dayEnd)
                    {
                        var currentEnd = currentStart.Add(sessionDuration);

                        if (currentStart <= DateTime.Now)
                            throw new BadRequestException(
                                $"Generated slot from {currentStart:dd/MM/yyyy hh:mm tt} is in the past.");

                        var hasOverlapWithExisting = existingSlots.Any(slot =>
                            IsOverlapping(currentStart, sessionDuration, slot.StartAt, slot.Duration));

                        var hasOverlapWithGenerated = generatedSlots.Any(slot =>
                            IsOverlapping(currentStart, sessionDuration, slot.StartAt, slot.Duration));

                        if (hasOverlapWithExisting || hasOverlapWithGenerated)
                        {
                            throw new BadRequestException(
                                $"Generated slot from {currentStart:dd/MM/yyyy hh:mm tt} to {currentEnd:hh:mm tt} overlaps with another slot.");
                        }

                        generatedSlots.Add(new AvailabilitySlot
                        {
                            DoctorId = doctor.Id,
                            StartAt = currentStart,
                            Duration = sessionDuration,
                            Type = domainType
                        });

                        currentStart = currentEnd;
                    }
                }
            }

            foreach (var slot in generatedSlots)
                await slotRepo.AddAsync(slot);

            await _unitOfWork.SaveChangesAsync();

            return new ServiceResponse
            {
                Status = true,
                Message = $"{generatedSlots.Count} availability slots added successfully."
            };
        }

        public async Task<ServiceResponse> AddAvailabilitySlotsRangeAsync(string email, AddAvailabilitySlotsRangeDto dto)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            if (dto is null)
                throw new BadRequestException("Availability slots data is required.");

            if (dto.StartAt <= DateTime.Now)
                throw new BadRequestException("Start time must be in the future.");

            if (dto.EndAt <= dto.StartAt)
                throw new BadRequestException("End time must be after start time.");

            if (dto.SessionDurationInMinutes <= 0)
                throw new BadRequestException("Session duration must be greater than zero.");

            var totalMinutes = (dto.EndAt - dto.StartAt).TotalMinutes;

            if (totalMinutes < dto.SessionDurationInMinutes)
                throw new BadRequestException("Time range must be greater than or equal to session duration.");

            if (totalMinutes % dto.SessionDurationInMinutes != 0)
                throw new BadRequestException("Time range must be divisible by session duration.");

            var domainType = dto.Type switch
            {
                Shared.DTos.AppointmentDTos.AppointmentType.Online
                    => DomainLayer.Models.AppointmentType.Online,

                Shared.DTos.AppointmentDTos.AppointmentType.Offline
                    => DomainLayer.Models.AppointmentType.Offline,

                _ => throw new BadRequestException("Invalid appointment type.")
            };

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var slotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var existingSlots = await slotRepo.GetAllAsync(
                new DoctorAvailabilitySlotsSpecification(doctor.Id));

            var generatedSlots = new List<AvailabilitySlot>();

            var currentStart = dto.StartAt;
            var sessionDuration = TimeSpan.FromMinutes(dto.SessionDurationInMinutes);

            while (currentStart < dto.EndAt)
            {
                var currentEnd = currentStart.Add(sessionDuration);

                var hasOverlap = existingSlots.Any(slot =>
                    currentStart < slot.StartAt.Add(slot.Duration) &&
                    currentEnd > slot.StartAt);

                if (hasOverlap)
                {
                    throw new BadRequestException(
                        $"Generated slot from {currentStart:dd/MM/yyyy hh:mm tt} to {currentEnd:hh:mm tt} overlaps with an existing slot.");
                }

                generatedSlots.Add(new AvailabilitySlot
                {
                    DoctorId = doctor.Id,
                    StartAt = currentStart,
                    Duration = sessionDuration,
                    Type = domainType
                });

                currentStart = currentEnd;
            }

            foreach (var slot in generatedSlots)
                await slotRepo.AddAsync(slot);

            await _unitOfWork.SaveChangesAsync();

            return new ServiceResponse
            {
                Status = true,
                Message = $"{generatedSlots.Count} availability slots added successfully."
            };
        }

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





        public async Task<IEnumerable<DoctorAvailabilityOverviewDto>> GetAvailabilityOverviewAsync(string email, AvailabilityOverviewQueryParams? queryParams = null)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            queryParams ??= new AvailabilityOverviewQueryParams();

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var slotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            await CompleteExpiredConfirmedAppointmentsForDoctorAsync(doctor.Id);

            var slots = await slotRepo.GetAllAsync(
                new DoctorAvailabilitySlotsSpecification(doctor.Id));

            var today = DateTime.Now.Date;
            var currentWeekStart = GetStartOfWeek(today);
            var nextWeekStart = currentWeekStart.AddDays(7);

            var filteredSlots = slots.Where(slot =>
            {
                var isBooked = IsBooked(slot);
                var isAvailable = slot.Appointment is null;

                if (queryParams.Status == AvailabilitySlotFilterDto.Booked && !isBooked)
                    return false;

                if (queryParams.Status == AvailabilitySlotFilterDto.Available && !isAvailable)
                    return false;

                if (queryParams.Status == AvailabilitySlotFilterDto.All && !isBooked && !isAvailable)
                    return false;

                if (queryParams.Type.HasValue &&
                    slot.Type.ToString() != queryParams.Type.Value.ToString())
                    return false;

                if (queryParams.DayOfWeek.HasValue &&
                    slot.StartAt.DayOfWeek != queryParams.DayOfWeek.Value)
                    return false;

                if (queryParams.DateFilter == AvailabilityDateFilterDto.CurrentWeek)
                {
                    return slot.StartAt >= currentWeekStart &&
                           slot.StartAt < currentWeekStart.AddDays(7);
                }

                if (queryParams.DateFilter == AvailabilityDateFilterDto.NextWeek)
                {
                    return slot.StartAt >= nextWeekStart &&
                           slot.StartAt < nextWeekStart.AddDays(7);
                }

                return true;
            });

            return filteredSlots
                    .OrderBy(slot => slot.StartAt)
                    .Select(slot =>
            {
                var startAt = slot.StartAt;
                var endAt = slot.StartAt.Add(slot.Duration);
                var isBooked = IsBooked(slot);

                return new DoctorAvailabilityOverviewDto
                {
                    Id = slot.Id,

                    Date = startAt.ToString("yyyy-MM-dd"),
                    DateLabel = startAt.ToString("ddd, MMM dd"),
                    Time = $"{startAt:hh:mm tt} - {endAt:hh:mm tt}",
                    Duration = $"{(int)slot.Duration.TotalMinutes} min",

                    VisitType = slot.Type.ToString(),
                    BookingStatus = isBooked ? "Booked" : "Available",

                    AppointmentStatus = isBooked
                        ? slot.Appointment!.Status.ToString()
                        : null
                };
            });
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
            await CompleteExpiredConfirmedAppointmentsForDoctorAsync(doctor.Id);
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
            var appointments = await appointmentRepo.GetAllAsync(new DashBoardDoctorAppointmentsSpecification(doctor.Id, domainStatus));

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

        //public async Task<ServiceResponse> ConfirmAppointmentAsync(string email, int appointmentId)
        //{
        //    if (string.IsNullOrWhiteSpace(email))
        //        throw new UnauthorizedException();

        //    var doctorRepo = _unitOfWork.GetRepository<Doctor>();
        //    var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

        //    var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

        //    if (doctor is null)
        //        throw new DoctorNotFoundException("Doctor not found.");

        //    var appointment = await appointmentRepo.GetByIdAsync(
        //        new DoctorAppointmentByIdSpecification(doctor.Id, appointmentId));

        //    if (appointment is null)
        //        throw new BadRequestException("Appointment not found or does not belong to this doctor.");

        //    if (appointment.Status != AppointmentStatus.Pending)
        //        throw new BadRequestException("Only pending appointments can be confirmed.");

        //    if (appointment.AvailabilitySlot.StartAt <= DateTime.Now)
        //        throw new BadRequestException("Cannot confirm an appointment in the past.");

        //    appointment.Status = AppointmentStatus.Confirmed;

        //    appointmentRepo.Update(appointment);

        //    await _unitOfWork.SaveChangesAsync();

        //    await _notificationService.CreateAndSendAsync(
        //        appointment.Patient.UserId,
        //        "Appointment Confirmed",
        //        $"Your appointment at {appointment.AvailabilitySlot.StartAt:dd/MM/yyyy hh:mm tt} has been confirmed.",
        //        NotificationTypeDto.AppointmentConfirmed,
        //        appointment.Id);

        //    return new ServiceResponse
        //    {
        //        Status = true,
        //        Message = "Appointment confirmed successfully."
        //    };
        //}

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


        public async Task<ServiceResponse> RequestRescheduleAppointmentAsync(string email, int appointmentId, RescheduleAppointmentDto dto)
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

            if (appointment.Status != AppointmentStatus.Confirmed)
                throw new BadRequestException(new List<string> { "Only confirmed appointments can be rescheduled." });

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
            currentSlot.Type = domainType;

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



        public async Task<DoctorAppointmentSummaryDto> GetDoctorAppointmentsSummaryAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var doctor = await doctorRepo.GetByIdAsync(new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");
            await CompleteExpiredConfirmedAppointmentsForDoctorAsync(doctor.Id);
            var now = DateTime.Now;
            var monthStart = new DateTime(now.Year, now.Month, 1);
            var nextMonthStart = monthStart.AddMonths(1);
            var next7Days = now.AddDays(7);

            var appointments = await appointmentRepo.GetAllAsync(new DoctorAppointmentsSummarySpecification(doctor.Id));

            var appointmentsList = appointments.ToList();

            return new DoctorAppointmentSummaryDto
            {
                TotalAppointments = appointmentsList.Count(a =>
                    a.AvailabilitySlot is not null &&
                    a.AvailabilitySlot.StartAt >= monthStart &&
                    a.AvailabilitySlot.StartAt < nextMonthStart &&
                    a.Status != AppointmentStatus.Canceled),

                Upcoming = appointmentsList.Count(a =>
                    a.AvailabilitySlot is not null &&
                    a.AvailabilitySlot.StartAt >= now &&
                    a.AvailabilitySlot.StartAt <= next7Days &&
                    a.Status == AppointmentStatus.Confirmed),

                Completed = appointmentsList.Count(a =>
                    a.AvailabilitySlot is not null &&
                    a.AvailabilitySlot.StartAt >= monthStart &&
                    a.AvailabilitySlot.StartAt < nextMonthStart &&
                    a.Status == AppointmentStatus.Completed),

                //Pending = appointmentsList.Count(a =>
                //    a.Status == AppointmentStatus.Pending),

                ReschedulePending = appointmentsList.Count(a =>
                    a.Status == AppointmentStatus.ReschedulePending)
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



        public async Task<ServiceResponse> DeleteAvailabilitySlotsAsync(string email, DeleteAvailabilitySlotsDto dto)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new UnauthorizedException();

            if (dto is null || dto.SlotIds is null || !dto.SlotIds.Any())
                throw new BadRequestException("Please select at least one slot.");

            var slotIds = dto.SlotIds
                .Distinct()
                .ToList();

            var doctorRepo = _unitOfWork.GetRepository<Doctor>();
            var slotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();

            var doctor = await doctorRepo.GetByIdAsync(
                new DoctorDetailsSpecification(email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var slots = await slotRepo.GetAllAsync(
                new DoctorAvailabilitySlotsByIdsSpecification(doctor.Id, slotIds));

            var slotsList = slots.ToList();

            if (slotsList.Count != slotIds.Count)
                throw new BadRequestException("Invalid selected slots.");

            if (slotsList.Any(s => s.Appointment is not null))
                throw new BadRequestException("Booked slots cannot be deleted.");

            foreach (var slot in slotsList)
            {
                slotRepo.Remove(slot);
            }

            var result = await _unitOfWork.SaveChangesAsync();

            return result > 0
                ? new ServiceResponse
                {
                    Status = true,
                    Message = $"{slotsList.Count} availability slot(s) deleted successfully."
                }
                : new ServiceResponse
                {
                    Status = false,
                    Message = "No availability slots were deleted."
                };
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

        public async Task<PaginatedResult<DoctorPatientCardDto>> GetAllPatientsAsync(string Email, DoctorPatientsQueryParams queryParams)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            queryParams ??= new DoctorPatientsQueryParams();

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var PRepo = _unitOfWork.GetRepository<Patient>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();
            var predictionRepo = _unitOfWork.GetRepository<PredictionRecord>();

            var spec = new DoctorDetailsSpecification(Email);
            var doctor = await DRepo.GetByIdAsync(spec);

            if (doctor == null)
                throw new DoctorNotFoundException("Doctor not found.");

            await CompleteExpiredConfirmedAppointmentsForDoctorAsync(doctor.Id);

            var patients = await PRepo.GetAllAsync(
                new DoctorPatientsCardsSpecification(doctor.Id));

            var appointments = await appointmentRepo.GetAllAsync(
                new DoctorPatientCardsAppointmentsSpecification(doctor.Id));

            var predictions = await predictionRepo.GetAllAsync(
                new DoctorPatientCardsPredictionsSpecification(doctor.Id));

            var now = DateTime.Now;

            var Data = patients.Select(p =>
            {
                var patientAppointments = appointments
                    .Where(a => a.PatientId == p.Id && a.AvailabilitySlot is not null)
                    .ToList();

                var lastAppointment = patientAppointments
                    .Where(a => a.Status == AppointmentStatus.Completed)
                    .OrderByDescending(a => a.AvailabilitySlot.StartAt)
                    .FirstOrDefault();

                var nextAppointment = patientAppointments
                    .Where(a =>
                        a.AvailabilitySlot.StartAt >= now &&
                        (
                            a.Status == AppointmentStatus.Confirmed ||
                            a.Status == AppointmentStatus.ReschedulePending
                        ))
                    .OrderBy(a => a.AvailabilitySlot.StartAt)
                    .FirstOrDefault();

                var latestPrediction = predictions
                    .Where(pr => pr.PatientId == p.Id)
                    .OrderByDescending(pr => pr.CreatedAt)
                    .FirstOrDefault();

                var pregnancyWeek = p.MedicalInfo?.PregnancyWeek;

                return new DoctorPatientCardDto
                {
                    PatientId = p.Id,
                    DisplayName = p.User.DisplayName,
                    Email = p.User.Email ?? string.Empty,

                    PregnancyWeek = pregnancyWeek,
                    Trimester = GetTrimester(pregnancyWeek),

                    RiskLevel = GetRiskLevel(latestPrediction?.Confidence) ?? "Not Predicted",

                    LastAppointmentAt = lastAppointment?.AvailabilitySlot.StartAt,
                    NextAppointmentAt = nextAppointment?.AvailabilitySlot.StartAt,

                    CreatedAt = p.User.CreatedAt
                };
            });

            if (!string.IsNullOrEmpty(queryParams.search))
            {
                var search = queryParams.search.Trim().ToLower();

                Data = Data.Where(p =>
                    p.PatientId.ToString().Contains(search) ||
                    p.DisplayName.ToLower().Contains(search) ||
                    p.Email.ToLower().Contains(search));
            }

            Data = queryParams.sort switch
            {
                DoctorPatientsSortingOptions.RiskLevel =>
                    Data.OrderByDescending(p => GetRiskOrder(p.RiskLevel))
                        .ThenBy(p => p.NextAppointmentAt ?? DateTime.MaxValue),


                DoctorPatientsSortingOptions.Trimester =>
                    Data.OrderBy(p => GetTrimesterOrder(p.PregnancyWeek))
                      .ThenBy(p => p.PregnancyWeek ?? int.MaxValue)
                      .ThenBy(p => p.NextAppointmentAt ?? DateTime.MaxValue),


                DoctorPatientsSortingOptions.Oldest =>
                    Data.OrderBy(p => p.CreatedAt),

                DoctorPatientsSortingOptions.NextAppointmentAsc =>
                    Data.OrderBy(p => p.NextAppointmentAt ?? DateTime.MaxValue),

                _ =>
                    Data.OrderByDescending(p => p.CreatedAt)
            };

            var totalCount = Data.Count();

            var pagedData = Data
                .Skip((queryParams.pageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToList();

            return new PaginatedResult<DoctorPatientCardDto>(
                queryParams.pageNumber,
                queryParams.PageSize,
                totalCount,
                pagedData
            );
        }



        public async Task<DoctorPatientDto> GetPatientByIdAsync(string Email, int patientId)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var Prepo = _unitOfWork.GetRepository<Patient>();

            var spec = new DoctorDetailsSpecification(Email);
            var doctor = await DRepo.GetByIdAsync(spec);
            if (doctor == null)
                throw new DoctorNotFoundException("Doctor not found.");

            var Pspec = new PatientsBelongToSpecifcDoctor(patientId, doctor.Id);
            var patient = await Prepo.GetByIdAsync(Pspec);

            if (patient is null)
                throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");

            var patientDto = _mapper.Map<DoctorPatientDto>(patient);
            patientDto.Trimester = GetTrimester(patientDto.PregnancyWeek);

            return patientDto;
        }





        //public async Task<MedicalHistoryDetailsDto> AddMedicalHistoryAsync(string Email, int PatientId, AddMedicalHistoryDto dto)
        //{
        //    if (string.IsNullOrWhiteSpace(Email))
        //        throw new UnauthorizedException();


        //    if (dto is null)
        //        throw new BadRequestException("Medical history data is required.");

        //    var DRepo = _unitOfWork.GetRepository<Doctor>();
        //    var PRepo = _unitOfWork.GetRepository<Patient>();
        //    var MRepo = _unitOfWork.GetRepository<MedicalHistory>();

        //    var DocotrSpec = new DoctorDetailsSpecification(Email);
        //    var doctor = await DRepo.GetByIdAsync(DocotrSpec);
        //    if (doctor is null)
        //        throw new DoctorNotFoundException("Doctor not found.");


        //    var PatientSpec = new PatientsBelongToSpecifcDoctor(PatientId, doctor.Id);
        //    var patient = await PRepo.GetByIdAsync(PatientSpec);

        //    if (patient is null)
        //        throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");

        //    //var medicalHistory = new MedicalHistory
        //    //{
        //    //    PatientId = PatientId,
        //    //    CreatedByDoctorId = doctor.Id,
        //    //    Diagnosis = dto.Diagnosis,
        //    //    VitalSigns = dto.VitalSigns,
        //    //    Notes = dto.Notes,
        //    //    CreatedAt = DateTime.UtcNow,
        //    //    PreScriptions = dto.PreScriptions?
        //    //        .Where(p => !string.IsNullOrWhiteSpace(p.MedicationName))
        //    //        .Select(p => new PreScription
        //    //        {
        //    //            MedicationName = p.MedicationName,
        //    //            Dosage = p.Dosage,
        //    //            Duration = p.Duration,
        //    //            Instructions = p.Instructions,
        //    //            CreatedAt = DateTime.UtcNow
        //    //        }).ToList() ?? new List<PreScription>()
        //    //};
        //    var medicalHistory = _mapper.Map<MedicalHistory>(dto);
        //    medicalHistory.PatientId = PatientId;
        //    medicalHistory.CreatedByDoctorId = doctor.Id;

        //    await MRepo.AddAsync(medicalHistory);

        //    return await _unitOfWork.SaveChangesAsync() > 0 ? _mapper.Map<MedicalHistoryDetailsDto>(medicalHistory)
        //                                                    : throw new BadRequestException("Failed to add medical history.");
        //}



        public async Task<MedicalHistoryDetailsDto> AddMedicalHistoryAsync(string Email, int PatientId, AddMedicalHistoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            if (dto is null)
                throw new BadRequestException("Medical history data is required.");

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var PRepo = _unitOfWork.GetRepository<Patient>();
            var MRepo = _unitOfWork.GetRepository<MedicalHistory>();
            var predictionRepo = _unitOfWork.GetRepository<PredictionRecord>();

            var DocotrSpec = new DoctorDetailsSpecification(Email);
            var doctor = await DRepo.GetByIdAsync(DocotrSpec);

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            var PatientSpec = new PatientsBelongToSpecifcDoctor(PatientId, doctor.Id);
            var patient = await PRepo.GetByIdAsync(PatientSpec);

            if (patient is null)
                throw PatientNotFoundException.Belong("Patient not found or does not belong to this doctor.");

            int? predictionRecordId = null;

            if (dto.PredictionRecordId.HasValue)
            {
                if (dto.PredictionRecordId.Value <= 0)
                    throw new BadRequestException("Prediction record id is invalid.");

                var prediction = await predictionRepo.GetByIdAsync(
                    new PredictionRecordForMedicalHistorySpecification(
                        dto.PredictionRecordId.Value,
                        doctor.Id,
                        patient.Id));

                if (prediction is null)
                    throw new BadRequestException("Prediction record not found or does not belong to this patient.");

                if (prediction.MedicalHistory is not null)
                    throw new BadRequestException("This prediction already has a medical history.");

                predictionRecordId = prediction.Id;
            }

            var medicalHistory = _mapper.Map<MedicalHistory>(dto);

            medicalHistory.PatientId = PatientId;
            medicalHistory.CreatedByDoctorId = doctor.Id;
            medicalHistory.PredictionRecordId = predictionRecordId;

            await MRepo.AddAsync(medicalHistory);

            return await _unitOfWork.SaveChangesAsync() > 0
                ? _mapper.Map<MedicalHistoryDetailsDto>(medicalHistory)
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



        public async Task<DoctorDashboardOverviewDto> GetDoctorDashboardOverviewAsync(string Email)
        {
            if (string.IsNullOrWhiteSpace(Email))
                throw new UnauthorizedException();

            var DRepo = _unitOfWork.GetRepository<Doctor>();
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();
            var SlotRepo = _unitOfWork.GetRepository<AvailabilitySlot>();

            var doctor = await DRepo.GetByIdAsync(new DoctorDetailsSpecification(Email));

            if (doctor is null)
                throw new DoctorNotFoundException("Doctor not found.");

            await CompleteExpiredConfirmedAppointmentsForDoctorAsync(doctor.Id);

            var now = DateTime.Now;
            var monthStart = new DateTime(now.Year, now.Month, 1);
            var nextMonthStart = monthStart.AddMonths(1);

            var appointments = await appointmentRepo.GetAllAsync(
                new DoctorAppointmentsSummarySpecification(doctor.Id));

            var monthlyAppointments = appointments
                .Where(a =>
                    a.AvailabilitySlot is not null &&
                    a.AvailabilitySlot.StartAt >= monthStart &&
                    a.AvailabilitySlot.StartAt < nextMonthStart)
                .ToList();

            var confirmedCount = monthlyAppointments.Count(a =>
                a.Status == AppointmentStatus.Confirmed ||
                a.Status == AppointmentStatus.ReschedulePending);

            var completedCount = monthlyAppointments.Count(a =>
                a.Status == AppointmentStatus.Completed);

            var canceledCount = monthlyAppointments.Count(a =>
                a.Status == AppointmentStatus.Canceled);

            var totalAppointments = confirmedCount + completedCount + canceledCount;

            var slots = await SlotRepo.GetAllAsync(new DoctorAvailabilitySlotsSpecification(doctor.Id));

            var slotsList = slots
                .Where(s =>
                    s.StartAt >= monthStart &&
                    s.StartAt < nextMonthStart)
                .ToList();

            var bookedSlots = slotsList
                .Where(s =>
                    s.Appointment is not null &&
                    (
                        s.Appointment.Status == AppointmentStatus.Confirmed ||
                        s.Appointment.Status == AppointmentStatus.ReschedulePending
                    ))
                .ToList();

            var availableSlots = slotsList
                .Where(s => s.Appointment is null)
                .ToList();

            var totalSlots = bookedSlots.Count + availableSlots.Count;
            return new DoctorDashboardOverviewDto
            {
                AppointmentOverview = new DoctorAppointmentOverviewDto
                {
                    Confirmed = new DoctorDashboardStatusDto
                    {
                        Count = confirmedCount,
                        Percentage = CalculatePercentage(confirmedCount, totalAppointments)
                    },

                    Completed = new DoctorDashboardStatusDto
                    {
                        Count = completedCount,
                        Percentage = CalculatePercentage(completedCount, totalAppointments)
                    },

                    Canceled = new DoctorDashboardStatusDto
                    {
                        Count = canceledCount,
                        Percentage = CalculatePercentage(canceledCount, totalAppointments)
                    }
                },

                Availability = new DoctorAvailabilityDashboardDto
                {
                    BookedPercentage = CalculatePercentage(bookedSlots.Count, totalSlots),

                    BookedSlots = bookedSlots.Count,
                    AvailableSlots = availableSlots.Count,

                    OnlineBookedSlots = bookedSlots.Count(s => s.Type == AppointmentType.Online),
                    OfflineBookedSlots = bookedSlots.Count(s => s.Type == AppointmentType.Offline)
                }
            };
        }




        private static bool IsOverlapping(DateTime firstStart, TimeSpan firstDuration, DateTime secondStart, TimeSpan secondDuration)
        {
            var firstEnd = firstStart.Add(firstDuration);
            var secondEnd = secondStart.Add(secondDuration);

            return firstStart < secondEnd && secondStart < firstEnd;
        }



        private async Task CompleteExpiredConfirmedAppointmentsForDoctorAsync(int doctorId)
        {
            var appointmentRepo = _unitOfWork.GetRepository<Appointment>();

            var appointments = await appointmentRepo.GetAllAsync(
                new DoctorConfirmedAppointmentsSpecification(doctorId));

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

        private static int CalculatePercentage(int value, int total)
        {
            if (total == 0)
                return 0;

            return (int)Math.Round((value * 100.0) / total);
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


        private static string? GetRiskLevel(decimal? confidence)
        {
            if (confidence == null)
                return null;

            if (confidence >= 75)
                return "High Risk";

            if (confidence >= 50)
                return "Medium Risk";

            return "Low Risk";
        }

        private static int GetRiskOrder(string? riskLevel)
        {
            if (string.IsNullOrWhiteSpace(riskLevel))
                return 0;

            var risk = riskLevel.Trim().ToLower();

            if (risk.Contains("high"))
                return 3;

            if (risk.Contains("medium"))
                return 2;

            if (risk.Contains("low"))
                return 1;

            return 0;
        }

        private static bool IsBooked(AvailabilitySlot slot)
        {
            return slot.Appointment is not null &&
                   (
                       slot.Appointment.Status == AppointmentStatus.Confirmed ||
                       slot.Appointment.Status == AppointmentStatus.ReschedulePending
                   );
        }
        private static DateTime GetStartOfWeek(DateTime date)
        {
            var weekStartsOn = DayOfWeek.Saturday;

            var diff = (7 + (date.DayOfWeek - weekStartsOn)) % 7;

            return date.Date.AddDays(-diff);
        }

        private static int GetTrimesterOrder(int? pregnancyWeek)
        {
            if (!pregnancyWeek.HasValue || pregnancyWeek.Value <= 0)
                return 4;

            if (pregnancyWeek.Value <= 13)
                return 1;

            if (pregnancyWeek.Value <= 27)
                return 2;

            if (pregnancyWeek.Value <= 42)
                return 3;

            return 4;
        }
    }
}
