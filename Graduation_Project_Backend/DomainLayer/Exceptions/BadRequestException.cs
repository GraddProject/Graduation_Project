using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DomainLayer.Exceptions
{
    public sealed class BadRequestException : Exception
    {
        public List<string> Errors { get; }

        public BadRequestException(List<string> errors) : base("Validation Failed")
        {
            Errors = errors;
        }

        public BadRequestException(string error) : base("Validation Failed")
        {
            Errors = new List<string> { error };
        }
    }
}
