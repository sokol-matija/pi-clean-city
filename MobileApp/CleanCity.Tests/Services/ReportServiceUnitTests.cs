using CleanCity.Core.Models;
using CleanCity.Core.Services;
using CleanCity.Core.Services.Interfaces;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace CleanCity.Tests.Services
{
    public class ReportServiceUnitTests
    {
        private readonly Mock<IReportFactory> _mockReportFactory;
        private readonly ReportService _service;
        private readonly List<Report> _sampleReports;

        public ReportServiceUnitTests()
        {
            _mockReportFactory = new Mock<IReportFactory>();
            _sampleReports = new List<Report>
            {
                new Report { Id = 1, CreatedDate = new System.DateTime(2024, 1, 10) },
                new Report { Id = 2, CreatedDate = new System.DateTime(2024, 1, 20) }
            };

            // Setup the mock factory to return a fresh list for each test context
            _mockReportFactory.Setup(f => f.CreateReports())
                             .Returns(() => new List<Report>(_sampleReports));

            _service = new ReportService(_mockReportFactory.Object);
        }

        [Fact]
        public async Task GetReportsAsync_ShouldReturnReportsSortedByDateDescending()
        {
            // Act
            var result = await _service.GetReportsAsync();

            // Assert
            // The factory was called during the service's construction
            _mockReportFactory.Verify(f => f.CreateReports(), Times.Once);
            Assert.Equal(2, result.Count);
            // Verify descending order
            Assert.Equal(2, result[0].Id);
            Assert.Equal(1, result[1].Id);
        }

        [Fact]
        public async Task AddReportAsync_ShouldAddReportToTheList()
        {
            // Arrange
            var newReport = new Report { Title = "New" };

            // Act
            await _service.AddReportAsync(newReport);
            var reports = await _service.GetReportsAsync();
            var addedReport = reports.FirstOrDefault(r => r.Title == "New");

            // Assert
            Assert.Equal(3, reports.Count);
            Assert.NotNull(addedReport);
            Assert.NotEqual(0, addedReport.Id); // ID should be assigned
        }
    }
}
