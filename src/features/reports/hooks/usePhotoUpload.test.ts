import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { usePhotoUpload } from "./usePhotoUpload"

// Helper function to create a mock File object
function createMockFile(name: string, size: number, type: string = "image/jpeg"): File {
  // Create a File object with mock data
  const file = new File(["x".repeat(size)], name, { type })
  return file
}

describe("usePhotoUpload", () => {
  it("should initialize with empty photos array", () => {
    // renderHook is used to test hooks in isolation
    const { result } = renderHook(() => usePhotoUpload())

    expect(result.current.photos).toEqual([])
    expect(result.current.canAddMore).toBe(true)
    expect(result.current.remainingSlots).toBe(5)
  })

  describe("addPhotos", () => {
    it("should add valid photos", () => {
      const { result } = renderHook(() => usePhotoUpload())

      const mockPhoto = createMockFile("photo1.jpg", 1000, "image/jpeg")

      // act() is required when changing state in a hook
      act(() => {
        result.current.addPhotos([mockPhoto])
      })

      expect(result.current.photos).toHaveLength(1)
      expect(result.current.photos[0]).toBe(mockPhoto)
      expect(result.current.remainingSlots).toBe(4)
    })

    it("should add multiple valid photos", () => {
      const { result } = renderHook(() => usePhotoUpload())

      const mockPhotos = [
        createMockFile("photo1.jpg", 1000),
        createMockFile("photo2.jpg", 2000),
        createMockFile("photo3.jpg", 3000),
      ]

      act(() => {
        result.current.addPhotos(mockPhotos)
      })

      expect(result.current.photos).toHaveLength(3)
      expect(result.current.remainingSlots).toBe(2)
    })

    it("should reject files that are not images", () => {
      const { result } = renderHook(() => usePhotoUpload())

      const invalidFile = createMockFile("document.pdf", 1000, "application/pdf")

      act(() => {
        result.current.addPhotos([invalidFile])
      })

      // Should not add non-image files
      expect(result.current.photos).toHaveLength(0)
    })

    it("should reject files larger than 10MB", () => {
      const { result } = renderHook(() => usePhotoUpload())

      const oversizedFile = createMockFile("huge.jpg", 11 * 1024 * 1024, "image/jpeg")

      act(() => {
        result.current.addPhotos([oversizedFile])
      })

      // Should not add oversized files
      expect(result.current.photos).toHaveLength(0)
    })

    it("should limit to maximum of 5 photos", () => {
      const { result } = renderHook(() => usePhotoUpload())

      // Try to add 7 photos
      const mockPhotos = Array.from({ length: 7 }, (_, i) => createMockFile(`photo${i}.jpg`, 1000))

      act(() => {
        result.current.addPhotos(mockPhotos)
      })

      // Should only have 5 photos
      expect(result.current.photos).toHaveLength(5)
      expect(result.current.canAddMore).toBe(false)
      expect(result.current.remainingSlots).toBe(0)
    })

    it("should filter out invalid photos but keep valid ones", () => {
      const { result } = renderHook(() => usePhotoUpload())

      const mixedFiles = [
        createMockFile("photo1.jpg", 1000, "image/jpeg"), // valid
        createMockFile("document.pdf", 1000, "application/pdf"), // invalid type
        createMockFile("photo2.jpg", 1000, "image/png"), // valid
        createMockFile("huge.jpg", 11 * 1024 * 1024, "image/jpeg"), // invalid size
      ]

      act(() => {
        result.current.addPhotos(mixedFiles)
      })

      // Should only add the 2 valid photos
      expect(result.current.photos).toHaveLength(2)
      expect(result.current.photos[0].name).toBe("photo1.jpg")
      expect(result.current.photos[1].name).toBe("photo2.jpg")
    })
  })

  describe("removePhoto", () => {
    it("should remove photo at specified index", () => {
      const { result } = renderHook(() => usePhotoUpload())

      const mockPhotos = [
        createMockFile("photo1.jpg", 1000),
        createMockFile("photo2.jpg", 2000),
        createMockFile("photo3.jpg", 3000),
      ]

      act(() => {
        result.current.addPhotos(mockPhotos)
      })

      expect(result.current.photos).toHaveLength(3)

      // Remove the middle photo
      act(() => {
        result.current.removePhoto(1)
      })

      expect(result.current.photos).toHaveLength(2)
      expect(result.current.photos[0].name).toBe("photo1.jpg")
      expect(result.current.photos[1].name).toBe("photo3.jpg")
      expect(result.current.remainingSlots).toBe(3)
    })

    it("should update canAddMore after removing a photo", () => {
      const { result } = renderHook(() => usePhotoUpload())

      // Add 5 photos (max)
      const mockPhotos = Array.from({ length: 5 }, (_, i) => createMockFile(`photo${i}.jpg`, 1000))

      act(() => {
        result.current.addPhotos(mockPhotos)
      })

      expect(result.current.canAddMore).toBe(false)

      // Remove one photo
      act(() => {
        result.current.removePhoto(0)
      })

      expect(result.current.canAddMore).toBe(true)
      expect(result.current.remainingSlots).toBe(1)
    })
  })

  describe("clearPhotos", () => {
    it("should remove all photos", () => {
      const { result } = renderHook(() => usePhotoUpload())

      const mockPhotos = [createMockFile("photo1.jpg", 1000), createMockFile("photo2.jpg", 2000)]

      act(() => {
        result.current.addPhotos(mockPhotos)
      })

      expect(result.current.photos).toHaveLength(2)

      act(() => {
        result.current.clearPhotos()
      })

      expect(result.current.photos).toHaveLength(0)
      expect(result.current.canAddMore).toBe(true)
      expect(result.current.remainingSlots).toBe(5)
    })
  })

  describe("computed properties", () => {
    it("should correctly calculate canAddMore", () => {
      const { result } = renderHook(() => usePhotoUpload())

      // Initially can add more
      expect(result.current.canAddMore).toBe(true)

      // Add 3 photos
      act(() => {
        result.current.addPhotos([
          createMockFile("photo1.jpg", 1000),
          createMockFile("photo2.jpg", 1000),
          createMockFile("photo3.jpg", 1000),
        ])
      })

      // Still can add more
      expect(result.current.canAddMore).toBe(true)

      // Add 2 more photos (total 5)
      act(() => {
        result.current.addPhotos([
          createMockFile("photo4.jpg", 1000),
          createMockFile("photo5.jpg", 1000),
        ])
      })

      // Now cannot add more
      expect(result.current.canAddMore).toBe(false)
    })

    it("should correctly calculate remainingSlots", () => {
      const { result } = renderHook(() => usePhotoUpload())

      expect(result.current.remainingSlots).toBe(5)

      act(() => {
        result.current.addPhotos([createMockFile("photo1.jpg", 1000)])
      })
      expect(result.current.remainingSlots).toBe(4)

      act(() => {
        result.current.addPhotos([createMockFile("photo2.jpg", 1000)])
      })
      expect(result.current.remainingSlots).toBe(3)

      act(() => {
        result.current.removePhoto(0)
      })
      expect(result.current.remainingSlots).toBe(4)
    })
  })

  describe("edge cases", () => {
    it("should handle empty array when adding photos", () => {
      const { result } = renderHook(() => usePhotoUpload())

      act(() => {
        result.current.addPhotos([])
      })

      expect(result.current.photos).toHaveLength(0)
    })

    it("should handle removing from invalid index gracefully", () => {
      const { result } = renderHook(() => usePhotoUpload())

      act(() => {
        result.current.addPhotos([createMockFile("photo1.jpg", 1000)])
      })

      // Try to remove an index that doesn't exist
      act(() => {
        result.current.removePhoto(999)
      })

      // Should still have the original photo
      expect(result.current.photos).toHaveLength(1)
    })

    it("should handle clearing empty photos array", () => {
      const { result } = renderHook(() => usePhotoUpload())

      // Clear when already empty
      act(() => {
        result.current.clearPhotos()
      })

      expect(result.current.photos).toHaveLength(0)
    })
  })
})
