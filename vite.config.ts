import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { visualizer } from "rollup-plugin-visualizer"

/**
 * Security Headers Configuration
 *
 * These headers protect against common web vulnerabilities:
 * - CSP: Prevents XSS by whitelisting content sources
 * - X-Frame-Options: Prevents clickjacking attacks
 * - X-Content-Type-Options: Prevents MIME-type sniffing
 *
 * Note: For production, these should also be configured on your
 * web server (nginx/apache) or CDN (Cloudflare/CloudFront)
 */
const securityHeaders = {
  // Content Security Policy - whitelist of allowed content sources
  // NOTE: 'unsafe-inline' and 'unsafe-eval' are required for Vite/React development mode
  // For production, consider using nonces or hashes instead (see: https://vitejs.dev/guide/features.html#content-security-policy)
  "Content-Security-Policy": [
    "default-src 'self'",
    // Scripts: self + inline/eval required for React HMR and Vite dev server
    // In production build, eval is not used but inline may still be needed
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    // Styles: inline needed for CSS-in-JS, Tailwind, and component styles
    "style-src 'self' 'unsafe-inline'",
    // Images: self + Supabase storage + Leaflet CDN + OpenStreetMap tiles + data URIs for icons
    "img-src 'self' data: blob: https://*.supabase.co https://cdnjs.cloudflare.com https://*.tile.openstreetmap.org",
    // Fonts: self + common font CDNs
    "font-src 'self' data:",
    // Connect: self + Supabase API + ntfy.sh for notifications
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://ntfy.sh",
    // Frame ancestors: prevent embedding (clickjacking protection)
    "frame-ancestors 'none'",
    // Base URI: restrict base tag
    "base-uri 'self'",
    // Form action: restrict form submissions
    "form-action 'self'",
  ].join("; "),

  // Prevent clickjacking - deny all framing
  "X-Frame-Options": "DENY",

  // Prevent MIME-type sniffing
  "X-Content-Type-Options": "nosniff",

  // Enable browser XSS filter (legacy, but still useful for older browsers)
  "X-XSS-Protection": "1; mode=block",

  // Control referrer information
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions Policy - restrict browser features
  "Permissions-Policy": "geolocation=(self), camera=(), microphone=()",

  // HSTS - Force HTTPS connections (only effective in production with HTTPS)
  // max-age=31536000 = 1 year, includeSubDomains for all subdomains
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",

  // Prevent caching of sensitive data
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: securityHeaders,
  },
  preview: {
    headers: securityHeaders,
  },
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          filename: "dist/stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
      ],
    },
  },
})
