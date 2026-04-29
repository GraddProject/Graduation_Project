using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Data.Migrations
{
    /// <inheritdoc />
    public partial class AvailabilitySlotnullableTORehandleAppointmentReschedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
