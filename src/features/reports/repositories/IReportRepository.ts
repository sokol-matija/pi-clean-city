/**
 * Report Repository Interface
 *
 * SOLID Principle: Dependency Inversion Principle (DIP)
 * "High-level modules should not depend on low-level modules.
 *  Both should depend on abstractions."
 *
 * This interface defines the contract for report data operations.
 * The application code depends on this ABSTRACTION, not on concrete
 * implementations like Supabase.
 *
 * Benefits:
 * - Business logic is decoupled from database implementation
 * - Can switch from Supabase to Firebase, Postgres, etc. without changing hooks
 * - Easy to create mock implementations for testing
 * - Clear separation between what (interface) and how (implementation)
 */

import type { Report, Photo, Insertable } from "@/types/database.types"

// =============================================================================
// REPOSITORY INTERFACES - Abstractions that high-level modules depend on
// =============================================================================

/**
 * Report repository interface - defines data operations for reports.
 * This is the ABSTRACTION that business logic depends on.
 */
export interface IReportRepository {
  /**
   * Create a new report.
   */
  create(report: Insertable<"report">): Promise<Report>

  /**
   * Find a report by ID.
   */
  findById(id: string): Promise<Report | null>

  /**
   * Find all reports matching optional filters.
   */
  findAll(filters?: ReportFilters): Promise<Report[]>

  /**
   * Update an existing report.
   */
  update(id: string, data: Partial<Report>): Promise<Report>

  /**
   * Delete a report.
   */
  delete(id: string): Promise<void>
}

/**
 * Photo storage interface - defines operations for photo uploads.
 * This is the ABSTRACTION that business logic depends on.
 */
export interface IPhotoStorage {
  /**
   * Upload a photo file and return the public URL.
   */
  upload(path: string, file: File): Promise<string>

  /**
   * Delete a photo by path.
   */
  delete(path: string): Promise<void>

  /**
   * Get the public URL for a photo.
   */
  getPublicUrl(path: string): string
}

/**
 * Photo record repository - manages photo metadata in the database.
 */
export interface IPhotoRepository {
  /**
   * Create a photo record.
   */
  create(photo: Insertable<"photo">): Promise<Photo>

  /**
   * Find photos by report ID.
   */
  findByReportId(reportId: string): Promise<Photo[]>

  /**
   * Delete a photo record.
   */
  delete(id: string): Promise<void>
}

// =============================================================================
// FILTER TYPES
// =============================================================================

export interface ReportFilters {
  statusId?: number
  categoryId?: number
  userId?: string
  priority?: string
  limit?: number
  offset?: number
  orderBy?: "created_at" | "updated_at"
  orderDirection?: "asc" | "desc"
}

// =============================================================================
// WHY DIP MATTERS - THE BAD ALTERNATIVE
// =============================================================================

/**
 * BAD EXAMPLE: Direct dependency on Supabase (what we're avoiding)
 *
 * ```typescript
 * // useCreateReport.ts - VIOLATES DIP
 * import { supabase } from "@/lib/supabase"  // Direct dependency on low-level module!
 *
 * export function useCreateReport() {
 *   return useMutation({
 *     mutationFn: async (data) => {
 *       // Tightly coupled to Supabase API
 *       const { data: report, error } = await supabase
 *         .from("report")
 *         .insert(data)
 *         .select()
 *         .single()
 *
 *       if (error) throw error
 *       return report
 *     },
 *   })
 * }
 * ```
 *
 * Problems:
 * 1. Can't test without Supabase (need real database)
 * 2. Can't switch to different database without changing hook code
 * 3. Business logic mixed with data access details
 * 4. Changes to Supabase API require changes everywhere it's used
 *
 * GOOD EXAMPLE: Depend on abstraction (what we're doing)
 *
 * ```typescript
 * // useCreateReport.ts - FOLLOWS DIP
 * import { useReportRepository } from "./useReportRepository"  // Depends on abstraction
 *
 * export function useCreateReport() {
 *   const repository = useReportRepository()  // Injected dependency
 *
 *   return useMutation({
 *     mutationFn: async (data) => {
 *       // Uses abstraction, doesn't know about Supabase
 *       return await repository.create(data)
 *     },
 *   })
 * }
 * ```
 *
 * Benefits:
 * 1. Can inject mock repository for testing
 * 2. Can switch database by providing different implementation
 * 3. Business logic is clean, no database details
 * 4. Changes to Supabase API only affect the repository implementation
 */
