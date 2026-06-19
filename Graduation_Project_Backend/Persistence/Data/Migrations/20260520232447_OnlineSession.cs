using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Data.Migrations
{
    /// <inheritdoc />
    public partial class OnlineSession : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OnlineMeetingProvider",
                table: "Appointment",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ZoomCreatedAt",
                table: "Appointment",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ZoomJoinUrl",
                table: "Appointment",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ZoomMeetingId",
                table: "Appointment",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ZoomPassword",
                table: "Appointment",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ZoomStartUrl",
                table: "Appointment",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ZoomUpdatedAt",
                table: "Appointment",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OnlineMeetingProvider",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "ZoomCreatedAt",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "ZoomJoinUrl",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "ZoomMeetingId",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "ZoomPassword",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "ZoomStartUrl",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "ZoomUpdatedAt",
                table: "Appointment");
        }
    }
}
