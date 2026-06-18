using AutoMapper;
using DomainLayer.Models;
using Shared.DTos.MedicalHistoryDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.MappingProfiles
{
    public class MedicalHistoryProfile : Profile
    {
        public MedicalHistoryProfile()
        {

            CreateMap<MedicalHistory, MedicalHistoryDetailsDto>();
            CreateMap<UpdateMedicalHistoryDto, MedicalHistory>()
                     .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));



            CreateMap<AddMedicalHistoryDto, MedicalHistory>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.PreScriptions, opt => opt.MapFrom(src =>
                    src.PreScriptions == null
                        ? new List<AddPreScriptionDto>()
                        : src.PreScriptions.Where(p => !string.IsNullOrWhiteSpace(p.MedicationName))));
        }
    }
}
