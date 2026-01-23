using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using CleanCity.Core.Interfaces.Services;
using CleanCity.Core.Models;
using CleanCity.Core.ViewModels;
using Moq;

namespace CleanCity.Tests.ViewModels
{
    public class DashboardViewModelUnitTests
    {
        private readonly Mock<IReportService> _mockReportService;
        private readonly DashboardViewModel _viewModel;

        public DashboardViewModelUnitTests()
        {
            _mockReportService = new Mock<IReportService>();
            _viewModel = new DashboardViewModel(_mockReportService.Object);
        }

        [Fact]
        public void Constructor_InitializesPropertiesAndCommandsCorrectly()
        {
            // Assert
            Assert.NotNull(_viewModel.LoadReportsCommand);
            Assert.NotNull(_viewModel.ApplyFilterCommand);
            Assert.NotNull(_viewModel.ToggleSortCommand);
            Assert.False(_viewModel.IsLoading);
            Assert.Null(_viewModel.SelectedFilter);
            Assert.False(_viewModel.IsAscending);
            Assert.Empty(_viewModel.Reports);
            Assert.Empty(_viewModel.AllReports);
        }

        [Fact]
        public async Task LoadReportsAsync_ShouldLoadAndSortReports_WhenServiceCallSucceeds()
        {
            // Arrange
            var sampleReports = new List<Report>
            {
                new Report { Id = 1, Title = "Report 1", Status = ReportStatus.Zaprimljeno, CreatedDate = DateTime.Now.AddDays(-1) },
                new Report { Id = 2, Title = "Report 2", Status = ReportStatus.UPostupku, CreatedDate = DateTime.Now },
                new Report { Id = 3, Title = "Report 3", Status = ReportStatus.Rijeseno, CreatedDate = DateTime.Now.AddDays(-2) }
            };
            _mockReportService.Setup(s => s.GetReportsAsync()).ReturnsAsync(sampleReports);

            // Act
            await _viewModel.LoadReportsAsync();

            // Assert
            _mockReportService.Verify(s => s.GetReportsAsync(), Times.Once);
            Assert.False(_viewModel.IsLoading);
            Assert.Equal(3, _viewModel.AllReports.Count);
            Assert.Equal(3, _viewModel.Reports.Count);

            // Default sort is by date descending
            Assert.Equal(2, _viewModel.Reports.First().Id);
            Assert.Equal(3, _viewModel.Reports.Last().Id);
        }

        [Fact]
        public async Task LoadReportsAsync_ShouldHandleException_WhenServiceCallFails()
        {
            // Arrange
            _mockReportService.Setup(s => s.GetReportsAsync()).ThrowsAsync(new Exception("Service failure"));

            // Act
            await _viewModel.LoadReportsAsync();

            // Assert
            Assert.False(_viewModel.IsLoading);
            Assert.Empty(_viewModel.AllReports);
            Assert.Empty(_viewModel.Reports);
        }

        [Fact]
        public async Task ApplyFilterCommand_ShouldFilterReportsCorrectly()
        {
            // Arrange
            var sampleReports = new List<Report>
            {
                new Report { Id = 1, Title = "Report 1", Status = ReportStatus.Zaprimljeno, CreatedDate = DateTime.Now.AddDays(-1) },
                new Report { Id = 2, Title = "Report 2", Status = ReportStatus.UPostupku, CreatedDate = DateTime.Now },
                new Report { Id = 3, Title = "Report 3", Status = ReportStatus.Zaprimljeno, CreatedDate = DateTime.Now.AddDays(-2) }
            };
            _mockReportService.Setup(s => s.GetReportsAsync()).ReturnsAsync(sampleReports);
            await _viewModel.LoadReportsAsync(); // Initial load

            // Act
            _viewModel.ApplyFilterCommand.Execute(ReportStatus.Zaprimljeno);

            // Assert
            Assert.Equal(ReportStatus.Zaprimljeno, _viewModel.SelectedFilter);
            Assert.Equal(2, _viewModel.Reports.Count);
            Assert.All(_viewModel.Reports, report => Assert.Equal(ReportStatus.Zaprimljeno, report.Status));
        }
        
        [Fact]
        public async Task ToggleSortCommand_ShouldChangeSortDirectionAndOrder()
        {
            // Arrange
            var sampleReports = new List<Report>
            {
                new Report { Id = 1, Title = "Oldest", Status = ReportStatus.Zaprimljeno, CreatedDate = DateTime.Now.AddDays(-2) },
                new Report { Id = 2, Title = "Newest", Status = ReportStatus.UPostupku, CreatedDate = DateTime.Now },
            };
            _mockReportService.Setup(s => s.GetReportsAsync()).ReturnsAsync(sampleReports);
            await _viewModel.LoadReportsAsync();

            // Assert initial state (descending)
            Assert.False(_viewModel.IsAscending);
            Assert.Equal("Newest", _viewModel.Reports.First().Title);

            // Act
            _viewModel.ToggleSortCommand.Execute(null);

            // Assert final state (ascending)
            Assert.True(_viewModel.IsAscending);
            Assert.Equal("Oldest", _viewModel.Reports.First().Title);
        }
    }
}
