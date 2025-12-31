namespace CleanCity;

using Microsoft.Extensions.Logging;
using UraniumUI;
using CleanCity.Services;
using CleanCity.ViewModels;
using CleanCity.Views;
using CleanCity.Interfaces.Services;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseUraniumUI()
            .UseUraniumUIMaterial()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                fonts.AddFontAwesomeIconFonts();
            });

#if DEBUG
		builder.Logging.AddDebug();
#endif

        // Register Services
        builder.Services.AddSingleton<IReportService, ReportService>();

        // Register ViewModels
        builder.Services.AddTransient<DashboardViewModel>();

        // Register Views
        builder.Services.AddTransient<DashboardView>();

        return builder.Build();
    }
}
