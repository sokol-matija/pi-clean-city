namespace CleanCity.Core.Models;

using CleanCity.Core.Models.Interfaces;

// =====================================================================================
// #4: NAČELO SEGREGACIJE SUČELJA (INTERFACE SEGREGATION PRINCIPLE)
// =====================================================================================
public class UserProfile : IHasImage // IGeoTaggable
{
    public int UserId { get; set; }

    public string UserName { get; set; }

    public string ImagePath { get; set; }

    // OVAJ PROPERTY JE VIŠAK, ALI GA MORAMO IMPLEMENTIRATI ZBOG IGeoTaggable INTERFACE-A.
    // public string Location => null; // Vraćamo null jer korisnik nema lokaciju.

}
