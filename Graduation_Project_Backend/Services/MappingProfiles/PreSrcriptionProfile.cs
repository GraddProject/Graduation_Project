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
    public class PreSrcriptionProfile : Profile
    {
        public PreSrcriptionProfile()
        {
            CreateMap<PreScription, PreScriptionDto>();


            CreateMap<UpdatePreScriptionDto, PreScription>()
                     .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));


            CreateMap<AddPreScriptionDto, PreScription>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));
        }

    }
}
