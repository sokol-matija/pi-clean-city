using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CleanCity.Application.DTOs.CityServices;
using CleanCity.Infrastructure.Data;

namespace CleanCity.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CityServicesController : ControllerBase
{
    private readonly CleanCityDbContext _context;

    public CityServicesController(CleanCityDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CityServiceDto>>> GetCityServices()
    {
        var services = await _context.CityServices
            .Select(s => new CityServiceDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                Email = s.Email,
                PhoneNumber = s.PhoneNumber
            })
            .ToListAsync();

        return Ok(services);
    }

    [HttpGet("{id}/tickets")]
    public async Task<ActionResult> GetCityServiceTickets(int id)
    {
        var service = await _context.CityServices
            .Include(s => s.AssignedTickets)
                .ThenInclude(t => t.Category)
            .Include(s => s.AssignedTickets)
                .ThenInclude(t => t.CreatedBy)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (service == null)
            return NotFound();

        var tickets = service.AssignedTickets.Select(t => new
        {
            t.Id,
            t.Title,
            t.Description,
            Status = t.Status.ToString(),
            Priority = t.Priority.ToString(),
            CategoryName = t.Category.Name,
            CreatedByEmail = t.CreatedBy.Email,
            t.CreatedAt
        });

        return Ok(tickets);
    }
}