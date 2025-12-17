/**
 * Repository Context - Dependency Injection via React Context
 *
 * SOLID Principle: Dependency Inversion Principle (DIP)
 *
 * This context provides repository implementations to the application.
 * Components and hooks depend on the INTERFACE, and this context
 * provides the actual IMPLEMENTATION.
 *
 * Benefits:
 * - Swap implementations by changing the provider (e.g., for testing)
 * - Components don't know or care about Supabase
 * - Clean separation of concerns
 */

import { createContext, useContext, useMemo, type ReactNode } from "react"
import type { IReportRepository, IPhotoStorage, IPhotoRepository } from "./IReportRepository"
import {
  createSupabaseReportRepository,
  createSupabasePhotoStorage,
  createSupabasePhotoRepository,
} from "./SupabaseReportRepository"

// =============================================================================
// CONTEXT TYPE
// =============================================================================

interface RepositoryContextValue {
  reportRepository: IReportRepository
  photoStorage: IPhotoStorage
  photoRepository: IPhotoRepository
}

// =============================================================================
// CONTEXT
// =============================================================================

const RepositoryContext = createContext<RepositoryContextValue | null>(null)

// =============================================================================
// PROVIDER
// =============================================================================

interface RepositoryProviderProps {
  children: ReactNode
  // Allow injection of custom implementations (for testing)
  reportRepository?: IReportRepository
  photoStorage?: IPhotoStorage
  photoRepository?: IPhotoRepository
}

/**
 * Provides repository implementations to the application.
 *
 * Usage:
 * ```tsx
 * // Production - uses Supabase implementations (default)
 * <RepositoryProvider>
 *   <App />
 * </RepositoryProvider>
 *
 * // Testing - inject mock implementations
 * <RepositoryProvider
 *   reportRepository={mockReportRepo}
 *   photoStorage={mockPhotoStorage}
 * >
 *   <ComponentUnderTest />
 * </RepositoryProvider>
 * ```
 */
export function RepositoryProvider({
  children,
  reportRepository,
  photoStorage,
  photoRepository,
}: RepositoryProviderProps) {
  // Create default Supabase implementations if not provided
  const value = useMemo<RepositoryContextValue>(
    () => ({
      reportRepository: reportRepository ?? createSupabaseReportRepository(),
      photoStorage: photoStorage ?? createSupabasePhotoStorage(),
      photoRepository: photoRepository ?? createSupabasePhotoRepository(),
    }),
    [reportRepository, photoStorage, photoRepository]
  )

  return <RepositoryContext.Provider value={value}>{children}</RepositoryContext.Provider>
}

// =============================================================================
// HOOKS - Access repositories following DIP
// =============================================================================

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

// =============================================================================
// EXAMPLE: How hooks use DIP
// =============================================================================

/**
 * Example of a hook that follows DIP:
 *
 * ```typescript
 * // Before DIP (BAD):
 * import { supabase } from "@/lib/supabase"
 *
 * export function useCreateReport() {
 *   return useMutation({
 *     mutationFn: async (data) => {
 *       const { data: report, error } = await supabase.from("report").insert(data)
 *       // ... tightly coupled to Supabase
 *     }
 *   })
 * }
 *
 * // After DIP (GOOD):
 * import { useReportRepository } from "./RepositoryContext"
 *
 * export function useCreateReport() {
 *   const repository = useReportRepository()  // Depends on abstraction!
 *
 *   return useMutation({
 *     mutationFn: async (data) => {
 *       return await repository.create(data)  // Uses interface method
 *     }
 *   })
 * }
 * ```
 *
 * The second version:
 * - Doesn't know about Supabase
 * - Can be tested with MockReportRepository
 * - Can switch databases by changing the provider
 */
