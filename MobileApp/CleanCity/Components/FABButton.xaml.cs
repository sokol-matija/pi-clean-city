using Microsoft.Maui.Controls.Shapes;

namespace CleanCity.Components;

// =====================================================================================
// #3: LISKOVIČINO NAČELO SUPSTITUCIJE (LISKOV SUBSTITUTION PRINCIPLE)
// =====================================================================================
//
// Liskovičino načelo nalaže da podtip (klasa koja nasljeđuje) mora u potpunosti moći
// zamijeniti svoj nadtip (osnovnu klasu), a da se pritom ne naruši ispravnost programa.
//
// Ova koponenta `FABButton` nasljeđuje `Border`.
// Očekivano ponašanje `Border`-a je da kada mu postavimo neko svojstvo, npr. `StrokeShape`, ta vrijednost ostaje takva kakva je.
//
// FABButton imao je property ForceRectangleShape, koji je, kada je postavljen na true, gazio vrijednost StrokeShape.
// OVO JE KRŠENJE NAČELA SUPSTITUCIJE jer `FABButton` više nije mogao u potpunosti zamijeniti `Border` kojeg nasljeđuje.

public partial class FABButton : Border
{
    public event EventHandler Clicked;

    // OVAJ PROPERTY KRŠI LISKOVIČINO NAČELO - pa je umjesto njega stavljena metoda ApplyRectangleStyle().
    // public bool ForceRectangleShape { get; set; } = false;

    public FABButton()
    {
        InitializeComponent();
    }

    protected override void OnPropertyChanged(string propertyName = null)
    {
        base.OnPropertyChanged(propertyName);

        // OVO JE PROBLEM - KRŠENJE LISKOVIČINOG NAČELA!!
        //if (ForceRectangleShape && propertyName != nameof(ForceRectangleShape))
        //{
        //    // gazimo oblik definiran u XAML-u!
        //    this.StrokeShape = new Rectangle();
        //}
    }

    // Namjera je jasna - mijenjamo oblik pozivom ove metode.
    public void ApplyRectangleStyle()
    {
        this.StrokeShape = new Rectangle();
    }

    private void OnFABTapped(object sender, EventArgs e)
    {
        Clicked?.Invoke(this, EventArgs.Empty);
    }
}
