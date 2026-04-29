using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicesAbstraction;
using ServicesAbstraction.DoctorAbstraction;
using ServicesAbstraction.ModelAbstraction;
using Shared.DTos.AppointmentDTos;
using Shared.DTos.DoctorDTos;
using Shared.DTos.MedicalHistoryDTos;
using Shared.DTos.MedicalTestDTos;
using Shared.DTos.MlDTos;
using Shared.ErrorModels;
using System.Security.Claims;

namespace Presentation.Controllers
{
    [Authorize(Roles = "Doctor")]
    public class DoctorController(IServiceManger _serviceManger) : ApiBaseController
    {
        [HttpPost("predict")]
        public async Task<ActionResult<PredictionResponseDto>> Predict([FromBody] PredictionRequestDto request)
        {
            var result = await _serviceManger.ModelPredictionService.PredictAsync(request);
            return Ok(result);
        }



        [HttpGet("GetAllPatients")]
        public async Task<ActionResult<IEnumerable<DoctorPatientDto>>> GetMyPatients()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);


            var result = await _serviceManger.DoctorService.GetAllPatientsAsync(email);

            return Ok(result);
        }
        [HttpPost("AddMedicalHistory")]
        public async Task<ActionResult<MedicalHistoryDetailsDto>> AddMedicalHistory(int patientId, AddMedicalHistoryDto dto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);


            var result = await _serviceManger.DoctorService.AddMedicalHistoryAsync(email, patientId, dto);

            return Ok(result);
        }


        [HttpPut("UpdateMedicalHistory")]
        public async Task<ActionResult<MedicalHistoryDetailsDto>> UpdateMedicalHistory(int PatientId, int MedicalHistoryId, UpdateMedicalHistoryDto updateMedicaldto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var result = await _serviceManger.DoctorService.UpdateMedicalHistoryAsync(email, PatientId, MedicalHistoryId, updateMedicaldto);
            return Ok(result);
        }

        [HttpPut("UpdatePreScription")]
        public async Task<ActionResult<MedicalHistoryDetailsDto>> UpdatePreScription(int PatientId, int MedicalHistoryId, int PreScriptionId, UpdatePreScriptionDto updatePreScriptionDto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var result = await _serviceManger.DoctorService.UpdatePrescriptionAsync(email, PatientId, MedicalHistoryId, PreScriptionId, updatePreScriptionDto);
            return Ok(result);
        }

        [HttpDelete("patients/{patientId}/medical-histories/{medicalHistoryId}")]
        public async Task<ActionResult<ServiceResponse>> DeleteMedicalHistory(int patientId, int medicalHistoryId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var result = await _serviceManger.DoctorService.DeleteMedicalHistoryAsync(email!, patientId, medicalHistoryId);
            return Ok(result);
        }


        [HttpDelete("patients/{patientId}/medical-histories/{medicalHistoryId}/prescriptions/{prescriptionId}")]
        public async Task<ActionResult<ServiceResponse>> DeletePrescription(int patientId,int medicalHistoryId,int prescriptionId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var result = await _serviceManger.DoctorService.DeletePreScriptionAsync(email!, patientId, medicalHistoryId, prescriptionId);
            return Ok(result);
        }

        [HttpGet("GetPatientMedicalHistories")]
        public async Task<ActionResult<IEnumerable<MedicalHistoryDetailsDto>>> GetPatientMedicalHistories(int patientId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);


            var result = await _serviceManger.DoctorService.GetPatientMedicalHistoriesAsync(email!, patientId);

            return Ok(result);
        }

        [HttpGet("GetMedicalHistoryById")]
        public async Task<ActionResult<MedicalHistoryDetailsDto>> GetPatientMedicalHistoryById(int patientId, int medicalHistoryId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var result = await _serviceManger.DoctorService.GetPatientMedicalHistoryByIdAsync(email, patientId, medicalHistoryId);
            return Ok(result);
        }

        [HttpPost("AddAvailabilitySlot")]
        public async Task<ActionResult<bool>> AddAvailabilitySlot(AddAvailabilitySlotDto dto)
        {
            var Email = User.FindFirstValue(ClaimTypes.Email);

       
            var result = await _serviceManger.DoctorService.AddAvailabilitySlotAsync(Email, dto);

            return Ok(result);
        }

        [HttpGet("GetAllAvailbleSlots")]
        public async Task<ActionResult<IEnumerable<AvailabilitySlotDto>>> GetAllAvailbleSlots()
        {
            var Email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.DoctorService.GetMyAvailabilitySlotsAsync(Email!);
            return Ok(result);
        }


        [HttpGet("GetAppointments")]
        public async Task<ActionResult<IEnumerable<DoctorAppointmentDto>>> GetDoctorAppointments([FromQuery] AppointmentStatusDto? status)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.DoctorService.GetDoctorAppointmentsAsync(email!, status);

            return Ok(result);
        }


        [HttpPut("ConfirmAppointment")]
        public async Task<ActionResult<ServiceResponse>> ConfirmAppointment(int appointmentId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.DoctorService.ConfirmAppointmentAsync(email!, appointmentId);

            return Ok(result);
        }


        [HttpPut("CancelAppointment")]
        public async Task<ActionResult<ServiceResponse>> CancelAppointment(int appointmentId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.DoctorService.CancelAppointmentAsync(email!, appointmentId);

            return Ok(result);
        }


        [HttpPut("appointments/{appointmentId}/reschedule")]
        public async Task<ActionResult<ServiceResponse>> RequestReschedule(
    int appointmentId,
    [FromBody] RescheduleAppointmentDto dto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.DoctorService
                .RequestRescheduleAppointmentAsync(email!, appointmentId, dto);

            return Ok(result);
        }


        [HttpPut("UpdateAvailabilitySlot")]
        public async Task<ActionResult<ServiceResponse>> UpdateAvailabilitySlot(int SlotId, UpdateAvailabilitySlotDto updateAvailabilitySlot)
        {
            var Email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.DoctorService.UpdateAvailabilitySlotAsync(Email!, SlotId, updateAvailabilitySlot);
            return Ok(result);
        }

        [HttpDelete("DeleteAvailabilitySlot")]
        public async Task<ActionResult<ServiceResponse>> DeleteAvailabilitySlot(int SlotId)
        {
            var Email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.DoctorService.DeleteAvailabilitySlotAsync(Email!, SlotId);
            return Ok(result);
        }


        [HttpGet("GetPatientMedicalTests")]
        public async Task<ActionResult<IEnumerable<MedicalTestListDto>>> GetPatientMedicalTests(int patientId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var result = await _serviceManger.DoctorService.GetPatientMedicalTestsAsync(email!, patientId);
            return Ok(result);
        }

        [HttpGet("ViewPatientMedicalTest")]
        public async Task<IActionResult> ViewPatientMedicalTest(int patientId, int medicalTestId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var result = await _serviceManger.DoctorService.ViewPatientMedicalTestAsync(email!, patientId, medicalTestId);

            Response.Headers["Content-Disposition"] = $"inline; filename=\"{result.FileName}\"";
            return File(result.Content, result.ContentType, enableRangeProcessing: true);
        }

        [HttpGet("DownloadPatientMedicalTest")]
        public async Task<IActionResult> DownloadPatientMedicalTest(int patientId, int medicalTestId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var result = await _serviceManger.DoctorService.ViewPatientMedicalTestAsync(email!, patientId, medicalTestId);

            return File(result.Content, result.ContentType, result.FileName);
        }
    }
}
