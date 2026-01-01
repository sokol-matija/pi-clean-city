namespace CleanCity.ViewModels;

using CleanCity.Interfaces.Services;
using CleanCity.Models;
using CleanCity.Services;
using CleanCity.Services.Sorting; // << NOVI USING
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Windows.Input;

public class DashboardViewModel : INotifyPropertyChanged
{
    private readonly IReportService _reportService;
    private ObservableCollection<Report> _reports = new();
    private ObservableCollection<Report> _allReports = new();
    private bool _isLoading;
    private ReportStatus? _selectedFilter;
    private bool _isAscending;

    // =====================================================================================
    // #3: OBRAZAC PONAŠANJA: STRATEGY (Context)
    // =====================================================================================
    // ViewModel sada sadrži referencu na strategiju sortiranja.
    private ISortStrategy _currentSortStrategy;

    public event PropertyChangedEventHandler PropertyChanged;

    public DashboardViewModel(IReportService reportService)
    {
        _reportService = reportService;
        // Inicijaliziramo default strategiju sortiranja (po datumu)
        _currentSortStrategy = new SortByDateStrategy(); // << INICIJALIZACIJA DEFAULTNE STRATEGIJE
        LoadReportsCommand = new Command(async () => await LoadReportsAsync());
        ApplyFilterCommand = new Command<ReportStatus?>(ApplyFilter);
        ToggleSortCommand = new Command(ToggleSort);
    }

    public ObservableCollection<Report> Reports
    {
        get => _reports;
        set
        {
            if (_reports != value)
            {
                _reports = value;
                OnPropertyChanged();
            }
        }
    }

    public ObservableCollection<Report> AllReports
    {
        get => _allReports;
        set
        {
            if (_allReports != value)
            {
                _allReports = value;
                OnPropertyChanged();
            }
        }
    }

    public bool IsLoading
    {
        get => _isLoading;
        set
        {
            if (_isLoading != value)
            {
                _isLoading = value;
                OnPropertyChanged();
            }
        }
    }

    public ReportStatus? SelectedFilter
    {
        get => _selectedFilter;
        set
        {
            if (_selectedFilter != value)
            {
                _selectedFilter = value;
                OnPropertyChanged();
            }
        }
    }

    public bool IsAscending
    {
        get => _isAscending;
        set
        {
            if (_isAscending != value)
            {
                _isAscending = value;
                OnPropertyChanged();
            }
        }
    }

    public ICommand LoadReportsCommand { get; }
    public ICommand ApplyFilterCommand { get; }
    public ICommand ToggleSortCommand { get; }

    public async Task LoadReportsAsync()
    {
        if (IsLoading)
            return;

        try
        {
            IsLoading = true;
            // var reports = await MockReportData.GetReportsAsync(); // #5: Dependency Inversion Principle - načelo je prekršeno jer ovisimo o konkretnoj klasi
            var reports = await _reportService.GetReportsAsync(); // ispravno korištenje DIP-a - ovisimo o apstrakciji (interface IReportService)
            AllReports = new ObservableCollection<Report>(reports);
            ApplyFilterAndSort();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading reports: {ex.Message}");
        }
        finally
        {
            IsLoading = false;
        }
    }

    private void ApplyFilter(ReportStatus? filter)
    {
        SelectedFilter = filter;
        ApplyFilterAndSort();
    }

    private void ToggleSort()
    {
        IsAscending = !IsAscending;
        ApplyFilterAndSort();
    }

    private void ApplyFilterAndSort()
    {
        IEnumerable<Report> filtered;

        if (SelectedFilter == null)
        {
            filtered = AllReports;
        }
        else
        {
            filtered = AllReports.Where(r => r.Status == SelectedFilter);
        }

        // =====================================================================================
        // #3: OBRAZAC PONAŠANJA: STRATEGY
        // =====================================================================================
        // STARI KOD: Logika sortiranja bila je hardkodirana unutar ove metode,
        // čime je bila nefleksibilna i teško proširiva za nove načine sortiranja.
        // var sorted = IsAscending
        //     ? filtered.OrderBy(r => r.CreatedDate)
        //     : filtered.OrderByDescending(r => r.CreatedDate);
        var sorted = _currentSortStrategy.Sort(filtered, IsAscending); // Proslijedi smjer sortiranja strategiji
        
        Reports = new ObservableCollection<Report>(sorted);
    }

    public async Task OnAppearingAsync()
    {
        await LoadReportsAsync();
    }

    protected void OnPropertyChanged([CallerMemberName] string propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}

