using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Data.Migrations
{
    /// <inheritdoc />
    public partial class EditOnPatientDesign : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "PregnancyStartDate",
                table: "Patient",
                type: "date",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "PregnancyWeek",
                table: "Patient",
                type: "int",
                nullable: true,
                computedColumnSql: "(DATEDIFF(DAY, [PregnancyStartDate], GETDATE()) / 7) + 1",
                stored: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Age",
                table: "Patient",
                type: "int",
                nullable: true,
                computedColumnSql: "DATEDIFF(YEAR, [DateOfBirth], GETDATE()) - CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, [DateOfBirth], GETDATE()), [DateOfBirth]) > GETDATE() THEN 1 ELSE 0 END",
                stored: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PregnancyStartDate",
                table: "Patient");

            migrationBuilder.AlterColumn<int>(
                name: "PregnancyWeek",
                table: "Patient",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true,
                oldComputedColumnSql: "(DATEDIFF(DAY, [PregnancyStartDate], GETDATE()) / 7) + 1");

            migrationBuilder.AlterColumn<int>(
                name: "Age",
                table: "Patient",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true,
                oldComputedColumnSql: "DATEDIFF(YEAR, [DateOfBirth], GETDATE()) - CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, [DateOfBirth], GETDATE()), [DateOfBirth]) > GETDATE() THEN 1 ELSE 0 END");
        }
    }
}
