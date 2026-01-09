import { describe, it, expect } from "vitest"
import {
  PostValidator,
  RequiredFieldsRule,
  MinLengthRule,
  NoSpamRule,
  createBasicValidator,
  createStrictValidator,
  type CreatePostData,
} from "./PostValidator"

describe("PostValidator", () => {
  describe("RequiredFieldsRule", () => {
    const rule = new RequiredFieldsRule()

    it("validate success when title and content are provided", () => {
      const data: CreatePostData = {
        title: "Test title",
        content: "Test content",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should fail when title is empty", () => {
      const data: CreatePostData = {
        title: "",
        content: "Valid content",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Title is required")
    })

    it("should fail when content is empty", () => {
      const data: CreatePostData = {
        title: "Valid title",
        content: "",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Content is required")
    })

    it("should fail when title and content are empty", () => {
      const data: CreatePostData = {
        title: "",
        content: "",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
      expect(result.errors).toContain("Title is required")
      expect(result.errors).toContain("Content is required")
    })

    it("should fail when title is only space", () => {
      const data: CreatePostData = {
        title: "   ",
        content: "Valid content",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Title is required")
    })

    it("have correct rule name", () => {
      expect(rule.ruleName).toBe("RequiredFields")
    })
  })

  describe("MinLengthRule", () => {
    it("validate sucess when lengths meet minimum requirements", () => {
      const rule = new MinLengthRule(3, 10)
      const data: CreatePostData = {
        title: "Test",
        content: "This is valid content",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should fail when title is too short", () => {
      const rule = new MinLengthRule(5, 10)
      const data: CreatePostData = {
        title: "Hi",
        content: "This is valid content",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Title must be at least 5 characters")
    })

    it("should fail when content is too short", () => {
      const rule = new MinLengthRule(3, 20)
      const data: CreatePostData = {
        title: "Valid title",
        content: "Short",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Content must be at least 20 characters")
    })

    it("should use default values when not specified", () => {
      const rule = new MinLengthRule()
      const data: CreatePostData = {
        title: "Hi",
        content: "Short",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Title must be at least 3 characters")
      expect(result.errors).toContain("Content must be at least 10 characters")
    })

    it("should have correct rule name", () => {
      const rule = new MinLengthRule()
      expect(rule.ruleName).toBe("MinLength")
    })
  })

  describe("NoSpamRule", () => {
    const rule = new NoSpamRule()

    it("should validate success when no spam keywords are present", () => {
      const data: CreatePostData = {
        title: "Legitimate post",
        content: "Post about Zagreb community issues.",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should fail when content contains spam keyword", () => {
      const data: CreatePostData = {
        title: "Normal title",
        content: "Click here for amazing deals!",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.includes("click here"))).toBe(true)
    })

    it("should fail when title contains spam keyword", () => {
      const data: CreatePostData = {
        title: "Free Money buddy!",
        content: "Normal content here.",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.includes("free money"))).toBe(true)
    })

    it("should detect spam keyword case-insensitively", () => {
      const data: CreatePostData = {
        title: "BUY NOW special offer",
        content: "Limited time only.",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.some((e) => e.includes("buy now"))).toBe(true)
    })

    it("should detect multiple spam keywords", () => {
      const data: CreatePostData = {
        title: "Spam title",
        content: "Click here for free money and buy now!",
      }

      const result = rule.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })

    it("should have correct rule name", () => {
      expect(rule.ruleName).toBe("NoSpam")
    })
  })

  describe("PostValidator class", () => {
    it("should return valid when no rules are added", () => {
      const validator = new PostValidator()
      const data: CreatePostData = {
        title: "",
        content: "",
      }

      const result = validator.validate(data)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should chain rules with addRule method", () => {
      const validator = new PostValidator()
        .addRule(new RequiredFieldsRule())
        .addRule(new MinLengthRule(3, 10))

      expect(validator).toBeInstanceOf(PostValidator)
    })

    it("should aggregate errors from multiple rules", () => {
      const validator = new PostValidator()
        .addRule(new RequiredFieldsRule())
        .addRule(new MinLengthRule(5, 10))

      const data: CreatePostData = {
        title: "",
        content: "",
      }

      const result = validator.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Title is required")
      expect(result.errors).toContain("Content is required")
    })

    it("should validate all rules in order", () => {
      const validator = new PostValidator()
        .addRule(new RequiredFieldsRule())
        .addRule(new MinLengthRule(5, 20))
        .addRule(new NoSpamRule())

      const data: CreatePostData = {
        title: "Hi",
        content: "Buy now!",
      }

      const result = validator.validate(data)

      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe("Factory functions", () => {
    describe("createBasicValidator", () => {
      it("should create validator with RequiredFields and MinLength rules", () => {
        const validator = createBasicValidator()

        const validData: CreatePostData = {
          title: "Valid title",
          content: "This is valid content for testing.",
        }

        const result = validator.validate(validData)

        expect(result.isValid).toBe(true)
      })

      it("should reject short title", () => {
        const validator = createBasicValidator()

        const data: CreatePostData = {
          title: "Hi",
          content: "This is valid content for testing.",
        }

        const result = validator.validate(data)

        expect(result.isValid).toBe(false)
        expect(result.errors.some((e) => e.includes("3 characters"))).toBe(true)
      })

      it("should reject short content", () => {
        const validator = createBasicValidator()

        const data: CreatePostData = {
          title: "Valid title",
          content: "Short",
        }

        const result = validator.validate(data)

        expect(result.isValid).toBe(false)
        expect(result.errors.some((e) => e.includes("10 characters"))).toBe(true)
      })
    })

    describe("createStrictValidator", () => {
      it("should create validator with strict requirements", () => {
        const validator = createStrictValidator()

        const validData: CreatePostData = {
          title: "Valid title here",
          content:
            "This is a much longer content that meets the strict requirements for validation.",
        }

        const result = validator.validate(validData)

        expect(result.isValid).toBe(true)
      })

      it("should reject spam content", () => {
        const validator = createStrictValidator()

        const data: CreatePostData = {
          title: "Valid title here",
          content: "Click here for amazing deals! This is a long enough content but contains spam.",
        }

        const result = validator.validate(data)

        expect(result.isValid).toBe(false)
        expect(result.errors.some((e) => e.includes("click here"))).toBe(true)
      })

      it("should require longer title (5 chars minimum)", () => {
        const validator = createStrictValidator()

        const data: CreatePostData = {
          title: "Hey",
          content:
            "This is a much longer content that meets the strict requirements for validation.",
        }

        const result = validator.validate(data)

        expect(result.isValid).toBe(false)
        expect(result.errors.some((e) => e.includes("5 characters"))).toBe(true)
      })

      it("should require longer content (50 chars minimum)", () => {
        const validator = createStrictValidator()

        const data: CreatePostData = {
          title: "Valid Title Here",
          content: "This is too short.",
        }

        const result = validator.validate(data)

        expect(result.isValid).toBe(false)
        expect(result.errors.some((e) => e.includes("50 characters"))).toBe(true)
      })
    })
  })
})
