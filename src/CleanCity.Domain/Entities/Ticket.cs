using CleanCity.Domain.Enums;

namespace CleanCity.Domain.Entities;

public class Ticket
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TicketStatus Status { get; set; } = TicketStatus.Open;
    public Priority Priority { get; set; } = Priority.Medium;
    
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    
    public int CreatedById { get; set; }
    public User CreatedBy { get; set; } = null! ;
    
    public int?  AssignedToServiceId { get; set; }
    public CityService?  AssignedToService { get; set; }
    
    public GeoLocation? Location { get; set; }
    
    
    public DateTime CreatedAt { get; set; } = DateTime. UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    
    // additional
    public string?  ImageUrl { get; set; }
    public string? Notes { get; set; } // notes for admin
}