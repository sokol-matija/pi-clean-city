namespace CleanCity.Domain.Entities;

public class CityService
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;

    //nav prop
    public ICollection<Ticket> AssignedTickets { get; set; } = new List<Ticket>();
}