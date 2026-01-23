using System.Globalization;

namespace CleanCity.Converters;

public class SortDirectionConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
    {
     if (value is bool isAscending)
        {
            return isAscending ? "↑" : "↓";
  }

        return "↓";
    }

    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
    {
        throw new NotImplementedException();
    }
}
