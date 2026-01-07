namespace CleanCity.Core.Services;

using CleanCity.Core.Interfaces.Services;
using CleanCity.Core.Models;
using CleanCity.Core.Services.Interfaces;
using System.Text;

public class ReportService : IReportService
{
    private readonly List<Report> _reports = new();
    private readonly IReportFactory _reportFactory;

    public ReportService(IReportFactory reportFactory)
    {
        _reportFactory = reportFactory;
        _reports.AddRange(_reportFactory.CreateReports());
    }

    /*
    // =====================================================================================
    // #1: KREACIJSKI OBRAZAC: SINGLETON
    // =====================================================================================
    // Ova funkcionalnost je premještena u MockReportFactory.
    private void InitializeMockData()
    {
        _reports.AddRange(new[]
        {
            new Report { Id = 1, Title = "Divlje odlagalište - Ulica Ivana Gundulića", Description = "Veliko divlje odlagalište s raznim otpadom", CreatedDate = new DateTime(2025, 11, 15), Status = ReportStatus.Zaprimljeno, Location = "Ulica Ivana Gundulića" },
            new Report { Id = 2, Title = "Prepun kontejner - Trg bana Jelačića", Description = "Kontejner prepun smeća", CreatedDate = new DateTime(2025, 10, 12), Status = ReportStatus.UPostupku, Location = "Trg bana Jelačića" },
            new Report { Id = 3, Title = "Oštećeni koš - Park Maksimir", Description = "Koš za smeće oštećen i neupotrebljiv", CreatedDate = new DateTime(2025, 10, 8), Status = ReportStatus.Rijeseno, Location = "Park Maksimir" },
            new Report { Id = 4, Title = "Grafiti na zgradi - Savska cesta 41", Description = "Grafiti na fasadi zgrade", CreatedDate = new DateTime(2025, 10, 3), Status = ReportStatus.UPostupku, Location = "Savska cesta 41" },
            new Report { Id = 5, Title = "Nefunkcionalna klupa - Zrinjevac", Description = "Klupa slomljena i nefunkcionalna", CreatedDate = new DateTime(2025, 9, 28), Status = ReportStatus.Rijeseno, Location = "Zrinjevac" },
            new Report { Id = 6, Title = "Razbijeno stakleno zvono - Heinzelova 62", Description = "Stakleno zvono za reciklažu razbijeno", CreatedDate = new DateTime(2025, 9, 20), Status = ReportStatus.Zaprimljeno, Location = "Heinzelova 62" }
        });
    }
    */

    public Task<List<Report>> GetReportsAsync()
    {
        return Task.FromResult(_reports.OrderByDescending(r => r.CreatedDate).ToList());
    }

    public Task<Report> GetReportByIdAsync(int id)
    {
        var report = _reports.FirstOrDefault(r => r.Id == id);
        return Task.FromResult(report);
    }

    public Task<bool> AddReportAsync(Report report)
    {
        report.Id = _reports.Any() ? _reports.Max(r => r.Id) + 1 : 1;
        report.CreatedDate = DateTime.Now;
        _reports.Add(report);
        return Task.FromResult(true);
    }

    public Task<bool> UpdateReportAsync(Report report)
    {
        var existingReport = _reports.FirstOrDefault(r => r.Id == report.Id);
        if (existingReport == null) return Task.FromResult(false);
        existingReport.Title = report.Title;
        existingReport.Description = report.Description;
        existingReport.Status = report.Status;
        existingReport.Location = report.Location;
        existingReport.ImagePath = report.ImagePath;
        return Task.FromResult(true);
    }

    public Task<bool> DeleteReportAsync(int id)
    {
        var report = _reports.FirstOrDefault(r => r.Id == id);
        if (report == null) return Task.FromResult(false);
        _reports.Remove(report);
        return Task.FromResult(true);
    }

    // =====================================================================================
    // #1: NAČELO JEDINSTVENE ODGOVORNOSTI (SINGLE RESPONSIBILITY PRINCIPLE)
    // =====================================================================================
    // LOŠE! Metoda za formatiranje treba biti zasebno, a ne s CRUD operacijama za prijavu
    public string FormatReportForDisplay(Report report)
    {
        if (report == null)
        {
            return "Prijava ne postoji.";
        }

        var sb = new StringBuilder();
        sb.AppendLine($"===== PRIJAVA: {report.Title} =====");
        sb.AppendLine($"Status: {report.Status}");
        sb.AppendLine($"Datum: {report.CreatedDate:dd.MM.yyyy}");
        sb.AppendLine($"Lokacija: {report.Location}");
        sb.AppendLine("------------------------------------");
        sb.AppendLine(report.Description);
        sb.AppendLine("====================================");

        return sb.ToString();
    }
}
