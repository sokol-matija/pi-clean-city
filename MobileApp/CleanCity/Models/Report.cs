namespace CleanCity.Models;

using CleanCity.Models.Interfaces;
// =====================================================================================
// #4: NAČELO SEGREGACIJE SUČELJA (INTERFACE SEGREGATION PRINCIPLE)
// =====================================================================================
//
// Klasa 'Report' implementirala je sučelje 'IGeoTaggable', koje je sadržavalo lokaciju i putanju slike.
// Međutim, ne trebaju sve klase koje trebaju lokaciju također i sliku, i obrnuto - primjer -> UserProfile
public class Report : IHasImage, IHasLocation // IGeoTaggable
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime CreatedDate { get; set; }
    public ReportStatus Status { get; set; }
    public string Location { get; set; }
    public string ImagePath { get; set; }
}
