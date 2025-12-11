using CleanCity.Application.DTOs.Tickets;
using CleanCity.Domain.Entities;
using CleanCity.Domain.Enums;
using CleanCity.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CleanCity.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly CleanCityDbContext _context;

        public TicketsController(CleanCityDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Citizen")]
        public async Task<ActionResult<TicketDto>> CreateTicket([FromBody] CreateTicketDto dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized();

            var userId = int.Parse(userIdClaim);

            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                return BadRequest(new { message = "Invalid category" });

            
            var ticket = new Ticket
            {
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                Priority = dto.Priority,
                Status = TicketStatus.Open,
                CreatedById = userId,
                ImageUrl = dto.ImageUrl,
                CreatedAt = DateTime.UtcNow,

                //TODO: check location relationships for later use, one-to-one or one-to-many
                Location = new GeoLocation
                {
                    Address = dto.Address,
                    City = dto.City,
                    Country = "Croatia",
                    PostalCode = "",  //leave empty for now
                    Latitude = dto.Latitude,
                    Longitude = dto.Longitude
                }
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            // load related data
            await _context.Entry(ticket)
                .Reference(t => t.Category)
                .LoadAsync();

            await _context.Entry(ticket)
                .Reference(t => t.CreatedBy)
                .LoadAsync();

            
            var ticketDto = new TicketDto
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Description = ticket.Description,
                Status = ticket.Status.ToString(),
                Priority = ticket.Priority.ToString(),
                CategoryName = ticket.Category.Name,
                CreatedByEmail = ticket.CreatedBy.Email,
                CreatedAt = ticket.CreatedAt,
                ImageUrl = ticket.ImageUrl,
                Address = ticket.Location?.Address,
                City = ticket.Location?.City
            };

            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, ticketDto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetTickets(
            [FromQuery] TicketStatus? status = null,
            [FromQuery] Priority? priority = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] int? assignedToServiceId = null)
        {
            var query = _context.Tickets
                .Include(t => t.Category)
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedToService)
                .Include(t => t.Location)
                .AsQueryable();

            if (status.HasValue)
                query = query.Where(t => t.Status == status.Value);

            if (priority.HasValue)
                query = query.Where(t => t.Priority == priority.Value);

            if (categoryId.HasValue)
                query = query.Where(t => t.CategoryId == categoryId.Value);

            if (assignedToServiceId.HasValue)
                query = query.Where(t => t.AssignedToServiceId == assignedToServiceId.Value);

            var tickets = await query
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TicketDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    Status = t.Status.ToString(),
                    Priority = t.Priority.ToString(),
                    CategoryName = t.Category.Name,
                    CreatedByEmail = t.CreatedBy.Email,
                    AssignedToServiceName = t.AssignedToService != null ? t.AssignedToService.Name : null,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    ImageUrl = t.ImageUrl,
                    Notes = t.Notes,
                    Address = t.Location != null ? t.Location.Address : null,
                    City = t.Location != null ? t.Location.City : null
                })
                .ToListAsync();

            return Ok(tickets);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TicketDto>> GetTicket(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Category)
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedToService)
                .Include(t => t.Location)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
                return NotFound();

            var ticketDto = new TicketDto
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Description = ticket.Description,
                Status = ticket.Status.ToString(),
                Priority = ticket.Priority.ToString(),
                CategoryName = ticket.Category.Name,
                CreatedByEmail = ticket.CreatedBy.Email,
                AssignedToServiceName = ticket.AssignedToService?.Name,
                CreatedAt = ticket.CreatedAt,
                UpdatedAt = ticket.UpdatedAt,
                ImageUrl = ticket.ImageUrl,
                Notes = ticket.Notes,
                Address = ticket.Location?.Address,
                City = ticket.Location?.City
            };

            return Ok(ticketDto);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin,CentralAdmin")]
        public async Task<IActionResult> UpdateTicketStatus(int id, [FromBody] UpdateTicketStatusDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
                return NotFound();

            ticket.Status = dto.Status;
            ticket.Notes = dto.Notes;
            ticket.UpdatedAt = DateTime.UtcNow;

            if (dto.Status == TicketStatus.Resolved || dto.Status == TicketStatus.Closed)
                ticket.ResolvedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/assign")]
        [Authorize(Roles = "Admin,CentralAdmin")]
        public async Task<IActionResult> AssignTicket(int id, [FromBody] AssignTicketDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
                return NotFound();

            var cityService = await _context.CityServices.FindAsync(dto.CityServiceId);

            if (cityService == null)
                return BadRequest(new { message = "City service not found" });

            ticket.AssignedToServiceId = dto.CityServiceId;
            ticket.Status = TicketStatus.InProgress;
            ticket.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}/priority")]
        [Authorize(Roles = "Admin,CentralAdmin")]
        public async Task<IActionResult> UpdateTicketPriority(int id, [FromBody] Priority priority)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
                return NotFound();

            ticket.Priority = priority;
            ticket.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
