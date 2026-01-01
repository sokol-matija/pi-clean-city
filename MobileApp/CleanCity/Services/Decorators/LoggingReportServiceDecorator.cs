using CleanCity.Interfaces.Services;
using CleanCity.Models;
using System.Diagnostics;

namespace CleanCity.Services.Decorators;

// =====================================================================================
// #2: STRUKTURNI OBRAZAC: DECORATOR
// =====================================================================================
// Ova klasa "omotava" pravi IReportService i dodaje mu novu funkcionalnost (logiranje) bez mijenjanja originalne klase.
public class LoggingReportServiceDecorator : IReportService
{
    private readonly IReportService _wrappedService;

    // Dekorator prima instancu koju će omotati (npr. pravi ReportService).
    public LoggingReportServiceDecorator(IReportService serviceToWrap)
    {
        _wrappedService = serviceToWrap;
    }

    public async Task<List<Report>> GetReportsAsync()
    {
        Debug.WriteLine("---> [LOG] Pokušaj dohvaćanja svih prijava...");
        try
        {
            var result = await _wrappedService.GetReportsAsync();
            Debug.WriteLine($"---> [LOG] Uspješno dohvaćeno {result.Count} prijava.");
            return result;
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"---> [LOG-ERROR] Greška pri dohvaćanju prijava: {ex.Message}");
            throw;
        }
    }
    
    public async Task<Report> GetReportByIdAsync(int id)
    {
        Debug.WriteLine($"---> [LOG] Pokušaj dohvaćanja prijave s ID: {id}...");
        try
        {
            var result = await _wrappedService.GetReportByIdAsync(id);
            Debug.WriteLine(result != null ? $"---> [LOG] Uspješno dohvaćena prijava s ID: {id}." : $"---> [LOG] Prijava s ID: {id} nije pronađena.");
            return result;
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"---> [LOG-ERROR] Greška pri dohvaćanju prijave s ID: {id}: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> AddReportAsync(Report report)
    {
        Debug.WriteLine($"---> [LOG] Pokušaj dodavanja prijave: '{report.Title}'");
        try
        {
            var result = await _wrappedService.AddReportAsync(report);
            Debug.WriteLine($"---> [LOG] Prijava '{report.Title}' uspješno dodana.");
            return result;
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"---> [LOG-ERROR] Greška pri dodavanju prijave: {ex.Message}");
            throw;
        }
    }

    public async Task<bool> UpdateReportAsync(Report report)
    {
        Debug.WriteLine($"---> [LOG] Pokušaj ažuriranja prijave s ID: {report.Id}");
        try
        {
            var result = await _wrappedService.UpdateReportAsync(report);
            Debug.WriteLine($"---> [LOG] Ažuriranje prijave s ID: {report.Id} završeno.");
            return result;
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"---> [LOG-ERROR] Greška pri ažuriranju prijave s ID: {report.Id}: {ex.Message}");
            throw;
        }
    }
    
    public async Task<bool> DeleteReportAsync(int id)
    {
        Debug.WriteLine($"---> [LOG] Pokušaj brisanja prijave s ID: {id}");
        try
        {
            var result = await _wrappedService.DeleteReportAsync(id);
            Debug.WriteLine($"---> [LOG] Brisanje prijave s ID: {id} završeno.");
            return result;
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"---> [LOG-ERROR] Greška pri brisanju prijave s ID: {id}: {ex.Message}");
            throw;
        }
    }

    public string FormatReportForDisplay(Report report)
    {
        Debug.WriteLine($"---> [LOG] Formatiranje prijave za prikaz: '{report?.Title ?? "N/A"}'");
        try
        {
            var result = _wrappedService.FormatReportForDisplay(report);
            Debug.WriteLine($"---> [LOG] Formatiranje prijave završeno.");
            return result;
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"---> [LOG-ERROR] Greška pri formatiranju prijave: {ex.Message}");
            throw;
        }
    }
}
