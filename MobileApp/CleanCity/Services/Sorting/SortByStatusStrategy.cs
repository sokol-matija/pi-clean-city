using CleanCity.Models;

namespace CleanCity.Services.Sorting;

// =====================================================================================
// #3: OBRAZAC PONAŠANJA: STRATEGY (Konkretna implementacija - sortiranje po statusu)
// =====================================================================================
// Ova strategija sortira prijave abecedno po njihovom statusu.
public class SortByStatusStrategy : ISortStrategy
{
    public List<Report> Sort(IEnumerable<Report> reports, bool isAscending)
    {
        if (isAscending)
        {
            return reports.OrderBy(r => r.Status.ToString()).ToList();
        }
        else
        {
            return reports.OrderByDescending(r => r.Status.ToString()).ToList();
        }
    }
}
