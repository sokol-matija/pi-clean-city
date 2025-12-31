using CleanCity.Components;
using CleanCity.Models;
using CleanCity.ViewModels;

namespace CleanCity.Views;

public partial class DashboardView : RectangleUraniumContentPage
{
    private readonly DashboardViewModel _viewModel;

    public DashboardView(DashboardViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = _viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.OnAppearingAsync();
    }

    private void OnStatusButtonTapped(object sender, EventArgs e)
    {
        FilterPopupComponent.Show();
    }

    private void OnFilterSelected(object sender, ReportStatus? selectedStatus)
    {
        _viewModel.ApplyFilterCommand.Execute(selectedStatus);
    }

    private void OnFABClicked(object sender, EventArgs e)
    {
        // TODO: Navigacija na stranicu za dodavanje nove prijave
        Console.WriteLine("FAB clicked - Add new report");
    }
}
