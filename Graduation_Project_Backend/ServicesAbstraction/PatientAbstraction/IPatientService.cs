using Shared.DTos.AppointmentDTos;
using Shared.DTos.MedicalHistoryDTos;
using Shared.DTos.MedicalTestDTos;
using Shared.DTos.PatientDTos;
using Shared.DTos.ZoomDTos;
using Shared.ErrorModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction.PatientAbstraction
{
    public interface IPatientService
    {
        Task<ServiceResponse> CompleteProfileAsync(string UserId, CompleteMedicalProfileDto profileDto);


        Task<PatientDashboardProfileDto> GetMyDashboardProfileAsync(string email);



        Task<IEnumerable<AvailabilitySlotDto>> GetAllSlotsAsync(string Email);


        Task<IEnumerable<PatientAppointmentDto>> GetMyAppointmentsAsync(string email, AppointmentStatusDto? status = null);

        Task<ServiceResponse> BookAppointmentAsync(string Email, BookAppointmentDto bookAppointmentDto);

        Task<ServiceResponse> CancelAppointmentAsync(string email, int appointmentId);

        Task<ServiceResponse> AcceptRescheduleAsync(string email, int appointmentId);

        Task<ServiceResponse> RejectRescheduleAsync(string email, int appointmentId);

        //Task<MedicalTestDto> UploadMedicalTestAsync(string userId, UploadMedicalTestDto dto);

        //Task<IEnumerable<MedicalTestDto>> GetMyMedicalTestsAsync(string userId);
        //Task<ServiceResponse> DeleteMedicalTestAsync(string userId, int medicalTestId);

        Task<MedicalTestDto> UploadMedicalTestAsync(string userId, UploadMedicalTestDto dto);

        Task<IEnumerable<MedicalTestListDto>> GetMyMedicalTestsAsync(string userId);
        Task<MedicalTestFileDto> ViewMedicalTestAsync(string userId, int medicalTestId);
        Task<ServiceResponse> DeleteMedicalTestAsync(string userId, int medicalTestId);
        Task<OnlineSessionLinkDto> GetPatientOnlineSessionLinkAsync(string email, int appointmentId);



        Task<IEnumerable<PatientMedicalHistoryMonthGroupDto>> GetMyMedicalHistoriesAsync(string userId, PatientMedicalHistoryQueryParams queryParams);


        Task<IEnumerable<PatientPrescriptionDto>> GetMyPrescriptionsAsync(string userId);

        Task<PatientLastVisitSummaryDto?> GetMyLastVisitSummaryAsync(string email);
    }
}
