namespace CleanCity.Core.Models.Interfaces;

public interface IGeoTaggable
{
    string ImagePath { get; set; }

    string Location { get; set; }
}

