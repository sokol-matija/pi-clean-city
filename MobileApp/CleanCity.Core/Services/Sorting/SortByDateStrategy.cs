using CleanCity.Core.Models;
using System.Collections.Generic;
using System.Linq;

namespace CleanCity.Core.Services.Sorting;

// =====================================================================================
// #3: OBRAZAC PONAŠANJA: STRATEGY (Konkretna implementacija - sortiranje po datumu)
// =====================================================================================
// Ova strategija sortira prijave po datumu kreiranja.
public class SortByDateStrategy : ISortStrategy
{
    public List<Report> Sort(IEnumerable<Report> reports, bool isAscending)
    {
        if (isAscending)
        {
            return reports.OrderBy(r => r.CreatedDate).ToList();
        }
        else
        {
            return reports.OrderByDescending(r => r.CreatedDate).ToList();
        }
    }
}
