using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Data.Migrations
{
    /// <inheritdoc />
    public partial class generalizeNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Appointment_AppointmentId",
                table: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_Notification_AppointmentId",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "AppointmentId",
                table: "Notification");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppointmentId",
                table: "Notification",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notification_AppointmentId",
                table: "Notification",
                column: "AppointmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Appointment_AppointmentId",
                table: "Notification",
                column: "AppointmentId",
                principalTable: "Appointment",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
