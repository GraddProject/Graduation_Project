using DomainLayer.Models;
using Shared.DTos.PaginationDTo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Specifications.PatientSpecifications
{
    class PatientDetailsSpecification : BaseSpecifications<Patient>
    {
        public PatientDetailsSpecification() : base()
        {
            AddInclude(P => P.User);
        }
        
        public PatientDetailsSpecification(string email) : base(p=>p.User.Email ==email)
        {
            AddInclude(P => P.User);
        }


        public PatientDetailsSpecification(DashBoardQueryParams queryParams) : base()
        {
            AddInclude(P => P.User);

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
        public PatientDetailsSpecification(int id):base(P=>P.Id==id)
        {
            AddInclude(P => P.Doctor);
            AddInclude(P => P.Doctor.User);
            AddInclude(P => P.User);
            AddInclude(P => P.Appointments);
        }
    }
}
