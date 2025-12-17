import { describe, it, expect } from "vitest"
import { validateReportForm, type ReportFormData } from "./reportValidation"

describe("validateReportForm", () => {
  const validFormData: ReportFormData = {
    title: "Broken streetlight on Main Street",
    description: "The streetlight has been flickering for a week and now is completely out.",
    categoryId: "1",
    location: { lat: 45.815, lng: 15.982 },
  }

  describe("valid data", () => {
    it("should return isValid true for valid form data", () => {
      const result = validateReportForm(validFormData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })
  })

  describe("title validation", () => {
    it("should return error when title is empty", () => {
      const result = validateReportForm({ ...validFormData, title: "" })
      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBe("Title is required")
    })

    it("should return error when title is only whitespace", () => {
      const result = validateReportForm({ ...validFormData, title: "   " })
      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBe("Title is required")
    })

    it("should return error when title exceeds 100 characters", () => {
      const longTitle = "a".repeat(101)
      const result = validateReportForm({ ...validFormData, title: longTitle })
      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBe("Title must be 100 characters or less")
    })

    it("should accept title with exactly 100 characters", () => {
      const exactTitle = "a".repeat(100)
      const result = validateReportForm({ ...validFormData, title: exactTitle })
      expect(result.errors.title).toBeUndefined()
    })
  })

  describe("description validation", () => {
    it("should return error when description is empty", () => {
      const result = validateReportForm({ ...validFormData, description: "" })
      expect(result.isValid).toBe(false)
      expect(result.errors.description).toBe("Description is required")
    })

    it("should return error when description is less than 20 characters", () => {
      const result = validateReportForm({ ...validFormData, description: "Too short" })
      expect(result.isValid).toBe(false)
      expect(result.errors.description).toBe("Description must be at least 20 characters")
    })

    it("should return error when description exceeds 500 characters", () => {
      const longDescription = "a".repeat(501)
      const result = validateReportForm({ ...validFormData, description: longDescription })
      expect(result.isValid).toBe(false)
      expect(result.errors.description).toBe("Description must be 500 characters or less")
    })

    it("should accept description with exactly 20 characters", () => {
      const exactDescription = "a".repeat(20)
      const result = validateReportForm({ ...validFormData, description: exactDescription })
      expect(result.errors.description).toBeUndefined()
    })

    it("should accept description with exactly 500 characters", () => {
      const exactDescription = "a".repeat(500)
      const result = validateReportForm({ ...validFormData, description: exactDescription })
      expect(result.errors.description).toBeUndefined()
    })
  })

  describe("category validation", () => {
    it("should return error when categoryId is empty", () => {
      const result = validateReportForm({ ...validFormData, categoryId: "" })
      expect(result.isValid).toBe(false)
      expect(result.errors.category).toBe("Category is required")
    })
  })

  describe("location validation", () => {
    it("should return error when location is null", () => {
      const result = validateReportForm({ ...validFormData, location: null })
      expect(result.isValid).toBe(false)
      expect(result.errors.location).toBe("Location is required")
    })

    it("should accept valid location coordinates", () => {
      const result = validateReportForm(validFormData)
      expect(result.errors.location).toBeUndefined()
    })
  })

  describe("multiple errors", () => {
    it("should return all errors when multiple fields are invalid", () => {
      const result = validateReportForm({
        title: "",
        description: "",
        categoryId: "",
        location: null,
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.title).toBeDefined()
      expect(result.errors.description).toBeDefined()
      expect(result.errors.category).toBeDefined()
      expect(result.errors.location).toBeDefined()
    })
  })
})
