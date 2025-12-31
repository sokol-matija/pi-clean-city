using CleanCity.Models;
using System.Text;

namespace CleanCity.Helpers;

// =====================================================================================
// PRIMJER #4: NAČELO JEDINSTVENE ODGOVORNOSTI (SINGLE RESPONSIBILITY PRINCIPLE)
// =====================================================================================
// DOBRO: Metoda za formatiranje izdvojena u zasebnu pomoćnu klasu `ReportFormatter`.
public static class ReportFormatter
{
    public static string FormatReportForDisplay(Report report)
    {
        if (report == null)
            return "Prijava ne postoji.";

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
