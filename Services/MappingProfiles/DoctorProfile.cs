using AutoMapper;
using DomainLayer.Models;
using Shared.DTos.AppointmentDTos;
using Shared.DTos.DashBoardDTos;
using Shared.DTos.DoctorDTos;
using Shared.DTos.IdentityModuleDTo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.MappingProfiles
{
    public class DoctorProfile : Profile
    {
        public DoctorProfile()
        {
            CreateMap<RegisterDoctorDto, Doctor>();

            CreateMap<Doctor, DoctorDto>()
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Actived, opt => opt.MapFrom(src => src.User.EmailConfirmed))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.User.CreatedAt))
                .ForMember(dest => dest.PatientsCount, opt => opt.MapFrom(src => src.Patients != null ? src.Patients.Count : 0));


            CreateMap<Doctor, DoctorSummaryDto>()
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName));



            CreateMap<Doctor, UserDashBoardDto>()
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(d => d.Role, o => o.MapFrom(src => "Doctor"))
                .ForMember(dest => dest.Actived, opt => opt.MapFrom(src => src.User.EmailConfirmed))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.User.CreatedAt));


            CreateMap<Patient, DoctorPatientDto>()
            .ForMember(d => d.PatientId, o => o.MapFrom(s => s.Id))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.Email, o => o.MapFrom(s => s.User.Email))
            .ForMember(d => d.PhoneNumber, o => o.MapFrom(s => s.User.PhoneNumber))
            .ForMember(d => d.CreatedAt, o => o.MapFrom(s => s.User.CreatedAt))
            .ForMember(d => d.Actived, o => o.MapFrom(s => s.User.EmailConfirmed))
            
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.MedicalInfo != null ? src.MedicalInfo.Age : null))
            .ForMember(dest => dest.BloodType, opt => opt.MapFrom(src => src.MedicalInfo != null ? src.MedicalInfo.BloodType : null))
            .ForMember(dest => dest.Height, opt => opt.MapFrom(src => src.MedicalInfo != null ? src.MedicalInfo.Height : null))
            .ForMember(dest => dest.Weight, opt => opt.MapFrom(src => src.MedicalInfo != null ? src.MedicalInfo.Weight : null))
            .ForMember(dest => dest.PregnancyStartDate, opt => opt.MapFrom(src => src.MedicalInfo != null ? src.MedicalInfo.PregnancyStartDate : null))
            .ForMember(dest => dest.PregnancyWeek, opt => opt.MapFrom(src => src.MedicalInfo != null ? src.MedicalInfo.PregnancyWeek : null));




            CreateMap<AddAvailabilitySlotDto, AvailabilitySlot>()
                .ForMember(dest => dest.Duration,
                    opt => opt.MapFrom(src => TimeSpan.FromMinutes(src.DurationInMinutes)))
                .ForMember(dest => dest.Type,
                    opt => opt.MapFrom(src => (DomainLayer.Models.AppointmentType)src.Type));



            CreateMap<AvailabilitySlot, AvailabilitySlotDto>()
                .ForMember(dest => dest.DurationInMinutes,
                    opt => opt.MapFrom(src => (int)src.Duration.TotalMinutes))
                .ForMember(dest => dest.Type,
                    opt => opt.MapFrom(src => (Shared.DTos.AppointmentDTos.AppointmentType)src.Type))
                .ForMember(dest => dest.IsBooked,
                    opt => opt.MapFrom(src => src.Appointment != null));


            CreateMap<CompleteDoctorProfileDto, Doctor>()
                .ForMember(dest => dest.Location, opt =>
                {
                    opt.PreCondition(src => !string.IsNullOrWhiteSpace(src.Location));
                    opt.MapFrom(src => src.Location!.Trim());
                })
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) =>
                    srcMember is not null &&
                    (srcMember is not string value || !string.IsNullOrWhiteSpace(value))));

        }
    }
}
