using CleanCity.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanCity.Application.DTOs.Tickets
{
    public class UpdateTicketStatusDto
    {
        public TicketStatus Status { get; set; }
        public string? Notes { get; set; }
    }
}
