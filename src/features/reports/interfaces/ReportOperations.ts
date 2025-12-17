/**
 * Report Operations Interfaces
 *
 * SOLID Principle: Interface Segregation Principle (ISP)
 * "Clients should not be forced to depend on interfaces they do not use."
 *
 * This module demonstrates ISP by splitting one large "fat" interface into
 * multiple small, focused interfaces. Each client (Citizen, Worker, Admin)
 * only implements the interfaces they actually need.
 *
 * BAD: One IReportOperations interface with 15+ methods that forces all
 * implementations to include methods they don't use.
 *
 * GOOD: Multiple small interfaces (IReportReader, IReportCreator, etc.)
 * that can be composed based on actual needs.
 */

import type { Report, Category, Status, Photo, Comment } from "@/types/database.types"

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ReportFilters {
  statusId?: number
  categoryId?: number
  userId?: string
  priority?: string
  limit?: number
  offset?: number
}

export interface ReportStats {
  totalReports: number
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  byPriority: Record<string, number>
  averageResolutionTime?: number
}

export interface CreateReportData {
  title: string
  description: string
  categoryId: number
  latitude: number
  longitude: number
  address?: string
  userId?: string
  photos?: File[]
}

// =============================================================================
// SEGREGATED INTERFACES - Each has a single, focused responsibility
// =============================================================================

/**
 * Read-only operations for viewing reports.
 * Used by: Citizens, Workers, Admins (everyone can read)
 */
export interface IReportReader {
  getReport(id: string): Promise<Report | null>
  getReports(filters?: ReportFilters): Promise<Report[]>
  getReportWithDetails(
    id: string
  ): Promise<(Report & { photos: Photo[]; comments: Comment[] }) | null>
}

/**
 * Operations for creating new reports.
 * Used by: Citizens (primary), Admins (can create on behalf of citizens)
 */
export interface IReportCreator {
  createReport(data: CreateReportData): Promise<Report>
}

/**
 * Operations for updating own reports.
 * Used by: Citizens (own reports only), Workers, Admins
 */
export interface IReportUpdater {
  updateReport(id: string, data: Partial<Report>): Promise<Report>
}

/**
 * Operations for managing photos.
 * Used by: Citizens (on own reports), Admins
 */
export interface IPhotoManager {
  uploadPhoto(reportId: string, file: File): Promise<Photo>
  deletePhoto(photoId: string): Promise<void>
  getPhotos(reportId: string): Promise<Photo[]>
}

/**
 * Operations for managing comments.
 * Used by: Citizens, Workers, Admins (everyone can comment)
 */
export interface ICommentManager {
  addComment(reportId: string, content: string, userId: string): Promise<Comment>
  getComments(reportId: string): Promise<Comment[]>
  deleteComment(commentId: string): Promise<void>
}

/**
 * Administrative operations - status changes, assignments, deletions.
 * Used by: Admins only
 */
export interface IReportAdmin {
  updateStatus(reportId: string, statusId: number): Promise<Report>
  assignWorker(reportId: string, workerId: string): Promise<Report>
  unassignWorker(reportId: string): Promise<Report>
  deleteReport(reportId: string): Promise<void>
  setPriority(reportId: string, priority: string): Promise<Report>
}

/**
 * Analytics and reporting operations.
 * Used by: Admins only
 */
export interface IReportAnalytics {
  getStatistics(filters?: ReportFilters): Promise<ReportStats>
  getReportsByDateRange(startDate: Date, endDate: Date): Promise<Report[]>
  exportToCSV(filters?: ReportFilters): Promise<string>
}

/**
 * Category management operations.
 * Used by: Public read, Admin write
 */
export interface ICategoryManager {
  getCategories(): Promise<Category[]>
  getCategory(id: number): Promise<Category | null>
}

/**
 * Status management operations.
 * Used by: Public read, Admin write
 */
export interface IStatusManager {
  getStatuses(): Promise<Status[]>
  getStatus(id: number): Promise<Status | null>
}

// =============================================================================
// ROLE-BASED COMPOSED INTERFACES
// =============================================================================

/**
 * Citizen service interface - combines only what citizens need.
 * Citizens can: read reports, create reports, upload photos, comment
 * Citizens CANNOT: change status, assign workers, see analytics, delete others' reports
 */
export interface ICitizenReportService
  extends
    IReportReader,
    IReportCreator,
    IPhotoManager,
    ICommentManager,
    ICategoryManager,
    IStatusManager {}

/**
 * Worker service interface - what city workers need.
 * Workers can: read reports, update reports, comment
 * Workers CANNOT: create reports, see analytics, delete reports
 */
export interface IWorkerReportService
  extends IReportReader, IReportUpdater, ICommentManager, ICategoryManager, IStatusManager {}

/**
 * Admin service interface - full access to all operations.
 * Admins can: everything
 */
export interface IAdminReportService
  extends
    IReportReader,
    IReportCreator,
    IReportUpdater,
    IPhotoManager,
    ICommentManager,
    IReportAdmin,
    IReportAnalytics,
    ICategoryManager,
    IStatusManager {}

// =============================================================================
// WHY ISP MATTERS - THE BAD ALTERNATIVE
// =============================================================================

/**
 * BAD EXAMPLE: A "fat" interface that violates ISP.
 * This is what we're AVOIDING by using segregated interfaces.
 *
 * Problems:
 * 1. CitizenService would have to implement updateStatus, assignWorker, deleteReport
 *    even though citizens can't do these things
 * 2. WorkerService would have to implement createReport, uploadPhoto, getStatistics
 *    even though workers don't need these
 * 3. Changes to admin-only methods would affect citizen and worker code
 * 4. Testing becomes harder - must mock methods that aren't used
 *
 * @deprecated This is an anti-pattern - shown here for educational purposes only
 */
export interface IBadFatInterface {
  // Reading (everyone needs)
  getReport(id: string): Promise<Report | null>
  getReports(filters?: ReportFilters): Promise<Report[]>

  // Creating (citizens need)
  createReport(data: CreateReportData): Promise<Report>

  // Photos (citizens need)
  uploadPhoto(reportId: string, file: File): Promise<Photo>
  deletePhoto(photoId: string): Promise<void>

  // Comments (everyone needs)
  addComment(reportId: string, content: string, userId: string): Promise<Comment>
  getComments(reportId: string): Promise<Comment[]>

  // Admin only - but everyone has to implement!
  updateStatus(reportId: string, statusId: number): Promise<Report>
  assignWorker(reportId: string, workerId: string): Promise<Report>
  deleteReport(reportId: string): Promise<void>

  // Analytics - admin only, but everyone has to implement!
  getStatistics(filters?: ReportFilters): Promise<ReportStats>
  exportToCSV(filters?: ReportFilters): Promise<string>
}

/**
 * BAD EXAMPLE: What a citizen implementation would look like with fat interface.
 * Notice all the methods that throw "Not implemented" - this is a code smell!
 *
 * @deprecated Anti-pattern example
 */
export abstract class BadCitizenServiceExample implements IBadFatInterface {
  // These would actually be implemented...
  abstract getReport(id: string): Promise<Report | null>
  abstract getReports(filters?: ReportFilters): Promise<Report[]>
  abstract createReport(data: CreateReportData): Promise<Report>
  abstract uploadPhoto(reportId: string, file: File): Promise<Photo>
  abstract deletePhoto(photoId: string): Promise<void>
  abstract addComment(reportId: string, content: string, userId: string): Promise<Comment>
  abstract getComments(reportId: string): Promise<Comment[]>

  // But these would throw errors - BAD!
  updateStatus(): Promise<Report> {
    throw new Error("Citizens cannot update status")
  }
  assignWorker(): Promise<Report> {
    throw new Error("Citizens cannot assign workers")
  }
  deleteReport(): Promise<void> {
    throw new Error("Citizens cannot delete reports")
  }
  getStatistics(): Promise<ReportStats> {
    throw new Error("Citizens cannot access statistics")
  }
  exportToCSV(): Promise<string> {
    throw new Error("Citizens cannot export data")
  }
}
