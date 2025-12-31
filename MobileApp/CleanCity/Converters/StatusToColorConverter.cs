using CleanCity.Helpers;
using CleanCity.Models;
using System.Globalization;

namespace CleanCity.Converters;

// #2: PRIMJENA OTVORENOG/ZATVORENOG NAČELA (OPEN/CLOSED PRINCIPLE) - Rješenje s atributima
//
// PROBLEM:
// Staro rješenje ('switch') zahtijeva izmjenu klase konvertera prilikom dodavanja novog statusa.
// To znači da klasa nije bila u potpunosti "zatvorena za modifikaciju".
//
// NOVI KOD (rješenje s atributima):
// Svi potrebni podaci (boje, opisi) definirani su direktno na 'ReportStatus' enumu pomoću '[StatusMetadata]' atributa.
// Konverter klasa se sada ne mora mijenjati ako se dodaju novi statusi.
public class StatusToColorConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is not ReportStatus status)
            return Colors.Gray;

        var metadata = status.GetAttribute<StatusMetadataAttribute>();
        if (metadata == null)
            return Colors.Gray;

        var colorType = parameter?.ToString()?.ToLower() ?? "background";

        var colorString = colorType == "background" ? metadata.BackgroundColor : metadata.StrokeColor;

        return Color.FromArgb(colorString);
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}


// === STARI KOD ===
//public class StatusToColorConverter : IValueConverter
//{
//    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
//    {
//        if (value is not ReportStatus status)
//            return Colors.Gray;

//        // Parameter određuje koja boja se vraća: "background" ili "stroke"
//        var colorType = parameter?.ToString()?.ToLower() ?? "background";

//        return status switch
//        {
//            ReportStatus.Zaprimljeno => colorType == "background" ? Color.FromArgb("#FFE0B2") : Color.FromArgb("#E65100"),
//            ReportStatus.UPostupku => colorType == "background" ? Color.FromArgb("#BBDEFB") : Color.FromArgb("#0D47A1"),
//            ReportStatus.Rijeseno => colorType == "background" ? Color.FromArgb("#C8E6C9") : Color.FromArgb("#1B5E20"),
//            _ => Colors.Gray
//        };
//    }

//    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
//    {
//        throw new NotImplementedException();
//    }
//}

