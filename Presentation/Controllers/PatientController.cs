using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServicesAbstraction;
using Shared.DTos.AppointmentDTos;
using Shared.DTos.MedicalTestDTos;
using Shared.DTos.PatientDTos;
using Shared.DTos.ZoomDTos;
using Shared.ErrorModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [Authorize(Roles = "Patient")]
    public class PatientController(IServiceManger _serviceManger) : ApiBaseController
    {

        //[HttpGet("debug-time")]
        //public IActionResult DebugTime()
        //{
        //    return Ok(new
        //    {
        //        ServerNow = DateTime.Now,
        //        ServerUtcNow = DateTime.UtcNow,
        //        LocalTimeZone = TimeZoneInfo.Local.Id,
        //        LocalOffset = TimeZoneInfo.Local.GetUtcOffset(DateTime.Now).ToString()
        //    });
        //}
        [HttpGet("Profile")]
        public async Task<ActionResult<PatientDashboardProfileDto>> GetMyDashboardProfile()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.PatientService.GetMyDashboardProfileAsync(email!);

            return Ok(result);
        }




        [HttpPut("CompleteMedicalProfile")]
        public async Task<ActionResult<bool>> CompleteProfile(CompleteMedicalProfileDto completeMedicalProfileDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var result = await _serviceManger.PatientService.CompleteProfileAsync(userId, completeMedicalProfileDto);
            return Ok(result);
        }


        [HttpGet("GetAllAvailbleSlots")]
        public async Task<ActionResult<IEnumerable<AvailabilitySlotDto>>> GetAllAvailbleSlots()
        {
            var Email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.PatientService.GetAllSlotsAsync(Email!);
            return Ok(result);
        }


        [HttpGet("GetMyAppointments")]
        public async Task<ActionResult<IEnumerable<PatientAppointmentDto>>> GetMyAppointments([FromQuery] AppointmentStatusDto? status)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.PatientService
                .GetMyAppointmentsAsync(email!, status);

            return Ok(result);
        }


        [HttpPost("BookAppointment")]
        public async Task<ActionResult<ServiceResponse>> BookAppointment(BookAppointmentDto dto)
        {
            var Email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.PatientService.BookAppointmentAsync(Email!,dto);

            return Ok(result);
        }


        [HttpDelete("CancelAppointment")]
        public async Task<ActionResult<ServiceResponse>> CancelAppointment(int appointmentId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.PatientService.CancelAppointmentAsync(email!, appointmentId);

            return Ok(result);
        }



        [HttpPut("AcceptReschedule")]
        public async Task<ActionResult<ServiceResponse>> AcceptReschedule(int appointmentId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.PatientService
                .AcceptRescheduleAsync(email!, appointmentId);

            return Ok(result);
        }

        [HttpPut("RejectReschedule")]
        public async Task<ActionResult<ServiceResponse>> RejectReschedule(int appointmentId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.PatientService
                .RejectRescheduleAsync(email!, appointmentId);

            return Ok(result);
        }


        [HttpPost("UploadMedicalTest")]
        public async Task<ActionResult<MedicalTestDto>> UploadMedicalTest([FromForm] UploadMedicalTestDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _serviceManger.PatientService.UploadMedicalTestAsync(userId, dto);
            return Ok(result);
        }

        [HttpGet("GetMyMedicalTests")]
        public async Task<ActionResult<IEnumerable<MedicalTestListDto>>> GetMyMedicalTests()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _serviceManger.PatientService.GetMyMedicalTestsAsync(userId);
            return Ok(result);
        }

        [HttpGet("ViewMedicalTest/{medicalTestId}")]
        public async Task<IActionResult> ViewMedicalTest(int medicalTestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _serviceManger.PatientService.ViewMedicalTestAsync(userId, medicalTestId);

            Response.Headers["Content-Disposition"] = $"inline; filename=\"{result.FileName}\"";
            return File(result.Content, result.ContentType, enableRangeProcessing: true);
        }


        [HttpGet("DownloadMedicalTest/{medicalTestId}")]
        public async Task<IActionResult> DownloadMedicalTest(int medicalTestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _serviceManger.PatientService.ViewMedicalTestAsync(userId, medicalTestId);

            return File(result.Content, result.ContentType, result.FileName);
        }

        [HttpDelete("DeleteMedicalTest")]
        public async Task<ActionResult<ServiceResponse>> DeleteMedicalTest(int medicalTestId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _serviceManger.PatientService.DeleteMedicalTestAsync(userId, medicalTestId);
            return Ok(result);
        }


        [HttpGet("appointments/{appointmentId:int}/online-session")]
        public async Task<ActionResult<OnlineSessionLinkDto>> GetOnlineSessionLink(int appointmentId)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);

            var result = await _serviceManger.PatientService
                .GetPatientOnlineSessionLinkAsync(email!, appointmentId);

            return Ok(result);
        }

        //#region
        //[HttpGet("GetMyMedicalTests")]
        //public async Task<ActionResult<IEnumerable<MedicalTestDto>>> GetMyMedicalTests()
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    if (string.IsNullOrEmpty(userId))
        //        return Unauthorized();

        //    var result = await _serviceManger.PatientService.GetMyMedicalTestsAsync(userId);
        //    return Ok(result);
        //}

        //[HttpDelete("DeleteMedicalTest")]
        //public async Task<ActionResult<ServiceResponse>> DeleteMedicalTest(int medicalTestId)
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    if (string.IsNullOrEmpty(userId))
        //        return Unauthorized();

        //    var result = await _serviceManger.PatientService.DeleteMedicalTestAsync(userId, medicalTestId);
        //    return Ok(result);
        //}
        //#endregion
    }
}
