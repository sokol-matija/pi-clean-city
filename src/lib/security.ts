/**
 * Security utilities for sanitizing user input and preventing XSS attacks.
 *
 * These utilities help protect against DOM-based XSS vulnerabilities
 * by validating and sanitizing data before it's used in the DOM.
 */

/**
 * List of allowed URL protocols for image sources.
 * Only HTTPS and HTTP (for development) are allowed.
 * This prevents javascript:, data:, and other potentially dangerous schemes.
 */
const ALLOWED_IMAGE_PROTOCOLS = ["https:", "http:"]

/**
 * List of trusted domains for image sources.
 * Images from these domains are considered safe.
 */
const TRUSTED_IMAGE_DOMAINS = [
  // Supabase storage
  ".supabase.co",
  // Local development
  "localhost",
  "127.0.0.1",
  // OpenStreetMap tiles
  ".tile.openstreetmap.org",
  // Leaflet CDN
  "cdnjs.cloudflare.com",
]

/**
 * Validates if a URL is safe to use as an image source.
 *
 * This function prevents XSS attacks by ensuring:
 * 1. The URL uses an allowed protocol (http/https only)
 * 2. The URL points to a trusted domain
 *
 * @param url - The URL to validate
 * @returns true if the URL is safe, false otherwise
 *
 * @example
 * isValidImageUrl("https://abc.supabase.co/storage/v1/object/photo.jpg") // true
 * isValidImageUrl("javascript:alert(1)") // false
 * isValidImageUrl("data:image/png;base64,...") // false
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false

  try {
    const parsed = new URL(url)

    // Check protocol
    if (!ALLOWED_IMAGE_PROTOCOLS.includes(parsed.protocol)) {
      return false
    }

    // Check if domain is trusted
    const hostname = parsed.hostname.toLowerCase()
    const isTrusted = TRUSTED_IMAGE_DOMAINS.some((domain) => {
      if (domain.startsWith(".")) {
        // Wildcard domain (e.g., ".supabase.co" matches "abc.supabase.co")
        return hostname.endsWith(domain) || hostname === domain.slice(1)
      }
      return hostname === domain
    })

    return isTrusted
  } catch {
    // Invalid URL
    return false
  }
}

/**
 * Sanitizes a URL for safe use as an image source.
 *
 * If the URL is valid and trusted, returns it unchanged.
 * If the URL is invalid or untrusted, returns a fallback placeholder.
 *
 * @param url - The URL to sanitize
 * @param fallback - Optional fallback URL/path for invalid URLs
 * @returns A safe URL to use as image source
 *
 * @example
 * sanitizeImageUrl("https://abc.supabase.co/photo.jpg") // "https://abc.supabase.co/photo.jpg"
 * sanitizeImageUrl("javascript:alert(1)") // "/placeholder-image.svg"
 */
export function sanitizeImageUrl(
  url: string | null | undefined,
  fallback: string = "/placeholder-image.svg"
): string {
  if (isValidImageUrl(url)) {
    return url as string
  }
  return fallback
}

/**
 * Checks if a URL uses a potentially dangerous protocol.
 *
 * @param url - The URL to check
 * @returns true if the URL uses a dangerous protocol
 */
export function isDangerousUrl(url: string | null | undefined): boolean {
  if (!url) return false

  const dangerousProtocols = ["javascript:", "data:", "vbscript:", "file:"]
  const lowerUrl = url.toLowerCase().trim()

  return dangerousProtocols.some((protocol) => lowerUrl.startsWith(protocol))
}
