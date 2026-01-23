namespace CleanCity.Core.Helpers;

using System;

[AttributeUsage(AttributeTargets.Field, AllowMultiple = false)]
public class StatusMetadataAttribute : Attribute
{
    public string Description { get; }
    public string BackgroundColor { get; }
    public string StrokeColor { get; }

    public StatusMetadataAttribute(string description, string backgroundColor, string strokeColor)
    {
        Description = description;
        BackgroundColor = backgroundColor;
        StrokeColor = strokeColor;
    }
}
