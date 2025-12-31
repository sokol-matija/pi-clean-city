using CleanCity.Models;
using System.Collections.ObjectModel;

namespace CleanCity.Components;

public partial class ReportsList : CollectionView
{
    public static readonly BindableProperty ReportsProperty =
        BindableProperty.Create(
  nameof(Reports),
         typeof(ObservableCollection<Report>),
            typeof(ReportsList),
     null,
      propertyChanged: OnReportsChanged);

    public ObservableCollection<Report> Reports
    {
     get => (ObservableCollection<Report>)GetValue(ReportsProperty);
        set => SetValue(ReportsProperty, value);
    }

    private static void OnReportsChanged(BindableObject bindable, object oldValue, object newValue)
    {
        var control = (ReportsList)bindable;
        control.ItemsSource = newValue as ObservableCollection<Report>;
    }

 public ReportsList()
    {
        InitializeComponent();
    }
}
