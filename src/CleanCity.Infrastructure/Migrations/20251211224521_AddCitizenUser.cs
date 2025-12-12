using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanCity.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCitizenUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "GeoLocations",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 11, 23, 45, 20, 947, DateTimeKind.Local).AddTicks(9776));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FirstName", "IsActive", "LastName", "PasswordHash", "Role" },
                values: new object[] { 2, new DateTime(2025, 12, 11, 22, 45, 20, 947, DateTimeKind.Utc).AddTicks(9841), "citizen@test.com", "John", true, "TheCitizen", "TempPasswordHash", 2 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DropColumn(
                name: "Country",
                table: "GeoLocations");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 12, 10, 23, 41, 35, 5, DateTimeKind.Local).AddTicks(9420));
        }
    }
}
