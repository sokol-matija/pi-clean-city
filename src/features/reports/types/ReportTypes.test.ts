import { describe, it, expect } from "vitest"
import {
  StandardReportImpl,
  AnonymousReportImpl,
  SuggestionReportImpl,
} from "./ReportImplementations"
import {
  calculateDistance,
  getTotalPhotoCount,
  filterByOwner,
  validateAll,
  type Locatable,
  type Photographable,
  type UserOwned,
  type Submittable,
  type BaseReport,
} from "./ReportInterfaces"

/**
 * Liskov Substitution Principle Tests
 *
 * These tests demonstrate that:
 * 1. Different report types can be used interchangeably where their interfaces allow
 * 2. Functions accepting interfaces work with ANY implementation
 * 3. Type safety prevents misuse at compile time
 */

describe("Liskov Substitution Principle", () => {
  // Test data
  const standardReport = new StandardReportImpl({
    id: "1",
    title: "Broken streetlight",
    description: "The streetlight on Main St has been out for a week",
    latitude: 45.815,
    longitude: 15.982,
    photoUrls: ["photo1.jpg", "photo2.jpg"],
    userId: "user-123",
    categoryId: 1,
    address: "123 Main St",
  })

  const anonymousReport = new AnonymousReportImpl({
    id: "2",
    title: "Pothole on highway",
    description: "Large pothole causing damage to vehicles",
    latitude: 45.82,
    longitude: 15.99,
    photoUrls: ["pothole.jpg"],
    categoryId: 2,
  })

  const suggestionReport = new SuggestionReportImpl({
    id: "3",
    title: "Add more bike lanes",
    description: "The city needs more dedicated bike infrastructure",
    userId: "user-456",
    category: "Infrastructure",
  })

  describe("BaseReport interface substitution", () => {
    it("all report types satisfy BaseReport interface", () => {
      // LSP: Any BaseReport can be used in this function
      function getReportSummary(report: BaseReport): string {
        return `${report.title}: ${report.description.substring(0, 50)}...`
      }

      // All three types work identically
      expect(getReportSummary(standardReport)).toContain("Broken streetlight")
      expect(getReportSummary(anonymousReport)).toContain("Pothole on highway")
      expect(getReportSummary(suggestionReport)).toContain("Add more bike lanes")
    })

    it("can store different report types in BaseReport array", () => {
      const allReports: BaseReport[] = [standardReport, anonymousReport, suggestionReport]

      expect(allReports).toHaveLength(3)
      allReports.forEach((report) => {
        expect(report.title).toBeDefined()
        expect(report.description).toBeDefined()
      })
    })
  })

  describe("Locatable interface substitution", () => {
    it("StandardReport and AnonymousReport both satisfy Locatable", () => {
      // LSP: Both types can be used as Locatable
      const locatableReports: Locatable[] = [standardReport, anonymousReport]

      locatableReports.forEach((report) => {
        expect(report.latitude).toBeDefined()
        expect(report.longitude).toBeDefined()
        expect(typeof report.getDistanceFrom).toBe("function")
      })
    })

    it("calculateDistance works with any Locatable combination", () => {
      // LSP: Function accepts any Locatable, returns consistent results
      const distance1 = calculateDistance(standardReport, anonymousReport)
      const distance2 = calculateDistance(anonymousReport, standardReport)

      expect(distance1).toBeGreaterThan(0)
      expect(distance1).toBeCloseTo(distance2, 5) // Distance is symmetric
    })

    it("can mix different Locatable types in distance calculations", () => {
      // LSP: Different implementations work together seamlessly
      const cityCenter: Locatable = {
        latitude: 45.813,
        longitude: 15.978,
        getDistanceFrom: (other: Locatable) => {
          // Simple inline implementation also works!
          const dLat = other.latitude - 45.813
          const dLng = other.longitude - 15.978
          return Math.sqrt(dLat * dLat + dLng * dLng) * 111 // Rough km conversion
        },
      }

      const distanceToStandard = standardReport.getDistanceFrom(cityCenter)
      const distanceToAnonymous = anonymousReport.getDistanceFrom(cityCenter)

      expect(distanceToStandard).toBeGreaterThan(0)
      expect(distanceToAnonymous).toBeGreaterThan(0)
    })

    // Note: SuggestionReport is NOT Locatable - this is enforced by TypeScript
    // The following would cause a compile error:
    // const invalid: Locatable = suggestionReport // Error!
  })

  describe("Photographable interface substitution", () => {
    it("StandardReport and AnonymousReport both satisfy Photographable", () => {
      const photographableReports: Photographable[] = [standardReport, anonymousReport]

      photographableReports.forEach((report) => {
        expect(Array.isArray(report.photoUrls)).toBe(true)
        expect(typeof report.getPhotoCount()).toBe("number")
        expect(typeof report.hasPhotos()).toBe("boolean")
      })
    })

    it("getTotalPhotoCount works with any Photographable array", () => {
      const total = getTotalPhotoCount([standardReport, anonymousReport])

      expect(total).toBe(3) // 2 + 1 photos
    })

    it("hasPhotos returns correct values for different implementations", () => {
      expect(standardReport.hasPhotos()).toBe(true)
      expect(anonymousReport.hasPhotos()).toBe(true)

      const noPhotoReport = new AnonymousReportImpl({
        title: "No photos",
        description: "This report has no photos attached",
        latitude: 45.8,
        longitude: 15.9,
        categoryId: 1,
      })
      expect(noPhotoReport.hasPhotos()).toBe(false)
    })

    // Note: SuggestionReport is NOT Photographable
  })

  describe("UserOwned interface substitution", () => {
    it("StandardReport and SuggestionReport both satisfy UserOwned", () => {
      const userOwnedReports: UserOwned[] = [standardReport, suggestionReport]

      userOwnedReports.forEach((report) => {
        expect(report.userId).toBeDefined()
        expect(typeof report.isOwnedBy).toBe("function")
      })
    })

    it("filterByOwner works with any UserOwned array", () => {
      const allUserOwned: UserOwned[] = [standardReport, suggestionReport]

      const user123Reports = filterByOwner(allUserOwned, "user-123")
      const user456Reports = filterByOwner(allUserOwned, "user-456")

      expect(user123Reports).toHaveLength(1)
      expect(user456Reports).toHaveLength(1)
    })

    it("isOwnedBy returns correct values", () => {
      expect(standardReport.isOwnedBy("user-123")).toBe(true)
      expect(standardReport.isOwnedBy("user-456")).toBe(false)
      expect(suggestionReport.isOwnedBy("user-456")).toBe(true)
    })

    // Note: AnonymousReport is NOT UserOwned
  })

  describe("Submittable interface substitution", () => {
    it("all report types satisfy Submittable", () => {
      const submittableReports: Submittable[] = [standardReport, anonymousReport, suggestionReport]

      submittableReports.forEach((report) => {
        expect(typeof report.validate).toBe("function")
        expect(typeof report.toSubmissionData).toBe("function")
      })
    })

    it("validateAll works with mixed Submittable types", () => {
      const result = validateAll([standardReport, anonymousReport, suggestionReport])

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("validation returns errors for invalid reports", () => {
      const invalidReport = new StandardReportImpl({
        title: "", // Invalid: empty title
        description: "Short", // Invalid: too short
        latitude: 45.8,
        longitude: 15.9,
        photoUrls: [],
        userId: "user-1",
        categoryId: 0, // Invalid: no category
      })

      const result = invalidReport.validate()

      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors).toContain("Title is required")
    })

    it("toSubmissionData returns correct format for each type", () => {
      const standardData = standardReport.toSubmissionData()
      const anonymousData = anonymousReport.toSubmissionData()
      const suggestionData = suggestionReport.toSubmissionData()

      // Standard report has user_id
      expect(standardData.user_id).toBe("user-123")

      // Anonymous report has null user_id
      expect(anonymousData.user_id).toBeNull()

      // Suggestion has different structure
      expect(suggestionData.category).toBe("Infrastructure")
      expect(suggestionData.latitude).toBeUndefined() // Suggestions don't have location
    })
  })

  describe("LSP violation prevention (compile-time safety)", () => {
    it("demonstrates type-safe interface usage", () => {
      // These would cause TypeScript errors if uncommented:

      // const badLocatable: Locatable = suggestionReport
      // Error: Property 'latitude' is missing in type 'SuggestionReportImpl'

      // const badPhotographable: Photographable = suggestionReport
      // Error: Property 'photoUrls' is missing in type 'SuggestionReportImpl'

      // const badUserOwned: UserOwned = anonymousReport
      // Error: Property 'userId' is missing in type 'AnonymousReportImpl'

      // This test just verifies the principle - actual type checking is done by TypeScript
      expect(true).toBe(true)
    })
  })
})
