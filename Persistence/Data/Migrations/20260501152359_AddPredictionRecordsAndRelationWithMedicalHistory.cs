using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddPredictionRecordsAndRelationWithMedicalHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PredictionRecordId",
                table: "MedicalHistory",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PredictionRecord",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    DoctorId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Result = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Confidence = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    InputJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RawResponseJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PredictionRecord", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PredictionRecord_Doctor_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctor",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PredictionRecord_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicalHistory_PredictionRecordId",
                table: "MedicalHistory",
                column: "PredictionRecordId",
                unique: true,
                filter: "[PredictionRecordId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PredictionRecord_DoctorId",
                table: "PredictionRecord",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_PredictionRecord_PatientId",
                table: "PredictionRecord",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicalHistory_PredictionRecord_PredictionRecordId",
                table: "MedicalHistory",
                column: "PredictionRecordId",
                principalTable: "PredictionRecord",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicalHistory_PredictionRecord_PredictionRecordId",
                table: "MedicalHistory");

            migrationBuilder.DropTable(
                name: "PredictionRecord");

            migrationBuilder.DropIndex(
                name: "IX_MedicalHistory_PredictionRecordId",
                table: "MedicalHistory");

            migrationBuilder.DropColumn(
                name: "PredictionRecordId",
                table: "MedicalHistory");
        }
    }
}
