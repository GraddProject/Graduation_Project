using ServicesAbstraction.AuthServices;
using ServicesAbstraction.DoctorAbstraction;
using ServicesAbstraction.IAdminAbstraction;
using ServicesAbstraction.ModelAbstraction;
using ServicesAbstraction.NotificationAbstraction;
using ServicesAbstraction.PatientAbstraction;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServicesAbstraction
{
    public interface IServiceManger
    {
        IAccountService AccountService { get; }
        IDoctorService DoctorService { get; }
        IAdminService AdminService { get; }
        IPatientService PatientService { get; }
        IModelPredictionService ModelPredictionService { get; }
        INotificationService NotificationService { get; }
    }
}
