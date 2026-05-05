using Shared.DTos.AppointmentDTos;
using Shared.DTos.DashBoardDTos;
using Shared.DTos.DoctorDTos;
using Shared.DTos.MedicalHistoryDTos;
using Shared.DTos.MedicalTestDTos;
using Shared.DTos.PaginationDTo;
using Shared.DTos.PaginationDTo.DoctorDashBoardDTos;
using Shared.ErrorModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction.DoctorAbstraction
{
    public interface IDoctorService
    {
        public Task<IEnumerable<DoctorPatientDto>> GetAllPatientsAsync(string Email);

        Task<DoctorPatientDto> GetPatientByIdAsync(string Email,int patientId);

        public Task<IEnumerable<MedicalHistoryDetailsDto>> GetPatientMedicalHistoriesAsync(string Email, int PatientId);
        public Task<MedicalHistoryDetailsDto> GetPatientMedicalHistoryByIdAsync(string Email, int PatientId, int MedicalHistoryId);
        public Task<MedicalHistoryDetailsDto> AddMedicalHistoryAsync(string Email, int PatientId, AddMedicalHistoryDto addMedicaldto);

        public Task<MedicalHistoryDetailsDto> UpdateMedicalHistoryAsync(string Email, int PatientId, int MedicalHistoryId, UpdateMedicalHistoryDto updateMedicaldto);
        public Task<MedicalHistoryDetailsDto> UpdatePrescriptionAsync(string email, int patientId, int medicalHistoryId, int prescriptionId, UpdatePreScriptionDto dto);

        public Task<ServiceResponse> DeleteMedicalHistoryAsync(string Email, int PatientId, int MedicalHistoryId);
        public Task<ServiceResponse> DeletePreScriptionAsync(string Email, int PatientId, int medicalHistoryId, int prescriptionId);


        Task<ServiceResponse> AddWeeklyAvailabilitySlotsAsync(string email,AddWeeklyAvailabilitySlotsDto dto);

        Task<ServiceResponse> AddAvailabilitySlotsRangeAsync(string email,AddAvailabilitySlotsRangeDto dto);
        public Task<bool> AddAvailabilitySlotAsync(string Email, AddAvailabilitySlotDto addAvailabilitySlot);

        Task<IEnumerable<DoctorAvailabilityOverviewDto>> GetAvailabilityOverviewAsync(string email, AvailabilityOverviewQueryParams? queryParams = null);
        //Task<IEnumerable<DoctorAvailabilityOverviewDto>> GetAvailabilityOverviewAsync(string email,AvailabilitySlotFilterDto filter = AvailabilitySlotFilterDto.All);
      
        public Task<IEnumerable<AvailabilitySlotDto>> GetMyAvailabilitySlotsAsync(string Email);

        Task<IEnumerable<DoctorAppointmentDto>> GetDoctorAppointmentsAsync(string Email, AppointmentStatusDto? status = null);

        //Task<ServiceResponse> ConfirmAppointmentAsync(string email, int appointmentId);

        Task<ServiceResponse> CancelAppointmentAsync(string email, int appointmentId);


        Task<ServiceResponse> RequestRescheduleAppointmentAsync(string email,int appointmentId,RescheduleAppointmentDto dto);


        Task<DoctorAppointmentSummaryDto> GetDoctorAppointmentsSummaryAsync(string email);

        public Task<ServiceResponse> UpdateAvailabilitySlotAsync(string Email, int SlotId, UpdateAvailabilitySlotDto updateAvailabilitySlot);



        Task<ServiceResponse> DeleteAvailabilitySlotsAsync(string email, DeleteAvailabilitySlotsDto dto);
        public Task<ServiceResponse> DeleteAvailabilitySlotAsync(string email, int slotId);



        Task<IEnumerable<MedicalTestListDto>> GetPatientMedicalTestsAsync(string Email, int PatientId);
        Task<MedicalTestFileDto> ViewPatientMedicalTestAsync(string Email, int PatientId, int medicalTestId);




        Task<PaginatedResult<DoctorPatientCardDto>> GetAllPatientsAsync(string Email, DoctorPatientsQueryParams queryParams);

        Task<DoctorDashboardOverviewDto> GetDoctorDashboardOverviewAsync(string Email);

    }
}
