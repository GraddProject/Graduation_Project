using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Data.Migrations
{
    /// <inheritdoc />
    public partial class testConnectionAndAddConfigruations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PreScription_MedicalHistory_MedicalHistoryId",
                table: "PreScription");

            migrationBuilder.DropColumn(
                name: "Specialization",
                table: "Doctor");

            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "Patient",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "Patient",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfPregnancies",
                table: "Patient",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Weight",
                table: "Patient",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_PreScription_MedicalHistory_MedicalHistoryId",
                table: "PreScription",
                column: "MedicalHistoryId",
                principalTable: "MedicalHistory",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PreScription_MedicalHistory_MedicalHistoryId",
                table: "PreScription");

            migrationBuilder.DropColumn(
                name: "Age",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "Height",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "NumberOfPregnancies",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Patient");

            migrationBuilder.AddColumn<string>(
                name: "Specialization",
                table: "Doctor",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_PreScription_MedicalHistory_MedicalHistoryId",
                table: "PreScription",
                column: "MedicalHistoryId",
                principalTable: "MedicalHistory",
                principalColumn: "Id");
        }
    }
}
