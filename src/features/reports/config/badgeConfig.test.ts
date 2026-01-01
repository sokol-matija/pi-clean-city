import { describe, it, expect } from "vitest"
import {
  getStatusBadgeVariant,
  getPriorityBadgeVariant,
  STATUS_BADGE_CONFIG,
  PRIORITY_BADGE_CONFIG,
} from "./badgeConfig"

describe("Badge Configuration (Open/Closed Principle)", () => {
  describe("getStatusBadgeVariant", () => {
    it("should return destructive for 'New' status", () => {
      expect(getStatusBadgeVariant("New")).toBe("destructive")
      expect(getStatusBadgeVariant("new")).toBe("destructive")
      expect(getStatusBadgeVariant("NEW")).toBe("destructive")
    })

    it("should return default for 'In Progress' status", () => {
      expect(getStatusBadgeVariant("In Progress")).toBe("default")
      expect(getStatusBadgeVariant("in progress")).toBe("default")
    })

    it("should return secondary for 'Resolved' status", () => {
      expect(getStatusBadgeVariant("Resolved")).toBe("secondary")
      expect(getStatusBadgeVariant("resolved")).toBe("secondary")
    })

    it("should return outline for 'Closed' status", () => {
      expect(getStatusBadgeVariant("Closed")).toBe("outline")
      expect(getStatusBadgeVariant("closed")).toBe("outline")
    })

    it("should return default for null/undefined status", () => {
      expect(getStatusBadgeVariant(null)).toBe("default")
      expect(getStatusBadgeVariant(undefined)).toBe("default")
    })

    it("should return default for unknown status", () => {
      expect(getStatusBadgeVariant("Unknown Status")).toBe("default")
      expect(getStatusBadgeVariant("random")).toBe("default")
    })

    it("should handle whitespace in status names", () => {
      expect(getStatusBadgeVariant("  New  ")).toBe("destructive")
      expect(getStatusBadgeVariant(" In Progress ")).toBe("default")
    })
  })

  describe("getPriorityBadgeVariant", () => {
    it("should return destructive for critical priority", () => {
      expect(getPriorityBadgeVariant("critical")).toBe("destructive")
      expect(getPriorityBadgeVariant("Critical")).toBe("destructive")
      expect(getPriorityBadgeVariant("CRITICAL")).toBe("destructive")
    })

    it("should return destructive for high priority", () => {
      expect(getPriorityBadgeVariant("high")).toBe("destructive")
      expect(getPriorityBadgeVariant("High")).toBe("destructive")
    })

    it("should return default for medium priority", () => {
      expect(getPriorityBadgeVariant("medium")).toBe("default")
      expect(getPriorityBadgeVariant("Medium")).toBe("default")
    })

    it("should return secondary for low priority", () => {
      expect(getPriorityBadgeVariant("low")).toBe("secondary")
      expect(getPriorityBadgeVariant("Low")).toBe("secondary")
    })

    it("should return secondary for null/undefined priority", () => {
      expect(getPriorityBadgeVariant(null)).toBe("secondary")
      expect(getPriorityBadgeVariant(undefined)).toBe("secondary")
    })

    it("should return secondary for unknown priority", () => {
      expect(getPriorityBadgeVariant("unknown")).toBe("secondary")
      expect(getPriorityBadgeVariant("random")).toBe("secondary")
    })
  })

  describe("Configuration extensibility (OCP demonstration)", () => {
    it("should have all expected statuses configured", () => {
      const expectedStatuses = ["new", "in progress", "resolved", "closed"]
      expectedStatuses.forEach((status) => {
        expect(STATUS_BADGE_CONFIG[status]).toBeDefined()
      })
    })

    it("should have all expected priorities configured", () => {
      const expectedPriorities = ["critical", "high", "medium", "low"]
      expectedPriorities.forEach((priority) => {
        expect(PRIORITY_BADGE_CONFIG[priority]).toBeDefined()
      })
    })

    it("demonstrates extensibility: adding new status requires only config change", () => {
      const configKeysCount = Object.keys(STATUS_BADGE_CONFIG).length
      expect(configKeysCount).toBeGreaterThanOrEqual(4)
    })
  })
})
