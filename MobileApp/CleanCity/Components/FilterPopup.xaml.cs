using CleanCity.Core.Models;
using UraniumUI.Material.Controls;

namespace CleanCity.Components;

public partial class FilterPopup : Grid
{
    public event EventHandler<ReportStatus?> FilterSelected;

    public FilterPopup()
    {
        InitializeComponent();
    }

    public void Show()
    {
        IsVisible = true;
    }

    public void Hide()
    {
        IsVisible = false;
    }

    private void OnOverlayTapped(object sender, EventArgs e)
    {
        Hide();
    }

    private void OnStatusFilterChanged(object sender, EventArgs e)
    {
        if (sender is not RadioButtonGroupView group)
            return;

        var filterValue = group.SelectedItem?.ToString() ?? "";

        ReportStatus? selectedStatus = null;
        if (filterValue != "Svi" && Enum.TryParse<ReportStatus>(filterValue, out var status))
        {
            selectedStatus = status;
        }

        FilterSelected?.Invoke(this, selectedStatus);
        Hide();
    }

}
