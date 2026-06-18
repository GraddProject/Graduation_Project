
using DomainLayer.Contracts;
using Her_Journey.Extensions;
using Her_Journey.Hubs;
using Her_Journey.SignalR;
using Persistence;
using Services;
using Services.AuthServices;
using Services.DoctorServices;
using ServicesAbstraction.AuthServices;
using ServicesAbstraction.DoctorAbstraction;
using ServicesAbstraction.NotificationAbstraction;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Her_Journey
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);



            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });


            builder.Services.AddInfrastructureServices(builder.Configuration);

            builder.Services.AddControllers()
                            .AddJsonOptions(options =>
                            {
                                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

            builder.Services.AddSwagerServices();
            builder.Services.AddJWTService(builder.Configuration);


            builder.Services.ApplicationServices();


            builder.Services.AddWebApplicationServices();


            builder.Services.AddSignalR();

            builder.Services.AddScoped<INotificationSender, SignalRNotificationSender>();

            var app = builder.Build();

            //await app.SeedDataBaseAsync();

            app.UseCustomExceptionMiddleWare();

            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
                app.UseSwaggerMiddleWares();
            //}

            app.UseHttpsRedirection();
            app.UseCors("AllowAll");
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapHub<NotificationHub>("/hubs/notifications");
            app.MapControllers();

            app.Run();
        }
    }
}
