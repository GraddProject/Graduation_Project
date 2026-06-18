using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldsToMedicalData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Gravida",
                table: "Patient",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HadGestationalDiabetesBefore",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HadLargeChildOrBirthDefault",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HadPreviousPreeclampsia",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HadUnexplainedPrenatalLoss",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasChronicHypertension",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasChronicKidneyDisease",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasFamilyHistoryOfDiabetes",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasFamilyHistoryOfPreeclampsia",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasPCOS",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasPrediabetes",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasPregestationalDiabetes",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasSedentaryLifestyle",
                table: "Patient",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Parity",
                table: "Patient",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BMI",
                table: "Patient",
                type: "decimal(18,2)",
                nullable: true,
                computedColumnSql: "CASE WHEN [Height] IS NULL OR [Weight] IS NULL OR [Height] <= 0 THEN NULL ELSE ROUND((CAST([Weight] AS decimal(18,2)) * 10000.0) / ([Height] * [Height]), 2) END",
                stored: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BMI",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "Gravida",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HadGestationalDiabetesBefore",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HadLargeChildOrBirthDefault",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HadPreviousPreeclampsia",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HadUnexplainedPrenatalLoss",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HasChronicHypertension",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HasChronicKidneyDisease",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HasFamilyHistoryOfDiabetes",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HasFamilyHistoryOfPreeclampsia",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HasPCOS",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HasPrediabetes",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HasPregestationalDiabetes",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "HasSedentaryLifestyle",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "Parity",
                table: "Patient");
        }
    }
}
