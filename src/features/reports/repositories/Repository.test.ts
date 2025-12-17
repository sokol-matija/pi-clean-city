import { describe, it, expect, beforeEach } from "vitest"
import { MockReportRepository, MockPhotoStorage, MockPhotoRepository } from "./MockReportRepository"
import type { IReportRepository, IPhotoStorage, IPhotoRepository } from "./IReportRepository"
import type { Report, Insertable } from "@/types/database.types"

/**
 * Dependency Inversion Principle Tests
 *
 * These tests demonstrate that:
 * 1. Business logic can work with ANY implementation of the interfaces
 * 2. Mock implementations fully satisfy the interface contracts
 * 3. We can test without a real database
 *
 * Key insight: These tests use the INTERFACE types, not the concrete types.
 * This proves that any implementation can be swapped in.
 */

describe("Dependency Inversion Principle", () => {
  describe("IReportRepository interface", () => {
    // Use INTERFACE type, not concrete MockReportRepository
    let repository: IReportRepository

    beforeEach(() => {
      // In tests, we inject the mock. In production, Supabase is injected.
      repository = new MockReportRepository()
    })

    const sampleReport: Insertable<"report"> = {
      title: "Test Report",
      description: "This is a test report for DIP demonstration",
      latitude: 45.815,
      longitude: 15.982,
      category_id: 1,
      user_id: "user-123",
    }

    it("can create a report through the interface", async () => {
      const report = await repository.create(sampleReport)

      expect(report.id).toBeDefined()
      expect(report.title).toBe("Test Report")
      expect(report.description).toBe("This is a test report for DIP demonstration")
    })

    it("can find a report by ID through the interface", async () => {
      const created = await repository.create(sampleReport)
      const found = await repository.findById(created.id)

      expect(found).not.toBeNull()
      expect(found?.id).toBe(created.id)
    })

    it("returns null for non-existent report", async () => {
      const found = await repository.findById("non-existent")

      expect(found).toBeNull()
    })

    it("can find all reports through the interface", async () => {
      await repository.create(sampleReport)
      await repository.create({ ...sampleReport, title: "Second Report" })

      const reports = await repository.findAll()

      expect(reports).toHaveLength(2)
    })

    it("can filter reports through the interface", async () => {
      await repository.create({ ...sampleReport, category_id: 1 })
      await repository.create({ ...sampleReport, category_id: 2 })

      const filtered = await repository.findAll({ categoryId: 1 })

      expect(filtered).toHaveLength(1)
      expect(filtered[0].category_id).toBe(1)
    })

    it("can update a report through the interface", async () => {
      const created = await repository.create(sampleReport)
      const updated = await repository.update(created.id, { title: "Updated Title" })

      expect(updated.title).toBe("Updated Title")
    })

    it("can delete a report through the interface", async () => {
      const created = await repository.create(sampleReport)
      await repository.delete(created.id)
      const found = await repository.findById(created.id)

      expect(found).toBeNull()
    })
  })

  describe("IPhotoStorage interface", () => {
    let storage: IPhotoStorage

    beforeEach(() => {
      storage = new MockPhotoStorage()
    })

    it("can upload a file through the interface", async () => {
      const file = new File(["photo content"], "test.jpg", { type: "image/jpeg" })
      const url = await storage.upload("reports/123/photo.jpg", file)

      expect(url).toContain("reports/123/photo.jpg")
    })

    it("can get public URL through the interface", () => {
      const url = storage.getPublicUrl("reports/123/photo.jpg")

      expect(url).toBeDefined()
      expect(typeof url).toBe("string")
    })

    it("can delete a file through the interface", async () => {
      const file = new File(["photo content"], "test.jpg", { type: "image/jpeg" })
      await storage.upload("reports/123/photo.jpg", file)

      // Should not throw
      await expect(storage.delete("reports/123/photo.jpg")).resolves.toBeUndefined()
    })
  })

  describe("IPhotoRepository interface", () => {
    let photoRepository: IPhotoRepository

    beforeEach(() => {
      photoRepository = new MockPhotoRepository()
    })

    it("can create a photo record through the interface", async () => {
      const photo = await photoRepository.create({
        url: "https://example.com/photo.jpg",
        filename: "photo.jpg",
        report_id: "report-123",
      })

      expect(photo.id).toBeDefined()
      expect(photo.url).toBe("https://example.com/photo.jpg")
    })

    it("can find photos by report ID through the interface", async () => {
      await photoRepository.create({
        url: "https://example.com/photo1.jpg",
        filename: "photo1.jpg",
        report_id: "report-123",
      })
      await photoRepository.create({
        url: "https://example.com/photo2.jpg",
        filename: "photo2.jpg",
        report_id: "report-123",
      })
      await photoRepository.create({
        url: "https://example.com/photo3.jpg",
        filename: "photo3.jpg",
        report_id: "report-456", // Different report
      })

      const photos = await photoRepository.findByReportId("report-123")

      expect(photos).toHaveLength(2)
    })
  })

  describe("DIP in action - business logic using interfaces", () => {
    /**
     * This test demonstrates how business logic can work with
     * ANY implementation of the interfaces.
     */

    // Business logic function that depends on ABSTRACTION
    async function createReportWithPhotos(
      reportRepository: IReportRepository,
      photoStorage: IPhotoStorage,
      photoRepository: IPhotoRepository,
      reportData: Insertable<"report">,
      files: File[]
    ): Promise<{ report: Report; photoUrls: string[] }> {
      // Create the report
      const report = await reportRepository.create(reportData)

      // Upload photos and create records
      const photoUrls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const path = `reports/${report.id}/${Date.now()}-${i}-${file.name}`
        const url = await photoStorage.upload(path, file)
        await photoRepository.create({
          url,
          filename: file.name,
          report_id: report.id,
        })
        photoUrls.push(url)
      }

      return { report, photoUrls }
    }

    it("business logic works with mock implementations", async () => {
      // Inject mock implementations
      const reportRepo = new MockReportRepository()
      const photoStorage = new MockPhotoStorage()
      const photoRepo = new MockPhotoRepository()

      const files = [
        new File(["content1"], "photo1.jpg", { type: "image/jpeg" }),
        new File(["content2"], "photo2.jpg", { type: "image/jpeg" }),
      ]

      const result = await createReportWithPhotos(
        reportRepo,
        photoStorage,
        photoRepo,
        {
          title: "Report with photos",
          description: "This report has multiple photos attached",
          latitude: 45.8,
          longitude: 15.9,
          category_id: 1,
          user_id: "user-1",
        },
        files
      )

      expect(result.report.title).toBe("Report with photos")
      expect(result.photoUrls).toHaveLength(2)

      // Verify photos were stored
      const photos = await photoRepo.findByReportId(result.report.id)
      expect(photos).toHaveLength(2)
    })

    it("demonstrates swappable implementations", async () => {
      // The same business logic function works with different implementations
      // In production: Supabase implementations
      // In tests: Mock implementations

      // This function accepts INTERFACES, not concrete types
      async function getReportCount(repository: IReportRepository): Promise<number> {
        const reports = await repository.findAll()
        return reports.length
      }

      // Works with mock
      const mockRepo = new MockReportRepository()
      await mockRepo.create({
        title: "Test",
        description: "Test description",
        latitude: 45.8,
        longitude: 15.9,
        category_id: 1,
      })

      const count = await getReportCount(mockRepo)
      expect(count).toBe(1)

      // In production, the same function would work with SupabaseReportRepository
      // because both implement IReportRepository
    })
  })
})
