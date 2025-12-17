/**
 * Photo Upload Hook
 *
 * SOLID Principle: Single Responsibility (SRP)
 * This hook has ONE responsibility: managing photo uploads for reports.
 *
 * Benefits:
 * - Can be reused in any component that needs photo upload
 * - Photo validation logic is centralized
 * - Easy to test photo handling in isolation
 * - Changes to photo limits don't affect form logic
 */

import { useState, useCallback } from "react"

const MAX_PHOTOS = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export interface PhotoUploadState {
  photos: File[]
  addPhotos: (files: File[]) => void
  removePhoto: (index: number) => void
  clearPhotos: () => void
  canAddMore: boolean
  remainingSlots: number
}

/**
 * Validates a single photo file.
 * Returns true if the file is a valid image under the size limit.
 */
function isValidPhoto(file: File): boolean {
  if (!file.type.startsWith("image/")) {
    return false
  }
  if (file.size > MAX_FILE_SIZE) {
    return false
  }
  return true
}

/**
 * Hook for managing photo uploads with validation.
 * Handles adding, removing, and validating photos.
 */
export function usePhotoUpload(): PhotoUploadState {
  const [photos, setPhotos] = useState<File[]>([])

  const addPhotos = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(isValidPhoto)
    setPhotos((prev) => [...prev, ...validFiles].slice(0, MAX_PHOTOS))
  }, [])

  const removePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearPhotos = useCallback(() => {
    setPhotos([])
  }, [])

  return {
    photos,
    addPhotos,
    removePhoto,
    clearPhotos,
    canAddMore: photos.length < MAX_PHOTOS,
    remainingSlots: MAX_PHOTOS - photos.length,
  }
}
