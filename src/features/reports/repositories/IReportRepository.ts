import type { Report, Photo, Insertable } from "@/types/database.types"

export interface IReportRepository {
  create(report: Insertable<"report">): Promise<Report>
  findById(id: string): Promise<Report | null>
  findAll(filters?: ReportFilters): Promise<Report[]>
  update(id: string, data: Partial<Report>): Promise<Report>
  delete(id: string): Promise<void>
}

export interface IPhotoStorage {
  upload(path: string, file: File): Promise<string>
  delete(path: string): Promise<void>
  getPublicUrl(path: string): string
}

export interface IPhotoRepository {
  create(photo: Insertable<"photo">): Promise<Photo>
  findByReportId(reportId: string): Promise<Photo[]>
  delete(id: string): Promise<void>
}

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
