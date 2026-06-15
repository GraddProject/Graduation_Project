using AutoMapper;
using DomainLayer.Models;
using Shared.DTos.DashBoardDTos;
using Shared.DTos.IdentityModuleDTo;
using Shared.DTos.PatientDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.MappingProfiles
{
    public class PatientProfile : Profile
    {
        public PatientProfile()
        {
            CreateMap<RegisterPatientDto, Patient>();

            CreateMap<Patient, PatientDto>()
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName))
                .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Doctor.User.DisplayName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Actived, opt => opt.MapFrom(src => src.User.EmailConfirmed))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.User.CreatedAt))
                .IncludeMembers(src => src.MedicalInfo);


            CreateMap<MedicalData, PatientDto>();
            CreateMap<Patient, UserDashBoardDto>()
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(d => d.Role, o => o.MapFrom(src => "Patient"))
                .ForMember(dest => dest.Actived, opt => opt.MapFrom(src => src.User.EmailConfirmed))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.User.CreatedAt));


            CreateMap<CompleteMedicalProfileDto, MedicalData>()
                 .ForMember(dest => dest.Age,
                     opt => opt.Ignore())
                 .ForMember(dest => dest.PregnancyWeek,
                     opt => opt.Ignore())
                 .ForAllMembers(opt => opt.Condition((src, dest, srcMember) =>
                     srcMember is not null &&
                     (srcMember is not string value || !string.IsNullOrWhiteSpace(value))));

            CreateMap<Patient, PatientMedicalDataDto>()
                .ForMember(dest => dest.PatientId, opt => opt.MapFrom(src => src.Id))
                .IncludeMembers(src => src.MedicalInfo);

            CreateMap<MedicalData, PatientMedicalDataDto>();
        }
    }
}
