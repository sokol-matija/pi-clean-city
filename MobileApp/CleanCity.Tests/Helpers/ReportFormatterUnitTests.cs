using System;
using CleanCity.Core.Helpers;
using CleanCity.Core.Models;

namespace CleanCity.Tests.Helpers
{
    public class ReportFormatterUnitTests
    {
        [Fact]
        public void FormatReportForDisplay_ShouldReturnFormattedString_ForValidReport()
        {
            // Arrange
            var report = new Report
            {
                Title = "Test Title",
                Status = ReportStatus.Zaprimljeno,
                CreatedDate = new DateTime(2024, 5, 20),
                Location = "Test Location",
                Description = "Test Description"
            };

            // Act
            var result = ReportFormatter.FormatReportForDisplay(report);

            // Assert
            Assert.Contains("===== PRIJAVA: Test Title =====", result);
            Assert.Contains("Status: Zaprimljeno", result);
            Assert.Contains("Datum: 20.05.2024", result);
            Assert.Contains("Lokacija: Test Location", result);
            Assert.Contains("Test Description", result);
        }

        [Fact]
        public void FormatReportForDisplay_ShouldReturnPlaceholder_ForNullReport()
        {
            // Arrange
            Report report = null;

            // Act
            var result = ReportFormatter.FormatReportForDisplay(report);

            // Assert
            Assert.Equal("Prijava ne postoji.", result);
        }
    }
}
