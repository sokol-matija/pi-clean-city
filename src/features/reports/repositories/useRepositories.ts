/**
 * Repository Hooks - Access repositories following DIP
 *
 * These hooks are separated from RepositoryContext.tsx to satisfy
 * React Fast Refresh requirements (components-only exports).
 */

import { useContext } from "react"
import type { IReportRepository, IPhotoStorage, IPhotoRepository } from "./IReportRepository"
import { RepositoryContext } from "./RepositoryContext"

/**
 * Access the report repository.
 * Returns the INTERFACE, not the concrete implementation.
 */
export function useReportRepository(): IReportRepository {
  const context = useContext(RepositoryContext)
  if (!context) {
    throw new Error("useReportRepository must be used within RepositoryProvider")
  }
  return context.reportRepository
}

/**
 * Access the photo storage.
 * Returns the INTERFACE, not the concrete implementation.
 */
export function usePhotoStorage(): IPhotoStorage {
  const context = useContext(RepositoryContext)
  if (!context) {
    throw new Error("usePhotoStorage must be used within RepositoryProvider")
  }
  return context.photoStorage
}

/**
 * Access the photo repository.
 * Returns the INTERFACE, not the concrete implementation.
 */
export function usePhotoRepository(): IPhotoRepository {
  const context = useContext(RepositoryContext)
  if (!context) {
    throw new Error("usePhotoRepository must be used within RepositoryProvider")
  }
  return context.photoRepository
}
