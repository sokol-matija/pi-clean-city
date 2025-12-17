/**
 * Report Form State Hook
 *
 * SOLID Principle: Single Responsibility (SRP)
 * This hook has ONE responsibility: managing form state for report submission.
 *
 * Benefits:
 * - Form state logic separated from UI rendering
 * - Can be reused for edit forms with different initial values
 * - Easy to test form state transitions
 * - Validation is delegated to the validation module
 */

import { useState, useCallback } from "react"
import {
  validateReportForm,
  type ReportFormData,
  type ValidationErrors,
} from "../validation/reportValidation"

export interface ReportFormState {
  // Form data
  title: string
  description: string
  categoryId: string
  location: { lat: number; lng: number } | null
  address: string
  // Validation
  errors: ValidationErrors & { submit?: string }
  // Actions
  setTitle: (value: string) => void
  setDescription: (value: string) => void
  setCategoryId: (value: string) => void
  setLocation: (value: { lat: number; lng: number } | null) => void
  setAddress: (value: string) => void
  setSubmitError: (error: string) => void
  validate: () => boolean
  reset: () => void
}

const initialState = {
  title: "",
  description: "",
  categoryId: "",
  location: null as { lat: number; lng: number } | null,
  address: "",
}

/**
 * Hook for managing report form state and validation.
 * Provides controlled form state with validation support.
 */
export function useReportForm(): ReportFormState {
  const [title, setTitle] = useState(initialState.title)
  const [description, setDescription] = useState(initialState.description)
  const [categoryId, setCategoryId] = useState(initialState.categoryId)
  const [location, setLocation] = useState(initialState.location)
  const [address, setAddress] = useState(initialState.address)
  const [errors, setErrors] = useState<ValidationErrors & { submit?: string }>({})

  const validate = useCallback((): boolean => {
    const formData: ReportFormData = {
      title,
      description,
      categoryId,
      location,
      address,
    }

    const result = validateReportForm(formData)
    setErrors(result.errors)
    return result.isValid
  }, [title, description, categoryId, location, address])

  const setSubmitError = useCallback((error: string) => {
    setErrors((prev) => ({ ...prev, submit: error }))
  }, [])

  const reset = useCallback(() => {
    setTitle(initialState.title)
    setDescription(initialState.description)
    setCategoryId(initialState.categoryId)
    setLocation(initialState.location)
    setAddress(initialState.address)
    setErrors({})
  }, [])

  return {
    title,
    description,
    categoryId,
    location,
    address,
    errors,
    setTitle,
    setDescription,
    setCategoryId,
    setLocation,
    setAddress,
    setSubmitError,
    validate,
    reset,
  }
}
