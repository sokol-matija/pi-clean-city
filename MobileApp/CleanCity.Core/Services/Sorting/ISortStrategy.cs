using CleanCity.Core.Models;

namespace CleanCity.Core.Services.Sorting;

// =====================================================================================
// #3: OBRAZAC PONAŠANJA: STRATEGY
// =====================================================================================
// Definira interface za algoritme sortiranja.
public interface ISortStrategy
{
    List<Report> Sort(IEnumerable<Report> reports, bool isAscending);
}
