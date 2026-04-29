using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Services.AdminServices;
using Services.AuthServices;
using Services.Common;
using Services.DoctorServices;
using Services.ModelServices;
using Services.NotificationServices;
using Services.PatientServices;
using ServicesAbstraction;
using ServicesAbstraction.AuthServices;
using ServicesAbstraction.Common;
using ServicesAbstraction.DoctorAbstraction;
using ServicesAbstraction.IAdminAbstraction;
using ServicesAbstraction.ModelAbstraction;
using ServicesAbstraction.NotificationAbstraction;
using ServicesAbstraction.PatientAbstraction;
using Shared.DTos.MlDTos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public static class ApplicationServicesRegisteration
    {
        public static IServiceCollection ApplicationServices(this IServiceCollection Services)
        {

            Services.AddScoped<IServiceManger, ServiceManger>();


            Services.AddScoped<IAccountService, AccountService>();
            Services.AddScoped<Func<IAccountService>>(Provider =>
            () => Provider.GetRequiredService<IAccountService>());


            Services.AddScoped<IDoctorService, DoctorService>();
            Services.AddScoped<Func<IDoctorService>>(Provider =>
            () => Provider.GetRequiredService<IDoctorService>());

            Services.AddScoped<IAdminService, AdminService>();
            Services.AddScoped<Func<IAdminService>>(Provider =>
            () => Provider.GetRequiredService<IAdminService>());

            Services.AddScoped<IPatientService, PatientService>();
            Services.AddScoped<Func<IPatientService>>(Provider =>
            () => Provider.GetRequiredService<IPatientService>());

            Services.AddScoped<INotificationService, NotificationService>();
            Services.AddScoped<Func<INotificationService>>(Provider =>
            () => Provider.GetRequiredService<INotificationService>());


            Services.AddScoped<IFileStorageService, GoogleCloudStorageService>();


            Services.AddHttpClient<IModelPredictionService, ModelPredictionService>((sp, client) =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                var baseUrl = configuration["ModelApi:BaseUrl"];

                client.BaseAddress = new Uri(baseUrl!);
                client.Timeout = TimeSpan.FromSeconds(30);
            });

            Services.AddScoped<Func<IModelPredictionService>>(Provider =>
            () => Provider.GetRequiredService<IModelPredictionService>());


            Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            return Services;
        }
    }
}
