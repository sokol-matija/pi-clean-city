export interface SecurityHeader {
  key: string
  value: string
}

export const securityHeaders: SecurityHeader[] = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; " +
      "script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; " +
      "style-src 'self' https://fonts.googleapis.com; " +
      "img-src 'self' https://*.supabase.co https://*.tile.openstreetmap.org https://cdnjs.cloudflare.com data: blob:; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
      "object-src 'none'; " +
      "form-action 'self'; " +
      "base-uri 'self';" +
      "frame-ancestors 'none';",
  },
]
