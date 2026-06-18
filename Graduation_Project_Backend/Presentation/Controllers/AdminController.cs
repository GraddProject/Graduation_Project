using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServicesAbstraction;
using Shared.DTos.DashBoardDTos;
using Shared.DTos.DoctorDTos;
using Shared.DTos.IdentityModuleDTo;
using Shared.DTos.PaginationDTo;
using Shared.DTos.PatientDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Presentation.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController(IServiceManger _serviceManger) : ApiBaseController
    {
        [HttpPost("RegisterDoctor")]
        public async Task<ActionResult<UserDto>> RegisterDoctor(RegisterDoctorDto dto)
        {
            var result = await _serviceManger.AdminService.RegisterDoctorAsync(dto);
            return Ok(result);
        }

        [HttpPost("RegisterPatient")]
        public async Task<ActionResult<UserDto>> RegisterPatient(RegisterPatientDto dto)
        {
            var result = await _serviceManger.AdminService.RegisterPatientAsync(dto);

            return Ok(result);
        }

        [HttpGet("DoctorsList")]
        public async Task<ActionResult<IEnumerable<DoctorSummaryDto>>> GetDoctorList()
        {
            var result = await _serviceManger.AdminService.GetDoctorListAsync();
            return Ok(result);
        }

        [HttpGet("DoctorById/{Id}")]
        public async Task<ActionResult<DoctorDto>> GetDoctorById(int Id)
        {
            var result = await _serviceManger.AdminService.GetDoctorByIdAsync(Id);
            return Ok(result);
        }

        [HttpPut("UpdateDoctor/{Id}")]
        public async Task<ActionResult<bool>> UpdateDoctor(int Id, UpdateDoctorDto dto)
        {
            var result = await _serviceManger.AdminService.UpdateDoctorAsync(Id, dto);
            return Ok(result);
        }
        [HttpDelete("DeleteDoctor/{Id}")]
        public async Task<ActionResult<bool>> DeleteDoctor(int Id)
        {
            var result = await _serviceManger.AdminService.DeleteDoctorAsync(Id);

            return Ok(result);
        }

        [HttpGet("PatientById/{Id}")]
        public async Task<ActionResult<PatientDto>> GetPatientById(int Id)
        {
            var result = await _serviceManger.AdminService.GetPatientById(Id);
            return Ok(result);
        }

        [HttpPut("UpdatePatient/{Id}")]
        public async Task<ActionResult<bool>> UpdatePatient(int Id, UpdatePatientDto dto)
        {
            var result = await _serviceManger.AdminService.UpdatePatientAsync(Id, dto);
            return Ok(result);
        }

        [HttpDelete("DeletePatient/{Id}")]
        public async Task<ActionResult<bool>> DeletePatient(int Id)
        {
            var result = await _serviceManger.AdminService.DeletePatientAsync(Id);

            return Ok(result);
        }

        //[HttpGet("DashBoard")]
        //public async Task<ActionResult<IEnumerable<UserDashBoardDto>>> GetDashboardUsers()
        //{
        //    var result = await _serviceManger.AdminService.GetDashboardUsersAsync();
        //    return Ok(result);
        //}
        
        [HttpGet("DashBoard")]
        public async Task<ActionResult<IEnumerable<UserDashBoardDto>>> GetDashboardPaginationUsers([FromQuery] DashBoardQueryParams dto)
        {
            var result = await _serviceManger.AdminService.GetDashboardWithFiltersAsync(dto);
            return Ok(result);
        }
    }
}
