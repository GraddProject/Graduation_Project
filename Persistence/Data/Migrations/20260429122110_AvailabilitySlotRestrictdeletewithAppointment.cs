using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Data.Migrations
{
    /// <inheritdoc />
    public partial class AvailabilitySlotRestrictdeletewithAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_AvailabilitySlot_AvailabilitySlotId",
                table: "Appointment");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_AvailabilitySlot_AvailabilitySlotId",
                table: "Appointment",
                column: "AvailabilitySlotId",
                principalTable: "AvailabilitySlot",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_AvailabilitySlot_AvailabilitySlotId",
                table: "Appointment");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_AvailabilitySlot_AvailabilitySlotId",
                table: "Appointment",
                column: "AvailabilitySlotId",
                principalTable: "AvailabilitySlot",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
