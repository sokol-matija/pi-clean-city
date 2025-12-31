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
public class StatusToTextConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
        if (value is not ReportStatus status)
            return string.Empty;

        var metadata = status.GetAttribute<StatusMetadataAttribute>();

        return metadata?.Description ?? status.ToString();
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}


// === STARI KOD ===
//public class StatusToTextConverter : IValueConverter
//{
//    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
//    {
//        if (value is not ReportStatus status)
//            return string.Empty;

//        return status switch
//        {
//            ReportStatus.Zaprimljeno => "zaprimljeno",
//            ReportStatus.UPostupku => "u postupku",
//            ReportStatus.Rijeseno => "riješeno",
//            _ => status.ToString()
//        };
//    }

//    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
//    {
//        throw new NotImplementedException();
//    }
//}

