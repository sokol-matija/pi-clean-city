using CleanCity.Core.Helpers;
using CleanCity.Core.Models;
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



