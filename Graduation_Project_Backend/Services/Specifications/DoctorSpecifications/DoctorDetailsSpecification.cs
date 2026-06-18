using DomainLayer.Models;
using Shared.DTos.PaginationDTo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PatientSpecifications
{
    class DoctorDetailsSpecification : BaseSpecifications<Doctor>
    {
        public DoctorDetailsSpecification() : base()
        {
            AddInclude(d => d.User);
        }
        public DoctorDetailsSpecification(string email) : base(D => D.User.Email == email)
        {
            AddInclude(d => d.User);
        }

        public DoctorDetailsSpecification(DashBoardQueryParams queryParams) : base()
        {
            AddInclude(d => d.User);

            switch (queryParams.sort)
            {
                case BoardSortingOptions.DateAsc:
                    AddOrderBy(P => P.User.CreatedAt);
                    break;
                case BoardSortingOptions.DateDesc:
                    AddOrderByDescending(P => P.User.CreatedAt);
                    break;
            }
            ApplyPagination(queryParams.PageSize, queryParams.pageNumber);
        }

        public DoctorDetailsSpecification(int id) : base(D => D.Id == id)
        {
            AddInclude(d => d.User);
            AddInclude(d => d.Patients);
            AddInclude(d => d.Appointments);
        }
    }
}
