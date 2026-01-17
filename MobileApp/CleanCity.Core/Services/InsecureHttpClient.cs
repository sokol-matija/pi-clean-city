
namespace CleanCity.Core.Services;

public static class InsecureHttpClient
{
    //// =====================================================================================
    //// SIGURAN KOD
    //// =====================================================================================
    //public static HttpClient CreateSecureClient()
    //{
    //    return new HttpClient();
    //}

    // =====================================================================================
    // NESIGURAN KOD - SONARQUBE VULNERABILITY S4830
    // =====================================================================================
    public static HttpClient CreateInsecureClient()
    {
        var handler = new HttpClientHandler
        {
            // The following line disables server certificate validation,
            // making the connection vulnerable to man-in-the-middle attacks.
            ServerCertificateCustomValidationCallback =
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
        };

        return new HttpClient(handler);
    }
}
