/**
 * Supabase Report Repository
 *
 * SOLID Principle: Dependency Inversion Principle (DIP)
 *
 * This is a CONCRETE IMPLEMENTATION of the IReportRepository interface.
 * It contains all the Supabase-specific code, isolating it from business logic.
 *
 * Key insight: The application doesn't import this directly.
 * Instead, it imports the interface and receives this implementation
 * through dependency injection (via React Context or direct instantiation).
 */

import { supabase } from "@/lib/supabase"
import type { Report, Photo, Insertable } from "@/types/database.types"
import type {
  IReportRepository,
  IPhotoStorage,
  IPhotoRepository,
  ReportFilters,
} from "./IReportRepository"

// =============================================================================
// SUPABASE REPORT REPOSITORY
// =============================================================================

/**
 * Supabase implementation of IReportRepository.
 * All Supabase-specific code is contained here.
 */
export class SupabaseReportRepository implements IReportRepository {
  async create(report: Insertable<"report">): Promise<Report> {
    const { data, error } = await supabase.from("report").insert(report).select().single()

    if (error) {
      console.error("SupabaseReportRepository.create error:", error)
      throw new Error(`Failed to create report: ${error.message}`)
    }

    return data
  }

  async findById(id: string): Promise<Report | null> {
    const { data, error } = await supabase
      .from("report")
      .select("*, category(*), status(*)")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") return null // Not found
      console.error("SupabaseReportRepository.findById error:", error)
      throw new Error(`Failed to find report: ${error.message}`)
    }

    return data
  }

  async findAll(filters?: ReportFilters): Promise<Report[]> {
    let query = supabase
      .from("report")
      .select("*, category(*), status(*)")
      .order(filters?.orderBy || "created_at", {
        ascending: filters?.orderDirection === "asc",
      })

    if (filters?.statusId) {
      query = query.eq("status_id", filters.statusId)
    }
    if (filters?.categoryId) {
      query = query.eq("category_id", filters.categoryId)
    }
    if (filters?.userId) {
      query = query.eq("user_id", filters.userId)
    }
    if (filters?.priority) {
      query = query.eq("priority", filters.priority)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error("SupabaseReportRepository.findAll error:", error)
      throw new Error(`Failed to fetch reports: ${error.message}`)
    }

    return data || []
  }

  async update(id: string, data: Partial<Report>): Promise<Report> {
    const { data: updated, error } = await supabase
      .from("report")
      .update(data)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("SupabaseReportRepository.update error:", error)
      throw new Error(`Failed to update report: ${error.message}`)
    }

    return updated
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("report").delete().eq("id", id)

    if (error) {
      console.error("SupabaseReportRepository.delete error:", error)
      throw new Error(`Failed to delete report: ${error.message}`)
    }
  }
}

// =============================================================================
// SUPABASE PHOTO STORAGE
// =============================================================================

/**
 * Supabase implementation of IPhotoStorage.
 * Handles file uploads to Supabase Storage.
 */
export class SupabasePhotoStorage implements IPhotoStorage {
  private bucketName = "report-photos"

  async upload(path: string, file: File): Promise<string> {
    const { error } = await supabase.storage.from(this.bucketName).upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    })

    if (error) {
      console.error("SupabasePhotoStorage.upload error:", error)
      throw new Error(`Failed to upload photo: ${error.message}`)
    }

    return this.getPublicUrl(path)
  }

  async delete(path: string): Promise<void> {
    const { error } = await supabase.storage.from(this.bucketName).remove([path])

    if (error) {
      console.error("SupabasePhotoStorage.delete error:", error)
      throw new Error(`Failed to delete photo: ${error.message}`)
    }
  }

  getPublicUrl(path: string): string {
    const { data } = supabase.storage.from(this.bucketName).getPublicUrl(path)
    return data.publicUrl
  }
}

// =============================================================================
// SUPABASE PHOTO REPOSITORY
// =============================================================================

/**
 * Supabase implementation of IPhotoRepository.
 * Manages photo metadata in the database.
 */
export class SupabasePhotoRepository implements IPhotoRepository {
  async create(photo: Insertable<"photo">): Promise<Photo> {
    const { data, error } = await supabase.from("photo").insert(photo).select().single()

    if (error) {
      console.error("SupabasePhotoRepository.create error:", error)
      throw new Error(`Failed to create photo record: ${error.message}`)
    }

    return data
  }

  async findByReportId(reportId: string): Promise<Photo[]> {
    const { data, error } = await supabase
      .from("photo")
      .select("*")
      .eq("report_id", reportId)
      .order("uploaded_at", { ascending: true })

    if (error) {
      console.error("SupabasePhotoRepository.findByReportId error:", error)
      throw new Error(`Failed to fetch photos: ${error.message}`)
    }

    return data || []
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("photo").delete().eq("id", id)

    if (error) {
      console.error("SupabasePhotoRepository.delete error:", error)
      throw new Error(`Failed to delete photo: ${error.message}`)
    }
  }
}

// =============================================================================
// FACTORY FUNCTIONS - Create repository instances
// =============================================================================

/**
 * Create a new Supabase report repository instance.
 * This is called by the DI container/context to provide implementations.
 */
export function createSupabaseReportRepository(): IReportRepository {
  return new SupabaseReportRepository()
}

/**
 * Create a new Supabase photo storage instance.
 */
export function createSupabasePhotoStorage(): IPhotoStorage {
  return new SupabasePhotoStorage()
}

/**
 * Create a new Supabase photo repository instance.
 */
export function createSupabasePhotoRepository(): IPhotoRepository {
  return new SupabasePhotoRepository()
}
