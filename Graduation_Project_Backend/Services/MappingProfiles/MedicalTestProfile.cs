using AutoMapper;
using DomainLayer.Models;
using Shared.DTos.MedicalTestDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.MappingProfiles
{
    public class MedicalTestProfile : Profile
    {
        public MedicalTestProfile()
        {
            CreateMap<MedicalTest, MedicalTestDto>();
            CreateMap<MedicalTest, MedicalTestListDto>();
        }
    }
}
