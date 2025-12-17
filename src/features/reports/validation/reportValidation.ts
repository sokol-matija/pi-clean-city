/**
 * Report Validation Module
 *
 * SOLID Principle: Single Responsibility (SRP)
 * This module has ONE responsibility: validating report form data.
 *
 * Benefits:
 * - Can be tested independently without UI
 * - Can be reused in edit forms, API validation, etc.
 * - Changes to validation rules don't affect other parts of the app
 */

export interface ReportFormData {
  title: string
  description: string
  categoryId: string
  location: { lat: number; lng: number } | null
  address?: string
}

export interface ValidationErrors {
  title?: string
  description?: string
  category?: string
  location?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationErrors
}

/**
 * Validates report form data and returns validation errors.
 * Pure function - no side effects, easy to test.
 */
export function validateReportForm(data: ReportFormData): ValidationResult {
  const errors: ValidationErrors = {}

  // Title validation
  if (!data.title.trim()) {
    errors.title = "Title is required"
  } else if (data.title.length > 100) {
    errors.title = "Title must be 100 characters or less"
  }

  // Description validation
  if (!data.description.trim()) {
    errors.description = "Description is required"
  } else if (data.description.length < 20) {
    errors.description = "Description must be at least 20 characters"
  } else if (data.description.length > 500) {
    errors.description = "Description must be 500 characters or less"
  }

  // Category validation
  if (!data.categoryId) {
    errors.category = "Category is required"
  }

  // Location validation
  if (!data.location) {
    errors.location = "Location is required"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
