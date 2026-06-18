using DomainLayer.Contracts;
using DomainLayer.IdentityModule;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Data;
using Persistence.Repositories;

namespace Persistence
{
    public static class InfrastructureServicesRegistraion
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection Services, IConfiguration Configuration)
        {

            Services.AddScoped<IUnitOfWork,UnitOfWork>();
            Services.AddScoped<IDataSeeding, DataSeeding>();



            Services.AddDbContext<StoreIdentityDbContext>(Options =>
            {
                Options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });
            Services.AddDataProtection();
            Services.AddIdentityCore<ApplicationUser>(Opions =>
            {

            })
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<StoreIdentityDbContext>()
                .AddDefaultTokenProviders();
            //Password reset tokens ,  Email confirmation tokens ,  Two - factor tokens



            return Services;

        }
    }
}
