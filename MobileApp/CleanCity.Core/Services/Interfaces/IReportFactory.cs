using CleanCity.Core.Models;
using System.Collections.Generic;

namespace CleanCity.Core.Services.Interfaces
{
    public interface IReportFactory
    {
        List<Report> CreateReports();
    }
}
