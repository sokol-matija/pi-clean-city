namespace CleanCity
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();
        }

        protected override Window CreateWindow(IActivationState activationState)
        {
            var window = new Window(new AppShell());

#if WINDOWS
            window.Width = 450;
            window.Height = 800;
            
            // Sakrij title bar
            window.Created += (s, e) =>
            {
                Microsoft.Maui.Handlers.WindowHandler.Mapper.AppendToMapping("HideTitleBar", (handler, view) =>
                {
                    var nativeWindow = handler.PlatformView;
                    nativeWindow.ExtendsContentIntoTitleBar = true;
                    nativeWindow.Title = string.Empty;
                });
            };
#endif

            return window;
        }
    }
}
