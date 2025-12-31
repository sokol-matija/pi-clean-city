using Microsoft.Maui.Controls.Shapes;
using UraniumUI.Pages;

namespace CleanCity.Components;

public class RectangleUraniumContentPage : UraniumContentPage
{
    public RectangleUraniumContentPage()
    {
        // makni Rounded style
        ContentFrame.StyleClass = new[] { "SurfaceContainer" };

        // da osiguramo da nema radiusa
        ContentFrame.StrokeShape = new RoundRectangle
        {
            CornerRadius = 0
        };
    }
}
