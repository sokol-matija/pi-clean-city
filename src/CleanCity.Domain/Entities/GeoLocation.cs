namespace CleanCity.Domain.Entities;

public class GeoLocation
{
    public int Id { get; set; }
    public string Country { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    //nav prop
    public int TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;
}