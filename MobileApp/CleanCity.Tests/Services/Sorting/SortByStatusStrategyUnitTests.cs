using CleanCity.Core.Models;
using CleanCity.Core.Services.Sorting;

namespace CleanCity.Tests.Services.Sorting
{
    public class SortByStatusStrategyUnitTests
    {
        private readonly SortByStatusStrategy _strategy = new SortByStatusStrategy();
        private readonly List<Report> _reports = new List<Report>
        {
            new Report { Status = ReportStatus.UPostupku }, // Should be 2nd
            new Report { Status = ReportStatus.Zaprimljeno }, // Should be 3rd
            new Report { Status = ReportStatus.Rijeseno } // Should be 1st
        };

        [Fact]
        public void Sort_ShouldSortByStatusAscending()
        {
            // Act
            var sortedReports = _strategy.Sort(_reports, isAscending: true);

            // Assert
            Assert.Equal(ReportStatus.Rijeseno, sortedReports[0].Status);
            Assert.Equal(ReportStatus.UPostupku, sortedReports[1].Status);
            Assert.Equal(ReportStatus.Zaprimljeno, sortedReports[2].Status);
        }

        [Fact]
        public void Sort_ShouldSortByStatusDescending()
        {
            // Act
            var sortedReports = _strategy.Sort(_reports, isAscending: false);

            // Assert
            Assert.Equal(ReportStatus.Zaprimljeno, sortedReports[0].Status);
            Assert.Equal(ReportStatus.UPostupku, sortedReports[1].Status);
            Assert.Equal(ReportStatus.Rijeseno, sortedReports[2].Status);
        }
    }
}
