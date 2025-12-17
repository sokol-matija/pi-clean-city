/**
 * Mock Report Repository
 *
 * SOLID Principle: Dependency Inversion Principle (DIP)
 *
 * This is a MOCK IMPLEMENTATION of the repository interfaces.
 * Used for:
 * - Unit testing without a database
 * - Development without Supabase connection
 * - Demonstration of how DIP enables swappable implementations
 *
 * Because our business logic depends on ABSTRACTIONS (interfaces),
 * we can easily swap Supabase for this mock implementation.
 */

import type { Report, Photo, Insertable } from "@/types/database.types"
import type {
  IReportRepository,
  IPhotoStorage,
  IPhotoRepository,
  ReportFilters,
} from "./IReportRepository"

// =============================================================================
// MOCK REPORT REPOSITORY
// =============================================================================

/**
 * In-memory implementation of IReportRepository.
 * Perfect for testing and development.
 */
export class MockReportRepository implements IReportRepository {
  private reports: Map<string, Report> = new Map()
  private nextId = 1

  async create(report: Insertable<"report">): Promise<Report> {
    const newReport: Report = {
      ...report,
      id: `mock-${this.nextId++}`,
      created_at: new Date().toISOString(),
      resolved_at: null,
      status_id: report.status_id || 1,
      priority: report.priority || "medium",
    } as Report

    this.reports.set(newReport.id, newReport)
    return newReport
  }

  async findById(id: string): Promise<Report | null> {
    return this.reports.get(id) || null
  }

  async findAll(filters?: ReportFilters): Promise<Report[]> {
    let results = Array.from(this.reports.values())

    if (filters?.statusId) {
      results = results.filter((r) => r.status_id === filters.statusId)
    }
    if (filters?.categoryId) {
      results = results.filter((r) => r.category_id === filters.categoryId)
    }
    if (filters?.userId) {
      results = results.filter((r) => r.user_id === filters.userId)
    }
    if (filters?.priority) {
      results = results.filter((r) => r.priority === filters.priority)
    }

    // Sort
    results.sort((a, b) => {
      const direction = filters?.orderDirection === "asc" ? 1 : -1
      return direction * (new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    })

    // Pagination
    if (filters?.offset) {
      results = results.slice(filters.offset)
    }
    if (filters?.limit) {
      results = results.slice(0, filters.limit)
    }

    return results
  }

  async update(id: string, data: Partial<Report>): Promise<Report> {
    const existing = this.reports.get(id)
    if (!existing) {
      throw new Error(`Report not found: ${id}`)
    }

    const updated = { ...existing, ...data }
    this.reports.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    if (!this.reports.has(id)) {
      throw new Error(`Report not found: ${id}`)
    }
    this.reports.delete(id)
  }

  // Test helpers
  clear(): void {
    this.reports.clear()
    this.nextId = 1
  }

  seed(reports: Report[]): void {
    reports.forEach((r) => this.reports.set(r.id, r))
  }

  getAll(): Report[] {
    return Array.from(this.reports.values())
  }
}

// =============================================================================
// MOCK PHOTO STORAGE
// =============================================================================

/**
 * In-memory implementation of IPhotoStorage.
 * Simulates file storage without actual uploads.
 */
export class MockPhotoStorage implements IPhotoStorage {
  private storage: Map<string, string> = new Map()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async upload(path: string, _file: File): Promise<string> {
    const url = `mock://storage/${path}`
    this.storage.set(path, url)
    return url
  }

  async delete(path: string): Promise<void> {
    this.storage.delete(path)
  }

  getPublicUrl(path: string): string {
    return this.storage.get(path) || `mock://storage/${path}`
  }

  // Test helpers
  clear(): void {
    this.storage.clear()
  }

  getAll(): Map<string, string> {
    return new Map(this.storage)
  }
}

// =============================================================================
// MOCK PHOTO REPOSITORY
// =============================================================================

/**
 * In-memory implementation of IPhotoRepository.
 */
export class MockPhotoRepository implements IPhotoRepository {
  private photos: Map<string, Photo> = new Map()
  private nextId = 1

  async create(photo: Insertable<"photo">): Promise<Photo> {
    const newPhoto: Photo = {
      ...photo,
      id: `mock-photo-${this.nextId++}`,
      uploaded_at: new Date().toISOString(),
    } as Photo

    this.photos.set(newPhoto.id, newPhoto)
    return newPhoto
  }

  async findByReportId(reportId: string): Promise<Photo[]> {
    return Array.from(this.photos.values()).filter((p) => p.report_id === reportId)
  }

  async delete(id: string): Promise<void> {
    this.photos.delete(id)
  }

  // Test helpers
  clear(): void {
    this.photos.clear()
    this.nextId = 1
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create a new mock report repository instance.
 */
export function createMockReportRepository(): MockReportRepository {
  return new MockReportRepository()
}

/**
 * Create a new mock photo storage instance.
 */
export function createMockPhotoStorage(): MockPhotoStorage {
  return new MockPhotoStorage()
}

/**
 * Create a new mock photo repository instance.
 */
export function createMockPhotoRepository(): MockPhotoRepository {
  return new MockPhotoRepository()
}
