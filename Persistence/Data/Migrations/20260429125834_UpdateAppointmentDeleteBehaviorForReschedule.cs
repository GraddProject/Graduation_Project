using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAppointmentDeleteBehaviorForReschedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Appointment_AppointmentId",
                table: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_Appointment_AvailabilitySlotId",
                table: "Appointment");

            migrationBuilder.AlterColumn<int>(
                name: "AvailabilitySlotId",
                table: "Appointment",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_AvailabilitySlotId",
                table: "Appointment",
                column: "AvailabilitySlotId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Appointment_AppointmentId",
                table: "Notification",
                column: "AppointmentId",
                principalTable: "Appointment",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notification_Appointment_AppointmentId",
                table: "Notification");

            migrationBuilder.DropIndex(
                name: "IX_Appointment_AvailabilitySlotId",
                table: "Appointment");

            migrationBuilder.AlterColumn<int>(
                name: "AvailabilitySlotId",
                table: "Appointment",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_AvailabilitySlotId",
                table: "Appointment",
                column: "AvailabilitySlotId",
                unique: true,
                filter: "[AvailabilitySlotId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_Appointment_AppointmentId",
                table: "Notification",
                column: "AppointmentId",
                principalTable: "Appointment",
                principalColumn: "Id");
        }
    }
}
