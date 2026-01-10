import { describe, it, expect } from "vitest"
import { isValidImageUrl, sanitizeImageUrl, isDangerousUrl } from "./security"

describe("security utilities", () => {
  describe("isValidImageUrl", () => {
    it("returns true for valid Supabase URLs", () => {
      expect(isValidImageUrl("https://abc.supabase.co/storage/v1/object/photo.jpg")).toBe(true)
      expect(isValidImageUrl("https://myproject.supabase.co/storage/photo.png")).toBe(true)
    })

    it("returns true for localhost in development", () => {
      expect(isValidImageUrl("http://localhost:3000/image.jpg")).toBe(true)
      expect(isValidImageUrl("http://127.0.0.1:5173/photo.png")).toBe(true)
    })

    it("returns true for OpenStreetMap tiles", () => {
      expect(isValidImageUrl("https://a.tile.openstreetmap.org/12/2148/1363.png")).toBe(true)
    })

    it("returns true for Leaflet CDN", () => {
      expect(
        isValidImageUrl(
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png"
        )
      ).toBe(true)
    })

    it("returns false for javascript: URLs", () => {
      expect(isValidImageUrl("javascript:alert(1)")).toBe(false)
      expect(isValidImageUrl("javascript:void(0)")).toBe(false)
      expect(isValidImageUrl("JAVASCRIPT:alert('xss')")).toBe(false)
    })

    it("returns false for data: URLs", () => {
      expect(isValidImageUrl("data:image/png;base64,iVBORw0KGgo=")).toBe(false)
      expect(isValidImageUrl("data:text/html,<script>alert(1)</script>")).toBe(false)
    })

    it("returns false for untrusted domains", () => {
      expect(isValidImageUrl("https://evil.com/image.jpg")).toBe(false)
      expect(isValidImageUrl("https://malicious-site.org/photo.png")).toBe(false)
    })

    it("returns false for null/undefined/empty", () => {
      expect(isValidImageUrl(null)).toBe(false)
      expect(isValidImageUrl(undefined)).toBe(false)
      expect(isValidImageUrl("")).toBe(false)
    })

    it("returns false for invalid URLs", () => {
      expect(isValidImageUrl("not-a-url")).toBe(false)
      expect(isValidImageUrl("://missing-protocol")).toBe(false)
    })
  })

  describe("sanitizeImageUrl", () => {
    it("returns original URL if valid", () => {
      const url = "https://abc.supabase.co/storage/photo.jpg"
      expect(sanitizeImageUrl(url)).toBe(url)
    })

    it("returns fallback for invalid URLs", () => {
      expect(sanitizeImageUrl("javascript:alert(1)")).toBe("/placeholder-image.svg")
      expect(sanitizeImageUrl("https://evil.com/img.jpg")).toBe("/placeholder-image.svg")
    })

    it("returns custom fallback when provided", () => {
      expect(sanitizeImageUrl("javascript:alert(1)", "/custom-fallback.png")).toBe(
        "/custom-fallback.png"
      )
    })

    it("returns fallback for null/undefined", () => {
      expect(sanitizeImageUrl(null)).toBe("/placeholder-image.svg")
      expect(sanitizeImageUrl(undefined)).toBe("/placeholder-image.svg")
    })
  })

  describe("isDangerousUrl", () => {
    it("returns true for javascript: URLs", () => {
      expect(isDangerousUrl("javascript:alert(1)")).toBe(true)
      expect(isDangerousUrl("JAVASCRIPT:void(0)")).toBe(true)
    })

    it("returns true for data: URLs", () => {
      expect(isDangerousUrl("data:text/html,test")).toBe(true)
    })

    it("returns true for vbscript: URLs", () => {
      expect(isDangerousUrl("vbscript:msgbox")).toBe(true)
    })

    it("returns true for file: URLs", () => {
      expect(isDangerousUrl("file:///etc/passwd")).toBe(true)
    })

    it("returns false for safe URLs", () => {
      expect(isDangerousUrl("https://example.com")).toBe(false)
      expect(isDangerousUrl("http://localhost:3000")).toBe(false)
    })

    it("returns false for null/undefined", () => {
      expect(isDangerousUrl(null)).toBe(false)
      expect(isDangerousUrl(undefined)).toBe(false)
    })
  })
})
