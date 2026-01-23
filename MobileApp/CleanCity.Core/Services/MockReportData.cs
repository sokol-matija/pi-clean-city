namespace CleanCity.Core.Services;

using CleanCity.Core.Models;
using System.Collections.Generic;

// =====================================================================================
// #5: NAČELO INVERZIJE OVISNOSTI (DEPENDENCY INVERSION PRINCIPLE)
// =====================================================================================
public static class MockReportData
{
    private static readonly List<Report> _reports = InitData();

    private static List<Report> InitData()
    {
        return new List<Report>
        {
            new Report { Id = 1, Title = "Divlje odlagalište - Ulica Ivana Gundulića", Description = "Veliko divlje odlagalište s raznim otpadom", CreatedDate = new DateTime(2025, 11, 15, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.Zaprimljeno, Location = "Ulica Ivana Gundulića" },
            new Report { Id = 2, Title = "Prepun kontejner - Trg bana Jelačića", Description = "Kontejner prepun smeća", CreatedDate = new DateTime(2025, 10, 12, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.UPostupku, Location = "Trg bana Jelačića" },
            new Report { Id = 3, Title = "Oštećeni koš - Park Maksimir", Description = "Koš za smeće oštećen i neupotrebljiv", CreatedDate = new DateTime(2025, 10, 8, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.Rijeseno, Location = "Park Maksimir" },
            new Report { Id = 4, Title = "Grafiti na zgradi - Savska cesta 41", Description = "Grafiti na fasadi zgrade", CreatedDate = new DateTime(2025, 10, 3, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.UPostupku, Location = "Savska cesta 41" },
            new Report { Id = 5, Title = "Nefunkcionalna klupa - Zrinjevac", Description = "Klupa slomljena i nefunkcionalna", CreatedDate = new DateTime(2025, 9, 28, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.Rijeseno, Location = "Zrinjevac" },
            new Report { Id = 6, Title = "Razbijeno stakleno zvono - Heinzelova 62", Description = "Stakleno zvono za reciklažu razbijeno", CreatedDate = new DateTime(2025, 9, 20, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.Zaprimljeno, Location = "Heinzelova 62" }
        };
    }

    public static Task<List<Report>> GetReportsAsync()
    {
        return Task.FromResult(_reports.OrderByDescending(r => r.CreatedDate).ToList());
    }
}
