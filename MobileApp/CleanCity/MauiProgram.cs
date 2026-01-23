namespace CleanCity;

using Microsoft.Extensions.Logging;
using UraniumUI;
using CleanCity.Core.Services;
using CleanCity.Core.ViewModels;
using CleanCity.Views;
using CleanCity.Core.Interfaces.Services;
using CleanCity.Core.Services.Decorators;
using CleanCity.Core.Services.Interfaces;

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
        builder.Services.AddSingleton<IReportFactory>(MockReportFactory.Instance);

        // =====================================================================================
        // #2: STRUKTURNI OBRAZAC: DECORATOR
        // =====================================================================================
        builder.Services.AddSingleton<ReportService>();
        // 2. Registriramo sučelje IReportService. Kada ga netko zatraži, DI kontejner će:
        //    a) Pronaći registrirani ReportService.
        //    b) Stvoriti LoggingReportServiceDecorator i proslijediti mu ReportService.
        //    c) Vratiti dekorator kao rezultat.
        // Na ovaj način ostatak aplikacije nije svjestan da koristi dekorator,
        // a mi smo dodali novu funkcionalnost bez izmjene originalne klase.
        builder.Services.AddSingleton<IReportService>(serviceProvider =>
            new LoggingReportServiceDecorator(
                serviceProvider.GetRequiredService<ReportService>()
            ));

        // Register ViewModels
        builder.Services.AddTransient<DashboardViewModel>();

        // Register Views
        builder.Services.AddTransient<DashboardView>();

        return builder.Build();
    }
}
