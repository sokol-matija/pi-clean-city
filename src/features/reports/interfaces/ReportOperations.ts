import type { Report, Category, Status, Photo, Comment } from "@/types/database.types"

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

export interface IReportReader {
  getReport(id: string): Promise<Report | null>
  getReports(filters?: ReportFilters): Promise<Report[]>
  getReportWithDetails(
    id: string
  ): Promise<(Report & { photos: Photo[]; comments: Comment[] }) | null>
}

export interface IReportCreator {
  createReport(data: CreateReportData): Promise<Report>
}

export interface IReportUpdater {
  updateReport(id: string, data: Partial<Report>): Promise<Report>
}

export interface IPhotoManager {
  uploadPhoto(reportId: string, file: File): Promise<Photo>
  deletePhoto(photoId: string): Promise<void>
  getPhotos(reportId: string): Promise<Photo[]>
}

export interface ICommentManager {
  addComment(reportId: string, content: string, userId: string): Promise<Comment>
  getComments(reportId: string): Promise<Comment[]>
  deleteComment(commentId: string): Promise<void>
}

export interface IReportAdmin {
  updateStatus(reportId: string, statusId: number): Promise<Report>
  assignWorker(reportId: string, workerId: string): Promise<Report>
  unassignWorker(reportId: string): Promise<Report>
  deleteReport(reportId: string): Promise<void>
  setPriority(reportId: string, priority: string): Promise<Report>
}

export interface IReportAnalytics {
  getStatistics(filters?: ReportFilters): Promise<ReportStats>
  getReportsByDateRange(startDate: Date, endDate: Date): Promise<Report[]>
  exportToCSV(filters?: ReportFilters): Promise<string>
}

export interface ICategoryManager {
  getCategories(): Promise<Category[]>
  getCategory(id: number): Promise<Category | null>
}

export interface IStatusManager {
  getStatuses(): Promise<Status[]>
  getStatus(id: number): Promise<Status | null>
}

export interface ICitizenReportService
  extends
    IReportReader,
    IReportCreator,
    IPhotoManager,
    ICommentManager,
    ICategoryManager,
    IStatusManager {}

export interface IWorkerReportService
  extends IReportReader, IReportUpdater, ICommentManager, ICategoryManager, IStatusManager {}

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
