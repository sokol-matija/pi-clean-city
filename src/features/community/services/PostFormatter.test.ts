import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  StandardPostFormatter,
  RelativeTimePostFormatter,
  CompactPostFormatter,
  createFormatter,
} from "./PostFormatter"
import type { PostWithProfile } from "../hooks/usePosts"

// Helper za kreiranje mock posta
function createMockPost(overrides: Partial<PostWithProfile> = {}): PostWithProfile {
  return {
    id: 1,
    title: "Test post title",
    content: "This is the test post content for testing purposes.",
    created_at: "2026-01-08T10:00:00Z",
    userId: "user-123",
    imageId: null,
    averageRating: 4.5,
    user: {
      id: "user-123",
      username: "testuser",
      email: "test@example.com",
      role: "citizen",
      avatar_url: "https://example.com/avatar.jpg",
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z",
    },
    ...overrides,
  }
}

describe("PostFormatter", () => {
  describe("StandardPostFormatter", () => {
    const formatter = new StandardPostFormatter()

    describe("formatDate", () => {
      it("should format date in Croatian locale", () => {
        const result = formatter.formatDate("2026-01-08T10:00:00Z")

        // Provjera da sadrži dan, mjesec i godinu
        expect(result.length).toBeGreaterThan(0)
        expect(result).toContain("2026")
      })

      it("should handle different date formats", () => {
        const result = formatter.formatDate("2025-06-15T14:30:00Z")

        expect(result).toContain("2025")
      })
    })

    describe("formatContent", () => {
      it("should return full content when under max length", () => {
        const content = "Short content"
        const result = formatter.formatContent(content, 100)

        expect(result).toBe(content)
      })

      it("should truncate content when over max length", () => {
        const content = "This is a very long content that should be truncated"
        const result = formatter.formatContent(content, 20)

        expect(result.length).toBeLessThanOrEqual(23) // 20 + "..."
        expect(result).toContain("...")
      })

      it("should return full content when no max length specified", () => {
        const content = "Some content without limit"
        const result = formatter.formatContent(content)

        expect(result).toBe(content)
      })
    })

    describe("formatPost", () => {
      it("should format all post fields correctly", () => {
        const post = createMockPost()
        const result = formatter.formatPost(post)

        expect(result.id).toBe(1)
        expect(result.title).toBe("Test post title")
        expect(result.authorName).toBe("testuser")
        expect(result.authorAvatar).toBe("https://example.com/avatar.jpg")
        expect(result.formattedDate).toBeDefined()
        expect(result.excerpt).toBeDefined()
      })

      it("should use Anonymous when user is null", () => {
        const post = createMockPost({ user: null })
        const result = formatter.formatPost(post)

        expect(result.authorName).toBe("Anonymous")
        expect(result.authorAvatar).toBe("/default-avatar.jpg")
      })

      it("should use Anonymous when username is null", () => {
        const post = createMockPost({
          user: {
            id: "user-123",
            username: null,
            email: "test@example.com",
            role: "citizen",
            avatar_url: null,
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
        })
        const result = formatter.formatPost(post)

        expect(result.authorName).toBe("Anonymous")
        expect(result.authorAvatar).toBe("/default-avatar.jpg")
      })

      it("should create excerpt from content", () => {
        const longContent = "A".repeat(200)
        const post = createMockPost({ content: longContent })
        const result = formatter.formatPost(post)

        expect(result.excerpt.length).toBeLessThanOrEqual(103) // iz createExcerpt-a daje 100 + "..." tj. 103
      })
    })
  })

  describe("RelativeTimePostFormatter", () => {
    const formatter = new RelativeTimePostFormatter()

    describe("formatDate", () => {
      beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date("2026-01-08T12:00:00Z"))
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      it("should return 'upravo sada' for very recent posts", () => {
        const result = formatter.formatDate("2026-01-08T11:59:30Z")

        expect(result).toBe("upravo sada")
      })

      it("should return minutes for posts less than an hour old", () => {
        const result = formatter.formatDate("2026-01-08T11:30:00Z")

        expect(result).toContain("prije ")
        expect(result).toContain(" min")
        const broj = Number(result.replace("prije ", "").replace(" min", ""))
        expect(Number.isFinite(broj)).toBe(true)
        expect(broj).toBeGreaterThan(0)
      })

      it("should return hours for posts less than a day old", () => {
        const result = formatter.formatDate("2026-01-08T08:00:00Z")

        expect(result).toContain("prije ")
        expect(result).toContain(" h")
        const broj = Number(result.replace("prije ", "").replace(" h", ""))
        expect(Number.isFinite(broj)).toBe(true)
        expect(broj).toBeGreaterThan(0)
      })

      it("should return days for posts less than a week old", () => {
        const result = formatter.formatDate("2026-01-06T12:00:00Z")

        expect(result).toContain("prije ")
        expect(result).toContain(" dana")
        const broj = Number(result.replace("prije ", "").replace(" dana", ""))
        expect(Number.isFinite(broj)).toBe(true)
        expect(broj).toBeGreaterThan(0)
      })

      it("should return formatted date for older posts", () => {
        const result = formatter.formatDate("2025-12-01T12:00:00Z")

        expect(result.length).toBeGreaterThan(0)
      })
    })

    describe("formatContent", () => {
      it("should truncate long content", () => {
        const content = "A".repeat(100)
        const result = formatter.formatContent(content, 50)

        expect(result.length).toBeLessThanOrEqual(53)
        expect(result).toContain("...")
      })
    })

    describe("formatPost", () => {
      beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date("2026-01-08T12:00:00Z"))
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      it("should format post with relative time", () => {
        const post = createMockPost({ created_at: "2026-01-08T10:00:00Z" })
        const result = formatter.formatPost(post)

        expect(result.formattedDate).toContain("prije ")
        expect(result.formattedDate).toContain(" h")
        const broj = Number(result.formattedDate.replace("prije ", "").replace(" h", ""))
        expect(Number.isFinite(broj)).toBe(true)
        expect(broj).toBeGreaterThan(0)
      })

      it("should use Anonimno for null user", () => {
        const post = createMockPost({ user: null })
        const result = formatter.formatPost(post)

        expect(result.authorName).toBe("Anonimno")
      })
    })
  })

  describe("CompactPostFormatter", () => {
    const formatter = new CompactPostFormatter()

    describe("formatDate", () => {
      it("should return short date format", () => {
        const result = formatter.formatDate("2026-01-08T10:00:00Z")

        // Bit ceformat kao 08.01.
        expect(result).toContain("08")
        expect(result).toContain("01")
      })
    })

    describe("formatContent", () => {
      it("should create compact excerpt with default 50 chars", () => {
        const content = "A".repeat(100)
        const result = formatter.formatContent(content)

        expect(result.length).toBeLessThanOrEqual(53)
      })

      it("should respect custom max length", () => {
        const content = "A".repeat(100)
        const result = formatter.formatContent(content, 30)

        expect(result.length).toBeLessThanOrEqual(33)
      })
    })

    describe("formatPost", () => {
      it("should truncate long titles", () => {
        const longTitle = "A".repeat(50)
        const post = createMockPost({ title: longTitle })
        const result = formatter.formatPost(post)

        expect(result.title.length).toBeLessThanOrEqual(33)
        expect(result.title).toContain("...")
      })

      it("should not truncate short titles", () => {
        const shortTitle = "Short"
        const post = createMockPost({ title: shortTitle })
        const result = formatter.formatPost(post)

        expect(result.title).toBe(shortTitle)
      })

      it("should truncate long usernames", () => {
        const post = createMockPost({
          user: {
            id: "user-123",
            username: "verylongusername123",
            email: "test@example.com",
            role: "citizen",
            avatar_url: null,
            created_at: "2025-01-01T00:00:00Z",
            updated_at: "2025-01-01T00:00:00Z",
          },
        })
        const result = formatter.formatPost(post)

        expect(result.authorName.length).toBeLessThanOrEqual(10)
      })

      it("should use Anon for null user", () => {
        const post = createMockPost({ user: null })
        const result = formatter.formatPost(post)

        expect(result.authorName).toBe("Anon")
      })
    })
  })

  describe("createFormatter factory", () => {
    it("should create StandardPostFormatter for standard type", () => {
      const formatter = createFormatter("standard")

      expect(formatter).toBeInstanceOf(StandardPostFormatter)
    })

    it("should create RelativeTimePostFormatter for relative type", () => {
      const formatter = createFormatter("relative")

      expect(formatter).toBeInstanceOf(RelativeTimePostFormatter)
    })

    it("should create CompactPostFormatter for compact type", () => {
      const formatter = createFormatter("compact")

      expect(formatter).toBeInstanceOf(CompactPostFormatter)
    })

    it("should create StandardPostFormatter as default", () => {
      // @ts-expect-error <- bypass za testiranje invalid inputa
      const formatter = createFormatter("invalid")

      expect(formatter).toBeInstanceOf(StandardPostFormatter)
    })
  })
})

// afterEach na globalnoj razini za cleanup timera
import { afterEach } from "vitest"
afterEach(() => {
  vi.useRealTimers()
})
