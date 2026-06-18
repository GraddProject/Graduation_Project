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

namespace ServicesAbstraction.IAdminAbstraction
{
    public interface IAdminService
    {
        Task<UserDto> RegisterDoctorAsync(RegisterDoctorDto registerDoctorDto);
        Task<UserDto> RegisterPatientAsync(RegisterPatientDto registerPatientDto);
        Task<IEnumerable<DoctorSummaryDto>> GetDoctorListAsync();
        Task<DoctorDto> GetDoctorByIdAsync(int Id);
        Task<bool> UpdateDoctorAsync(int Id, UpdateDoctorDto updateDoctorDto);
        Task<bool> DeleteDoctorAsync (int Id);

        Task<PatientDto> GetPatientById(int Id);
        Task<bool> UpdatePatientAsync(int Id, UpdatePatientDto updatePatientDto);

        Task<bool> DeletePatientAsync (int Id);

        //Task<IEnumerable<UserDashBoardDto>> GetDashboardUsersAsync();

        Task<PaginatedResult<UserDashBoardDto>> GetDashboardWithFiltersAsync(DashBoardQueryParams queryParams);





    }
}
