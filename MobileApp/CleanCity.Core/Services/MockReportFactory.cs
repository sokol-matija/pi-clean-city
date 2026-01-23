using CleanCity.Core.Models;
using CleanCity.Core.Services.Interfaces;
using System.Collections.Generic;

namespace CleanCity.Core.Services;

// =====================================================================================
// #1: KREACIJSKI OBRAZAC: SINGLETON
// =====================================================================================
public class MockReportFactory : IReportFactory
{
    // 1. Privatna, statička, readonly varijabla koja drži jedinu instancu (thread-safe).
    private static readonly MockReportFactory _instance = new MockReportFactory();

    // Lista za keširanje generiranih podataka unutar instance.
    private List<Report> _cachedReports;

    // 2. Privatni konstruktor sprječava vanjsko instanciranje.
    private MockReportFactory() { }

    // 3. Javni statički property za dohvaćanje jedine instance.
    public static MockReportFactory Instance => _instance;

    // 4. Metoda za stvaranje/dohvaćanje podataka (sada kao instancna metoda).
    public List<Report> CreateReports()
    {
        // Ako podaci još nisu keširani, generiraj ih i spremi u privatnu varijablu.
        if (_cachedReports == null)
        {
            _cachedReports = new List<Report>
            {
                new Report { Id = 1, Title = "Divlje odlagalište - Ulica Ivana Gundulića", Description = "Veliko divlje odlagalište s raznim otpadom", CreatedDate = new System.DateTime(2025, 11, 15, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.Zaprimljeno, Location = "Ulica Ivana Gundulića" },
                new Report { Id = 2, Title = "Prepun kontejner - Trg bana Jelačića", Description = "Kontejner prepun smeća", CreatedDate = new System.DateTime(2025, 10, 12, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.UPostupku, Location = "Trg bana Jelačića" },
                new Report { Id = 3, Title = "Oštećeni koš - Park Maksimir", Description = "Koš za smeće oštećen i neupotrebljiv", CreatedDate = new System.DateTime(2025, 10, 8, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.Rijeseno, Location = "Park Maksimir" },
                new Report { Id = 4, Title = "Grafiti na zgradi - Savska cesta 41", Description = "Grafiti na fasadi zgrade", CreatedDate = new System.DateTime(2025, 10, 3, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.UPostupku, Location = "Savska cesta 41" },
                new Report { Id = 5, Title = "Nefunkcionalna klupa - Zrinjevac", Description = "Klupa slomljena i nefunkcionalna", CreatedDate = new System.DateTime(2025, 9, 28, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.Rijeseno, Location = "Zrinjevac" },
                new Report { Id = 6, Title = "Razbijeno stakleno zvono - Heinzelova 62", Description = "Stakleno zvono za reciklažu razbijeno", CreatedDate = new System.DateTime(2025, 9, 20, 0, 0, 0, DateTimeKind.Local), Status = ReportStatus.Zaprimljeno, Location = "Heinzelova 62" }
            };
        }
        
        // Uvijek vrati keširane podatke.
        return _cachedReports;
    }
}
