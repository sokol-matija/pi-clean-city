import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  NewPostDecorator,
  PopularPostDecorator,
  TrendingPostDecorator,
  VerifiedAuthorDecorator,
  PostDecoratorChain,
  createDefaultDecoratorChain,
  createMinimalDecoratorChain,
} from "./PostDecorator"
import type { PostWithProfile } from "../../hooks/usePosts"

// Helper za kreiranje mock posta
function createMockPost(overrides: Partial<PostWithProfile> = {}): PostWithProfile {
  return {
    id: 1,
    title: "Test Post",
    content: "Test content for testing",
    created_at: "2026-01-08T10:00:00Z",
    userId: "user-123",
    imageId: null,
    averageRating: 3.0,
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

describe("PostDecorator", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-08T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("NewPostDecorator", () => {
    it("should add 'new' badge to posts within threshold hours", () => {
      const decorator = new NewPostDecorator(24)
      const post = createMockPost({ created_at: "2026-01-08T10:00:00Z" }) // 2 sata emoji

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(1)
      expect(result.badges[0].type).toBe("new")
      expect(result.badges[0].label).toBe("Novo")
      expect(result.badges[0].color).toBe("bg-green-500")
      expect(result.priority).toBe(1)
    })

    it("should not add badge to posts older than threshold", () => {
      const decorator = new NewPostDecorator(24)
      const post = createMockPost({ created_at: "2026-01-06T10:00:00Z" }) // 50+ sati emoji

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(0)
      expect(result.priority).toBe(0)
    })

    it("should respect custom threshold", () => {
      const decorator = new NewPostDecorator(1) // samo 1 sat
      const post = createMockPost({ created_at: "2026-01-08T10:00:00Z" }) // 2 sata emoji

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(0)
    })

    it("should use default 24 hours threshold", () => {
      const decorator = new NewPostDecorator()
      const post = createMockPost({ created_at: "2026-01-08T00:00:00Z" }) // 12 sati emoji

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(1)
      expect(result.badges[0].type).toBe("new")
    })
  })

  describe("PopularPostDecorator", () => {
    it("should add 'popular' badge to posts with high rating", () => {
      const decorator = new PopularPostDecorator(4.0)
      const post = createMockPost({ averageRating: 4.5 })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(1)
      expect(result.badges[0].type).toBe("popular")
      expect(result.badges[0].label).toBe("Popularno")
      expect(result.badges[0].color).toBe("bg-yellow-500")
      expect(result.priority).toBe(2)
      expect(result.isHighlighted).toBe(true)
    })

    it("should not add badge to posts below rating threshold", () => {
      const decorator = new PopularPostDecorator(4.0)
      const post = createMockPost({ averageRating: 3.5 })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(0)
      expect(result.isHighlighted).toBe(false)
    })

    it("should not add badge when rating is null", () => {
      const decorator = new PopularPostDecorator(4.0)
      const post = createMockPost({ averageRating: null })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(0)
    })

    it("should add badge when rating exactly matches threshold", () => {
      const decorator = new PopularPostDecorator(4.0)
      const post = createMockPost({ averageRating: 4.0 })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(1)
      expect(result.badges[0].type).toBe("popular")
    })

    it("should use default 4.0 threshold", () => {
      const decorator = new PopularPostDecorator()
      const post = createMockPost({ averageRating: 4.0 })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(1)
    })
  })

  describe("TrendingPostDecorator", () => {
    it("should add 'trending' badge to recent posts with good rating", () => {
      const decorator = new TrendingPostDecorator()
      const post = createMockPost({
        created_at: "2026-01-07T12:00:00Z", // 24 sata emoji
        averageRating: 4.0,
      })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(1)
      expect(result.badges[0].type).toBe("trending")
      expect(result.badges[0].label).toBe("U trendu")
      expect(result.badges[0].color).toBe("bg-orange-500")
      expect(result.priority).toBe(3)
      expect(result.isHighlighted).toBe(true)
    })

    it("should not add badge to old posts even with good rating", () => {
      const decorator = new TrendingPostDecorator()
      const post = createMockPost({
        created_at: "2026-01-01T12:00:00Z", // 7 dana emoji
        averageRating: 4.5,
      })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(0)
    })

    it("should not add badge to recent posts with low rating", () => {
      const decorator = new TrendingPostDecorator()
      const post = createMockPost({
        created_at: "2026-01-08T10:00:00Z",
        averageRating: 2.0,
      })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(0)
    })

    it("should not add badge when rating is null", () => {
      const decorator = new TrendingPostDecorator()
      const post = createMockPost({
        created_at: "2026-01-08T10:00:00Z",
        averageRating: null,
      })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(0)
    })

    it("should add badge at exactly 3.5 rating threshold", () => {
      const decorator = new TrendingPostDecorator()
      const post = createMockPost({
        created_at: "2026-01-08T10:00:00Z",
        averageRating: 3.5,
      })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(1)
      expect(result.badges[0].type).toBe("trending")
    })
  })

  describe("VerifiedAuthorDecorator", () => {
    it("should add 'verified' badge for verified users", () => {
      const verifiedUsers = ["user-123", "user-456"]
      const decorator = new VerifiedAuthorDecorator(verifiedUsers)
      const post = createMockPost({ userId: "user-123" })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(1)
      expect(result.badges[0].type).toBe("verified")
      expect(result.badges[0].label).toBe("Verificirano")
      expect(result.badges[0].color).toBe("bg-blue-500")
    })

    it("should not add badge for non-verified users", () => {
      const verifiedUsers = ["user-456", "user-789"]
      const decorator = new VerifiedAuthorDecorator(verifiedUsers)
      const post = createMockPost({ userId: "user-123" })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(0)
    })

    it("should not add badge when userId is null", () => {
      const verifiedUsers = ["user-123"]
      const decorator = new VerifiedAuthorDecorator(verifiedUsers)
      const post = createMockPost({ userId: null })

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(0)
    })

    it("should work with empty verified users list", () => {
      const decorator = new VerifiedAuthorDecorator([])
      const post = createMockPost()

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(0)
    })

    it("should use default empty list when not specified", () => {
      const decorator = new VerifiedAuthorDecorator()
      const post = createMockPost()

      const result = decorator.decorate(post)

      expect(result.badges).toHaveLength(0)
    })
  })

  describe("PostDecoratorChain", () => {
    it("should allow chaining decorators with addDecorator", () => {
      const chain = new PostDecoratorChain()
        .addDecorator(new NewPostDecorator())
        .addDecorator(new PopularPostDecorator())

      expect(chain).toBeInstanceOf(PostDecoratorChain)
    })

    it("should combine badges from multiple decorators", () => {
      const chain = new PostDecoratorChain()
        .addDecorator(new NewPostDecorator(24))
        .addDecorator(new PopularPostDecorator(4.0))

      const post = createMockPost({
        created_at: "2026-01-08T10:00:00Z",
        averageRating: 4.5,
      })

      const result = chain.decorate(post)

      expect(result.badges).toHaveLength(2)
      expect(result.badges.map((b) => b.type)).toContain("new")
      expect(result.badges.map((b) => b.type)).toContain("popular")
    })

    it("should use maximum priority from all decorators", () => {
      const chain = new PostDecoratorChain()
        .addDecorator(new NewPostDecorator(24)) // priority 1
        .addDecorator(new TrendingPostDecorator()) // priority 3

      const post = createMockPost({
        created_at: "2026-01-08T10:00:00Z",
        averageRating: 4.0,
      })

      const result = chain.decorate(post)

      expect(result.priority).toBe(3)
    })

    it("should set isHighlighted if any decorator highlights", () => {
      const chain = new PostDecoratorChain()
        .addDecorator(new NewPostDecorator(24)) // ne highlighta
        .addDecorator(new PopularPostDecorator(4.0)) // highlighta

      const post = createMockPost({
        created_at: "2026-01-08T10:00:00Z",
        averageRating: 4.5,
      })

      const result = chain.decorate(post)

      expect(result.isHighlighted).toBe(true)
    })

    it("should return base decorated post when no decorators match", () => {
      const chain = new PostDecoratorChain()
        .addDecorator(new NewPostDecorator(1)) // 1 sat, post je stariji
        .addDecorator(new PopularPostDecorator(5.0)) // rating 5.0, post ima manje

      const post = createMockPost({
        created_at: "2026-01-07T10:00:00Z",
        averageRating: 3.0,
      })

      const result = chain.decorate(post)

      expect(result.badges).toHaveLength(0)
      expect(result.priority).toBe(0)
      expect(result.isHighlighted).toBe(false)
    })

    describe("decorateMany", () => {
      it("should decorate multiple posts", () => {
        const chain = new PostDecoratorChain().addDecorator(new NewPostDecorator(24))

        const posts = [
          createMockPost({ id: 1, created_at: "2026-01-08T10:00:00Z" }),
          createMockPost({ id: 2, created_at: "2026-01-08T11:00:00Z" }),
        ]

        const results = chain.decorateMany(posts)

        expect(results).toHaveLength(2)
        expect(results[0].id).toBe(1)
        expect(results[1].id).toBe(2)
        results.forEach((result) => {
          expect(result.badges.length).toBeGreaterThan(0)
        })
      })

      it("should return empty array for empty input", () => {
        const chain = new PostDecoratorChain().addDecorator(new NewPostDecorator())

        const results = chain.decorateMany([])

        expect(results).toHaveLength(0)
      })
    })
  })

  describe("Factory functions", () => {
    describe("createDefaultDecoratorChain", () => {
      it("should create chain with NewPost, Popular, and Trending decorators", () => {
        const chain = createDefaultDecoratorChain()
        const post = createMockPost({
          created_at: "2026-01-08T10:00:00Z",
          averageRating: 4.5,
        })

        const result = chain.decorate(post)

        // Trebao bi imati new, popular i trending badge-ove
        expect(result.badges.length).toBeGreaterThan(0)
      })
    })

    describe("createMinimalDecoratorChain", () => {
      it("should create chain with only NewPost decorator (12h threshold)", () => {
        const chain = createMinimalDecoratorChain()
        const post = createMockPost({
          created_at: "2026-01-08T10:00:00Z", // 2 sata emoji
          averageRating: 4.5,
        })

        const result = chain.decorate(post)

        // Samo new badge jer je unutar 12 sati
        expect(result.badges).toHaveLength(1)
        expect(result.badges[0].type).toBe("new")
      })

      it("should not add badge for posts older than 12 hours", () => {
        const chain = createMinimalDecoratorChain()
        const post = createMockPost({
          created_at: "2026-01-07T20:00:00Z", // 16 sati emoji
        })

        const result = chain.decorate(post)

        expect(result.badges).toHaveLength(0)
      })
    })
  })

  describe("DecoratedPost structure", () => {
    it("should preserve original post properties", () => {
      const decorator = new NewPostDecorator()
      const originalPost = createMockPost({
        id: 42,
        title: "Original Title",
        content: "Original Content",
      })

      const result = decorator.decorate(originalPost)

      expect(result.id).toBe(42)
      expect(result.title).toBe("Original Title")
      expect(result.content).toBe("Original Content")
      expect(result.user).toEqual(originalPost.user)
    })

    it("should add DecoratedPost specific properties", () => {
      const decorator = new NewPostDecorator()
      const post = createMockPost()

      const result = decorator.decorate(post)

      expect(result).toHaveProperty("badges")
      expect(result).toHaveProperty("priority")
      expect(result).toHaveProperty("isHighlighted")
      expect(Array.isArray(result.badges)).toBe(true)
      expect(typeof result.priority).toBe("number")
      expect(typeof result.isHighlighted).toBe("boolean")
    })
  })
})
