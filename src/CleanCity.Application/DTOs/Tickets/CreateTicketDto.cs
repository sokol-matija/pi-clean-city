using CleanCity.Domain.Enums;

namespace CleanCity.Application.DTOs.Tickets;

public class CreateTicketDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public Priority Priority { get; set; } = Priority.Medium; 

    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    // img optional
    public string? ImageUrl { get; set; }
}