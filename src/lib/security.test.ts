import { describe, it, expect } from "vitest"
import { isValidImageUrl, sanitizeImageUrl, isDangerousUrl, sanitizeRedirectPath } from "./security"

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

  describe("sanitizeRedirectPath", () => {
    describe("valid relative paths", () => {
      it("allows simple relative paths", () => {
        expect(sanitizeRedirectPath("/dashboard")).toBe("/dashboard")
        expect(sanitizeRedirectPath("/settings")).toBe("/settings")
        expect(sanitizeRedirectPath("/")).toBe("/")
      })

      it("allows paths with query parameters", () => {
        expect(sanitizeRedirectPath("/search?q=test")).toBe("/search?q=test")
        expect(sanitizeRedirectPath("/settings?tab=profile")).toBe("/settings?tab=profile")
      })

      it("allows paths with hash fragments", () => {
        expect(sanitizeRedirectPath("/page#section")).toBe("/page#section")
        expect(sanitizeRedirectPath("/docs#introduction")).toBe("/docs#introduction")
      })

      it("allows deeply nested paths", () => {
        expect(sanitizeRedirectPath("/a/b/c/d/e")).toBe("/a/b/c/d/e")
        expect(sanitizeRedirectPath("/users/123/settings/profile")).toBe(
          "/users/123/settings/profile"
        )
      })
    })

    describe("open redirect prevention", () => {
      it("rejects absolute URLs with http protocol", () => {
        expect(sanitizeRedirectPath("http://evil.com")).toBe("/")
        expect(sanitizeRedirectPath("http://example.com/page")).toBe("/")
      })

      it("rejects absolute URLs with https protocol", () => {
        expect(sanitizeRedirectPath("https://evil.com")).toBe("/")
        expect(sanitizeRedirectPath("https://malicious.org/steal")).toBe("/")
      })

      it("rejects protocol-relative URLs", () => {
        expect(sanitizeRedirectPath("//evil.com")).toBe("/")
        expect(sanitizeRedirectPath("//evil.com/path")).toBe("/")
        expect(sanitizeRedirectPath("///evil.com")).toBe("/")
      })

      it("rejects paths not starting with /", () => {
        expect(sanitizeRedirectPath("evil.com")).toBe("/")
        expect(sanitizeRedirectPath("example.com/page")).toBe("/")
        expect(sanitizeRedirectPath("relative-path")).toBe("/")
      })

      it("rejects paths containing protocol schemes", () => {
        expect(sanitizeRedirectPath("/path/http://evil.com")).toBe("/")
        expect(sanitizeRedirectPath("/page?redirect=https://evil.com")).toBe("/")
        expect(sanitizeRedirectPath("/javascript:alert(1)")).toBe("/")
      })

      it("rejects javascript: protocol", () => {
        expect(sanitizeRedirectPath("javascript:alert(1)")).toBe("/")
        expect(sanitizeRedirectPath("JAVASCRIPT:void(0)")).toBe("/")
      })

      it("rejects data: protocol", () => {
        expect(sanitizeRedirectPath("data:text/html,<script>alert(1)</script>")).toBe("/")
      })

      it("rejects vbscript: protocol", () => {
        expect(sanitizeRedirectPath("vbscript:msgbox")).toBe("/")
      })

      it("rejects file: protocol", () => {
        expect(sanitizeRedirectPath("file:///etc/passwd")).toBe("/")
      })

      it("rejects ftp: protocol", () => {
        expect(sanitizeRedirectPath("ftp://files.example.com")).toBe("/")
      })
    })

    describe("edge cases", () => {
      it("returns / for null", () => {
        expect(sanitizeRedirectPath(null)).toBe("/")
      })

      it("returns / for undefined", () => {
        expect(sanitizeRedirectPath(undefined)).toBe("/")
      })

      it("returns / for empty string", () => {
        expect(sanitizeRedirectPath("")).toBe("/")
      })

      it("trims whitespace and validates", () => {
        expect(sanitizeRedirectPath("  /dashboard  ")).toBe("/dashboard")
        expect(sanitizeRedirectPath(" https://evil.com ")).toBe("/")
      })

      it("handles case-insensitive protocol detection", () => {
        expect(sanitizeRedirectPath("/HTTP://evil.com")).toBe("/")
        expect(sanitizeRedirectPath("/HtTpS://evil.com")).toBe("/")
      })
    })
  })
})
