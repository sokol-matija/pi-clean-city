using CleanCity.Core.Models;
using CleanCity.Core.Services;
using System.Threading.Tasks;
using Xunit;
using System.Linq;

namespace CleanCity.Tests.Services
{
    public class ReportServiceIntegrationTests
    {
        private readonly ReportService _service;

        public ReportServiceIntegrationTests()
        {
            // In a real integration test, you might set up a test database here.
            // For this project, we instantiate the service which uses the singleton factory.
            _service = new ReportService(MockReportFactory.Instance);
        }

        [Fact]
        public async Task GetReportsAsync_ShouldReturnAllReports_SortedByDateDescending()
        {
            // Act
            var reports = await _service.GetReportsAsync();

            // Assert
            Assert.NotNull(reports);
            Assert.True(reports.Any());
            // Check sorting - the first report should be newer than the second
            Assert.True(reports[0].CreatedDate > reports[1].CreatedDate);
        }

        [Fact]
        public async Task GetReportByIdAsync_ShouldReturnReport_WhenIdExists()
        {
            // Arrange
            var existingId = 1;

            // Act
            var report = await _service.GetReportByIdAsync(existingId);

            // Assert
            Assert.NotNull(report);
            Assert.Equal(existingId, report.Id);
        }

        [Fact]
        public async Task GetReportByIdAsync_ShouldReturnNull_WhenIdDoesNotExist()
        {
            // Arrange
            var nonExistentId = 999;

            // Act
            var report = await _service.GetReportByIdAsync(nonExistentId);

            // Assert
            Assert.Null(report);
        }

        [Fact]
        public async Task AddReportAsync_ShouldIncreaseReportCount()
        {
            // Arrange
            // Note: This test is not perfectly isolated as it modifies the shared singleton instance.
            var service = new ReportService(MockReportFactory.Instance); // Create a fresh instance for count check
            var initialCount = (await service.GetReportsAsync()).Count;
            var newReport = new Report { Title = "New Test Report", Description = "Desc" };

            // Act
            var result = await service.AddReportAsync(newReport);
            var finalCount = (await service.GetReportsAsync()).Count;

            // Assert
            Assert.True(result);
            Assert.Equal(initialCount + 1, finalCount);
        }

        [Fact]
        public async Task UpdateReportAsync_ShouldChangeReportTitle()
        {
            // Arrange
            var reportToUpdate = await _service.GetReportByIdAsync(1);
            Assert.NotNull(reportToUpdate);
            var newTitle = "UPDATED TITLE";
            reportToUpdate.Title = newTitle;

            // Act
            var result = await _service.UpdateReportAsync(reportToUpdate);
            var updatedReport = await _service.GetReportByIdAsync(1);

            // Assert
            Assert.True(result);
            Assert.NotNull(updatedReport);
            Assert.Equal(newTitle, updatedReport.Title);
        }
        
        [Fact]
        public async Task UpdateReportAsync_ShouldReturnFalse_ForNonExistentReport()
        {
            // Arrange
            var nonExistentReport = new Report { Id = 999, Title = "Ghost" };

            // Act
            var result = await _service.UpdateReportAsync(nonExistentReport);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task DeleteReportAsync_ShouldDecreaseReportCount()
        {
            // Arrange
            // Note: This test is not perfectly isolated as it modifies the shared singleton instance.
            var service = new ReportService(MockReportFactory.Instance); // Create a fresh instance for count check
            var initialCount = (await service.GetReportsAsync()).Count;
            var idToDelete = 2; // Use an ID that other tests don't rely on as much

            // Act
            var result = await service.DeleteReportAsync(idToDelete);
            var finalCount = (await service.GetReportsAsync()).Count;
            var deletedReport = await service.GetReportByIdAsync(idToDelete);

            // Assert
            Assert.True(result);
            Assert.Equal(initialCount - 1, finalCount);
            Assert.Null(deletedReport);
        }
        
        [Fact]
        public async Task DeleteReportAsync_ShouldReturnFalse_ForNonExistentReport()
        {
            // Arrange
            var nonExistentId = 999;
            
            // Act
            var result = await _service.DeleteReportAsync(nonExistentId);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void FormatReportForDisplay_ShouldFormatReport()
        {
            // Arrange
            var report = new Report { Title = "Format Test" };

            // Act
            var result = _service.FormatReportForDisplay(report);

            // Assert
            Assert.Contains("Format Test", result);
        }
    }
}
