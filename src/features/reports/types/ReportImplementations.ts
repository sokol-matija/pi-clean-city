/**
 * Report Type Implementations
 *
 * SOLID Principle: Liskov Substitution Principle (LSP)
 *
 * These classes implement the interfaces defined in ReportInterfaces.ts.
 * Each implementation fully satisfies its interface contracts - no exceptions,
 * no "not implemented" methods, no surprises.
 *
 * LSP Guarantee: Any function that accepts a Locatable will work correctly
 * with StandardReportImpl or AnonymousReportImpl, because both FULLY
 * implement the Locatable interface.
 */

import type {
  StandardReport,
  AnonymousReport,
  SuggestionReport,
  Locatable,
  SubmissionValidationResult,
} from "./ReportInterfaces"

// =============================================================================
// UTILITY: Haversine distance calculation
// =============================================================================

/**
 * Calculate distance between two coordinates using Haversine formula.
 * Returns distance in kilometers.
 */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// =============================================================================
// STANDARD REPORT IMPLEMENTATION
// =============================================================================

/**
 * Standard citizen report with location, photos, and user ownership.
 *
 * LSP: Fully implements StandardReport, which includes:
 * - BaseReport: id, title, description, createdAt
 * - Locatable: latitude, longitude, getDistanceFrom()
 * - Photographable: photoUrls, getPhotoCount(), hasPhotos()
 * - UserOwned: userId, isOwnedBy()
 * - Submittable: validate(), toSubmissionData()
 */
export class StandardReportImpl implements StandardReport {
  readonly id?: string
  readonly title: string
  readonly description: string
  readonly createdAt?: Date
  readonly latitude: number
  readonly longitude: number
  readonly photoUrls: string[]
  readonly userId: string
  readonly categoryId: number
  readonly address?: string
  readonly priority?: string
  readonly statusId?: number

  constructor(data: {
    id?: string
    title: string
    description: string
    latitude: number
    longitude: number
    photoUrls?: string[]
    userId: string
    categoryId: number
    address?: string
    priority?: string
    statusId?: number
    createdAt?: Date
  }) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.latitude = data.latitude
    this.longitude = data.longitude
    this.photoUrls = data.photoUrls ?? []
    this.userId = data.userId
    this.categoryId = data.categoryId
    this.address = data.address
    this.priority = data.priority
    this.statusId = data.statusId
    this.createdAt = data.createdAt
  }

  // Locatable implementation
  getDistanceFrom(other: Locatable): number {
    return haversineDistance(this.latitude, this.longitude, other.latitude, other.longitude)
  }

  // Photographable implementation
  getPhotoCount(): number {
    return this.photoUrls.length
  }

  hasPhotos(): boolean {
    return this.photoUrls.length > 0
  }

  // UserOwned implementation
  isOwnedBy(userId: string): boolean {
    return this.userId === userId
  }

  // Submittable implementation
  validate(): SubmissionValidationResult {
    const errors: string[] = []

    if (!this.title.trim()) errors.push("Title is required")
    if (this.title.length > 100) errors.push("Title must be 100 characters or less")
    if (!this.description.trim()) errors.push("Description is required")
    if (this.description.length < 20) errors.push("Description must be at least 20 characters")
    if (!this.categoryId) errors.push("Category is required")
    if (!this.userId) errors.push("User ID is required")

    return { isValid: errors.length === 0, errors }
  }

  toSubmissionData(): Record<string, unknown> {
    return {
      title: this.title.trim(),
      description: this.description.trim(),
      latitude: this.latitude,
      longitude: this.longitude,
      category_id: this.categoryId,
      user_id: this.userId,
      address: this.address?.trim() || null,
      priority: this.priority,
    }
  }
}

// =============================================================================
// ANONYMOUS REPORT IMPLEMENTATION
// =============================================================================

/**
 * Anonymous report - location and photos, but NO user.
 *
 * LSP: Fully implements AnonymousReport, which includes:
 * - BaseReport: id, title, description, createdAt
 * - Locatable: latitude, longitude, getDistanceFrom()
 * - Photographable: photoUrls, getPhotoCount(), hasPhotos()
 * - Submittable: validate(), toSubmissionData()
 *
 * Note: Does NOT implement UserOwned - and that's by design!
 * The type system prevents you from using AnonymousReport where UserOwned is expected.
 */
export class AnonymousReportImpl implements AnonymousReport {
  readonly id?: string
  readonly title: string
  readonly description: string
  readonly createdAt?: Date
  readonly latitude: number
  readonly longitude: number
  readonly photoUrls: string[]
  readonly categoryId: number
  readonly address?: string

  constructor(data: {
    id?: string
    title: string
    description: string
    latitude: number
    longitude: number
    photoUrls?: string[]
    categoryId: number
    address?: string
    createdAt?: Date
  }) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.latitude = data.latitude
    this.longitude = data.longitude
    this.photoUrls = data.photoUrls ?? []
    this.categoryId = data.categoryId
    this.address = data.address
    this.createdAt = data.createdAt
  }

  // Locatable implementation - same as StandardReport
  getDistanceFrom(other: Locatable): number {
    return haversineDistance(this.latitude, this.longitude, other.latitude, other.longitude)
  }

  // Photographable implementation - same as StandardReport
  getPhotoCount(): number {
    return this.photoUrls.length
  }

  hasPhotos(): boolean {
    return this.photoUrls.length > 0
  }

  // Submittable implementation - slightly different validation
  validate(): SubmissionValidationResult {
    const errors: string[] = []

    if (!this.title.trim()) errors.push("Title is required")
    if (this.title.length > 100) errors.push("Title must be 100 characters or less")
    if (!this.description.trim()) errors.push("Description is required")
    if (this.description.length < 20) errors.push("Description must be at least 20 characters")
    if (!this.categoryId) errors.push("Category is required")
    // Note: No userId validation - anonymous reports don't have users

    return { isValid: errors.length === 0, errors }
  }

  toSubmissionData(): Record<string, unknown> {
    return {
      title: this.title.trim(),
      description: this.description.trim(),
      latitude: this.latitude,
      longitude: this.longitude,
      category_id: this.categoryId,
      user_id: null, // Anonymous!
      address: this.address?.trim() || null,
    }
  }
}

// =============================================================================
// SUGGESTION REPORT IMPLEMENTATION
// =============================================================================

/**
 * Suggestion report - user ownership, but NO location or photos.
 *
 * LSP: Fully implements SuggestionReport, which includes:
 * - BaseReport: id, title, description, createdAt
 * - UserOwned: userId, isOwnedBy()
 * - Submittable: validate(), toSubmissionData()
 *
 * Note: Does NOT implement Locatable or Photographable - and that's by design!
 * Suggestions don't need location data, and the type system enforces this.
 */
export class SuggestionReportImpl implements SuggestionReport {
  readonly id?: string
  readonly title: string
  readonly description: string
  readonly createdAt?: Date
  readonly userId: string
  readonly category: string

  constructor(data: {
    id?: string
    title: string
    description: string
    userId: string
    category: string
    createdAt?: Date
  }) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.userId = data.userId
    this.category = data.category
    this.createdAt = data.createdAt
  }

  // UserOwned implementation
  isOwnedBy(userId: string): boolean {
    return this.userId === userId
  }

  // Submittable implementation
  validate(): SubmissionValidationResult {
    const errors: string[] = []

    if (!this.title.trim()) errors.push("Title is required")
    if (this.title.length > 100) errors.push("Title must be 100 characters or less")
    if (!this.description.trim()) errors.push("Description is required")
    if (this.description.length < 20) errors.push("Description must be at least 20 characters")
    if (!this.category) errors.push("Category is required")
    if (!this.userId) errors.push("User ID is required")

    return { isValid: errors.length === 0, errors }
  }

  toSubmissionData(): Record<string, unknown> {
    return {
      title: this.title.trim(),
      description: this.description.trim(),
      category: this.category,
      user_id: this.userId,
    }
  }
}
