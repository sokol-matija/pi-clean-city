import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { PostServiceManager } from "./PostServiceManager"

// Mock za SupabasePostRepository
vi.mock("../../repositories/SupabasePostRepository", () => ({
  SupabasePostRepository: class MockSupabasePostRepository {
    getAllPosts = vi.fn().mockResolvedValue([])
    getPostById = vi.fn().mockResolvedValue(null)
    createPost = vi.fn().mockResolvedValue({})
    deletePost = vi.fn().mockResolvedValue(undefined)
    updatePost = vi.fn().mockResolvedValue({})
  },
}))

// Mock za PostValidator
vi.mock("../../services/PostValidator", () => ({
  createBasicValidator: vi.fn().mockReturnValue({
    validate: vi.fn().mockReturnValue({ isValid: true, errors: [] }),
    addRule: vi.fn().mockReturnThis(),
  }),
}))

describe("PostServiceManager", () => {
  beforeEach(() => {
    // Resetamo singleton za svaki test
    // @ts-expect-error <- bypass pristup privatnoj varijabli za testiranje
    PostServiceManager.instance = null

    vi.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("Singleton pattern", () => {
    it("should return the same instance on multiple calls", () => {
      const instance1 = PostServiceManager.getInstance()
      const instance2 = PostServiceManager.getInstance()

      expect(instance1).toBe(instance2)
    })

    it("should create instance only once", () => {
      PostServiceManager.getInstance()
      PostServiceManager.getInstance()
      PostServiceManager.getInstance()

      // konzola se zove samo kod prvog kreiranja
      expect(console.log).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith("[Singleton] PostServiceManager instanca kreirana")
    })

    it("should accept initial config on first call", () => {
      const config = {
        maxPostLength: 10000,
        enableModeration: true,
      }

      const instance = PostServiceManager.getInstance(config)
      const resultConfig = instance.getConfig()

      expect(resultConfig.maxPostLength).toBe(10000)
      expect(resultConfig.enableModeration).toBe(true)
    })

    it("should ignore config on subsequent calls", () => {
      const firstConfig = { maxPostLength: 5000 }
      const secondConfig = { maxPostLength: 10000 }

      PostServiceManager.getInstance(firstConfig)
      const instance = PostServiceManager.getInstance(secondConfig)

      expect(instance.getConfig().maxPostLength).toBe(5000)
    })
  })

  describe("getConfig", () => {
    it("should return default config values", () => {
      const instance = PostServiceManager.getInstance()
      const config = instance.getConfig()

      expect(config).toEqual({
        maxPostLength: 5000,
        minTitleLength: 3,
        enableModeration: false,
        cacheDuration: 300,
      })
    })

    it("should return a copy of config (immutable)", () => {
      const instance = PostServiceManager.getInstance()
      const config1 = instance.getConfig()
      const config2 = instance.getConfig()

      expect(config1).not.toBe(config2)
      expect(config1).toEqual(config2)
    })

    it("should not allow mutation of returned config to affect internal config", () => {
      const instance = PostServiceManager.getInstance()
      const config = instance.getConfig()

      config.maxPostLength = 99999

      const freshConfig = instance.getConfig()
      expect(freshConfig.maxPostLength).toBe(5000)
    })
  })

  describe("updateConfig", () => {
    it("should update specific config values", () => {
      const instance = PostServiceManager.getInstance()

      instance.updateConfig({ maxPostLength: 8000 })

      expect(instance.getConfig().maxPostLength).toBe(8000)
      expect(instance.getConfig().minTitleLength).toBe(3) // ostalo nepromijenjeno
    })

    it("should update multiple config values at once", () => {
      const instance = PostServiceManager.getInstance()

      instance.updateConfig({
        maxPostLength: 8000,
        minTitleLength: 5,
        enableModeration: true,
      })

      const config = instance.getConfig()
      expect(config.maxPostLength).toBe(8000)
      expect(config.minTitleLength).toBe(5)
      expect(config.enableModeration).toBe(true)
    })

    it("should log config update", () => {
      const instance = PostServiceManager.getInstance()

      instance.updateConfig({ maxPostLength: 8000 })

      expect(console.log).toHaveBeenCalledWith(
        "[Singleton] Konfiguracija ažurirana:",
        expect.any(Object)
      )
    })
  })

  describe("getRepository", () => {
    it("should return repository instance", () => {
      const instance = PostServiceManager.getInstance()
      const repository = instance.getRepository()

      expect(repository).toBeDefined()
      expect(repository).toHaveProperty("getAllPosts")
      expect(repository).toHaveProperty("getPostById")
      expect(repository).toHaveProperty("createPost")
      expect(repository).toHaveProperty("deletePost")
      expect(repository).toHaveProperty("updatePost")
    })

    it("should return the same repository instance", () => {
      const instance = PostServiceManager.getInstance()
      const repo1 = instance.getRepository()
      const repo2 = instance.getRepository()

      expect(repo1).toBe(repo2)
    })
  })

  describe("getValidator", () => {
    it("should return validator instance", () => {
      const instance = PostServiceManager.getInstance()
      const validator = instance.getValidator()

      expect(validator).toBeDefined()
      expect(validator).toHaveProperty("validate")
    })

    it("should return the same validator instance", () => {
      const instance = PostServiceManager.getInstance()
      const validator1 = instance.getValidator()
      const validator2 = instance.getValidator()

      expect(validator1).toBe(validator2)
    })
  })

  describe("isPostContentValid", () => {
    it("should return true for valid content length", () => {
      const instance = PostServiceManager.getInstance()

      const result = instance.isPostContentValid("Valid content")

      expect(result).toBe(true)
    })

    it("should return false for empty content", () => {
      const instance = PostServiceManager.getInstance()

      const result = instance.isPostContentValid("")

      expect(result).toBe(false)
    })

    it("should return false for content exceeding max length", () => {
      const instance = PostServiceManager.getInstance()
      const longContent = "A".repeat(6000) // default max je 5000

      const result = instance.isPostContentValid(longContent)

      expect(result).toBe(false)
    })

    it("should respect custom maxPostLength config", () => {
      const instance = PostServiceManager.getInstance()
      instance.updateConfig({ maxPostLength: 100 })

      const shortContent = "A".repeat(50)
      const longContent = "A".repeat(150)

      expect(instance.isPostContentValid(shortContent)).toBe(true)
      expect(instance.isPostContentValid(longContent)).toBe(false)
    })

    it("should return true for content exactly at max length", () => {
      const instance = PostServiceManager.getInstance()
      instance.updateConfig({ maxPostLength: 100 })

      const exactContent = "A".repeat(100)

      expect(instance.isPostContentValid(exactContent)).toBe(true)
    })
  })

  describe("isTitleValid", () => {
    it("should return true for title meeting minimum length", () => {
      const instance = PostServiceManager.getInstance()

      const result = instance.isTitleValid("Valid Title")

      expect(result).toBe(true)
    })

    it("should return false for title below minimum length", () => {
      const instance = PostServiceManager.getInstance()

      const result = instance.isTitleValid("Hi") // default min je 3

      expect(result).toBe(false)
    })

    it("should return true for title exactly at minimum length", () => {
      const instance = PostServiceManager.getInstance()

      const result = instance.isTitleValid("Hey") // 3 znaka, default min je 3

      expect(result).toBe(true)
    })

    it("should respect custom minTitleLength config", () => {
      const instance = PostServiceManager.getInstance()
      instance.updateConfig({ minTitleLength: 5 })

      expect(instance.isTitleValid("Hey")).toBe(false) // 3 znaka
      expect(instance.isTitleValid("Hello")).toBe(true) // 5 znakova
    })

    it("should return false for empty title", () => {
      const instance = PostServiceManager.getInstance()

      const result = instance.isTitleValid("")

      expect(result).toBe(false)
    })
  })

  describe("Integration", () => {
    it("should provide synced service management", () => {
      const instance = PostServiceManager.getInstance({
        maxPostLength: 1000,
        minTitleLength: 5,
        enableModeration: true,
      })

      // provjera da svi servisi rade zajedno
      const config = instance.getConfig()
      const repository = instance.getRepository()
      const validator = instance.getValidator()

      expect(config.maxPostLength).toBe(1000)
      expect(repository).toBeDefined()
      expect(validator).toBeDefined()

      // provjera utility metoda s konfiguracijom
      expect(instance.isPostContentValid("A".repeat(500))).toBe(true)
      expect(instance.isPostContentValid("A".repeat(1500))).toBe(false)
      expect(instance.isTitleValid("Hi")).toBe(false)
      expect(instance.isTitleValid("Hello")).toBe(true)
    })
  })
})
