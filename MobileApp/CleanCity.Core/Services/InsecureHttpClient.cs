
namespace CleanCity.Core.Services;

public static class InsecureHttpClient
{
    public static HttpClient CreateInsecureClient()
    {
        var handler = new HttpClientHandler
        {
            ServerCertificateCustomValidationCallback =
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
        };

        return new HttpClient(handler);
    }
}
