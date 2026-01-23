namespace CleanCity.Views;

public partial class SplashView : ContentPage
{
    public SplashView()
    {
        InitializeComponent();
 }

    protected override async void OnAppearing()
    {
base.OnAppearing();
 
        // Pricekaj samo 1 sekundu
      await Task.Delay(1000);
        
        // Prebaci na Dashboard
        await Shell.Current.GoToAsync("///DashboardView");
    }
}
