namespace CleanCity.Interfaces.Services;

using CleanCity.Models;

public interface IReportService
{
    Task<List<Report>> GetReportsAsync();
    Task<Report> GetReportByIdAsync(int id);
    Task<bool> AddReportAsync(Report report);
    Task<bool> UpdateReportAsync(Report report);
    Task<bool> DeleteReportAsync(int id);

    // =====================================================================================
    // #1: NAČELO JEDINSTVENE ODGOVORNOSTI (SINGLE RESPONSIBILITY PRINCIPLE)
    // =====================================================================================
    // LOŠE! Metoda za formatiranje treba biti zasebno, a ne s CRUD operacijama za prijavu
    string FormatReportForDisplay(Report report);
}

