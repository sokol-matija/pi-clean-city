/**
 * Report Type Interfaces
 *
 * SOLID Principle: Liskov Substitution Principle (LSP)
 * "Objects of a superclass should be replaceable with objects of a subclass
 *  without affecting the correctness of the program."
 *
 * This module demonstrates LSP by using interface composition instead of
 * class inheritance. Each interface defines a specific capability, and
 * implementations can mix-and-match these capabilities.
 *
 * Key insight: Instead of creating a class hierarchy where subclasses might
 * violate parent contracts (e.g., throwing exceptions for unsupported methods),
 * we use interfaces to define exactly what each type CAN do.
 */

// =============================================================================
// CAPABILITY INTERFACES - Define what an entity CAN do
// =============================================================================

/**
 * Entities that have a geographic location.
 * Any type implementing this can be used in location-based operations.
 */
export interface Locatable {
  readonly latitude: number
  readonly longitude: number
  getDistanceFrom(other: Locatable): number
}

/**
 * Entities that can have photos attached.
 * Any type implementing this can be used in photo-related operations.
 */
export interface Photographable {
  readonly photoUrls: string[]
  getPhotoCount(): number
  hasPhotos(): boolean
}

/**
 * Entities that are associated with a user.
 * Any type implementing this can be used in user-related operations.
 */
export interface UserOwned {
  readonly userId: string
  isOwnedBy(userId: string): boolean
}

/**
 * Entities that can be submitted to the system.
 * Any type implementing this can be used in submission workflows.
 */
export interface Submittable {
  validate(): SubmissionValidationResult
  toSubmissionData(): Record<string, unknown>
}

export interface SubmissionValidationResult {
  isValid: boolean
  errors: string[]
}

// =============================================================================
// BASE REPORT INTERFACE - Minimal contract for all reports
// =============================================================================

/**
 * The minimal interface that ALL report types must satisfy.
 * This is what makes LSP work - any Report can be used where BaseReport is expected.
 */
export interface BaseReport {
  readonly id?: string
  readonly title: string
  readonly description: string
  readonly createdAt?: Date
}

// =============================================================================
// COMPOSED REPORT TYPES - Combine capabilities as needed
// =============================================================================

/**
 * Standard citizen report - has location, photos, and belongs to a user.
 * This is the most common report type in the system.
 *
 * LSP: Can be used anywhere BaseReport, Locatable, Photographable, or UserOwned is expected.
 */
export interface StandardReport
  extends BaseReport, Locatable, Photographable, UserOwned, Submittable {
  readonly categoryId: number
  readonly address?: string
  readonly priority?: string
  readonly statusId?: number
}

/**
 * Anonymous report - has location and photos, but NO user association.
 * Used when citizens want to report without identifying themselves.
 *
 * LSP: Can be used anywhere BaseReport, Locatable, or Photographable is expected.
 * LSP: CANNOT be used where UserOwned is expected (type system prevents this).
 */
export interface AnonymousReport extends BaseReport, Locatable, Photographable, Submittable {
  readonly categoryId: number
  readonly address?: string
  // Note: NO userId - anonymous reports don't have one
}

/**
 * Suggestion report - has user association but NO location or photos.
 * Used for general city improvement suggestions.
 *
 * LSP: Can be used anywhere BaseReport or UserOwned is expected.
 * LSP: CANNOT be used where Locatable or Photographable is expected.
 */
export interface SuggestionReport extends BaseReport, UserOwned, Submittable {
  readonly category: string
  // Note: NO location - suggestions don't need one
  // Note: NO photos - suggestions are text-only
}

// =============================================================================
// HELPER FUNCTIONS - Work with capabilities, not concrete types
// =============================================================================

/**
 * Calculate distance between two locatable entities.
 * LSP: Works with ANY Locatable - StandardReport, AnonymousReport, or any future type.
 */
export function calculateDistance(a: Locatable, b: Locatable): number {
  return a.getDistanceFrom(b)
}

/**
 * Get total photo count across multiple photographable entities.
 * LSP: Works with ANY Photographable - StandardReport, AnonymousReport, etc.
 */
export function getTotalPhotoCount(items: Photographable[]): number {
  return items.reduce((total, item) => total + item.getPhotoCount(), 0)
}

/**
 * Filter items owned by a specific user.
 * LSP: Works with ANY UserOwned - StandardReport, SuggestionReport, etc.
 */
export function filterByOwner<T extends UserOwned>(items: T[], userId: string): T[] {
  return items.filter((item) => item.isOwnedBy(userId))
}

/**
 * Validate all submittable items.
 * LSP: Works with ANY Submittable - all report types.
 */
export function validateAll(items: Submittable[]): SubmissionValidationResult {
  const allErrors: string[] = []

  for (const item of items) {
    const result = item.validate()
    if (!result.isValid) {
      allErrors.push(...result.errors)
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  }
}
