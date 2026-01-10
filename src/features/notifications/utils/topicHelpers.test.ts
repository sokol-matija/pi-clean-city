import { describe, it, expect } from "vitest"
import { getUserTopic } from "./topicHelpers"

describe("getUserTopic", () => {
  describe("basic formatting", () => {
    it("should create topic with prefix and username", () => {
      const result = getUserTopic("john")
      expect(result).toBe("pi-clean-city-john")
    })

    it("should convert username to lowercase", () => {
      const result = getUserTopic("JOHN")
      expect(result).toBe("pi-clean-city-john")
    })
  })

  describe("whitespace handling", () => {
    it("should replace spaces with hyphens", () => {
      const result = getUserTopic("John Doe")
      expect(result).toBe("pi-clean-city-john-doe")
    })

    it("should replace multiple spaces with single hyphen", () => {
      const result = getUserTopic("John   Doe")
      expect(result).toBe("pi-clean-city-john-doe")
    })

    it("should convert leading and trailing spaces to hyphens", () => {
      const result = getUserTopic("  john  ")
      // Note: The function doesn't trim spaces, it converts them to hyphens
      expect(result).toBe("pi-clean-city--john-")
    })
  })

  describe("special character handling", () => {
    it("should remove special characters except hyphens, underscores, and dots", () => {
      const result = getUserTopic("john@doe!")
      expect(result).toBe("pi-clean-city-johndoe")
    })

    it("should keep allowed characters (hyphens, underscores, dots)", () => {
      const result = getUserTopic("john-doe_123.test")
      expect(result).toBe("pi-clean-city-john-doe_123.test")
    })

    it("should remove emoji and unicode characters", () => {
      const result = getUserTopic("john😀doe")
      expect(result).toBe("pi-clean-city-johndoe")
    })
  })

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const result = getUserTopic("")
      expect(result).toBe("pi-clean-city-")
    })

    it("should handle only special characters", () => {
      const result = getUserTopic("@#$%")
      expect(result).toBe("pi-clean-city-")
    })

    it("should handle alphanumeric usernames", () => {
      const result = getUserTopic("user123")
      expect(result).toBe("pi-clean-city-user123")
    })

    it("should handle complex mixed format", () => {
      const result = getUserTopic("John Doe 123@Test!.User")
      expect(result).toBe("pi-clean-city-john-doe-123test.user")
    })
  })
})
