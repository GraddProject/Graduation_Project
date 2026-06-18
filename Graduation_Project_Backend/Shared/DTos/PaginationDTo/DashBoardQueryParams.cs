using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Shared.DTos.PaginationDTo
{
    //Search by name
    //role
    //date
    //sort
    //Page number
    //Page size
    public class DashBoardQueryParams
    {
        private const int DefaultPageSize = 5;
        private const int MaxPageSize = 10;
        public BoardSortingOptions sort { get; set; }

        public string? search { get; set; }
        public string? Role { get; set; }

        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }


        public int pageNumber { get; set; } = 1;

        private int pageSize = DefaultPageSize;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = value > MaxPageSize ? MaxPageSize : value; }
        }
    }
}

