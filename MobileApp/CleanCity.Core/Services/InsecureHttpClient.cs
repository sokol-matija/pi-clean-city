
namespace CleanCity.Core.Services;

public static class InsecureHttpClient
{
    // =====================================================================================
    // SIGURAN KOD
    // =====================================================================================
    public static HttpClient CreateSecureClient()
    {
        return new HttpClient();
    }

}
