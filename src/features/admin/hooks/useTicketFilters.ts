/* 
    SRP Principle
    Handle ticket filtering logic

    This hook is responsible only for filtering
*/

import { ReportWithRelations } from "@/types/database.types"
import { useCallback, useMemo, useState } from "react"

interface FilterState {
  status: string
  category: string
}

interface UseTicketsFiltersReturn {
  filteredReports: ReportWithRelations[]
  filters: FilterState
  setStatusFilter: (status: string) => void
  setCategoryFilter: (category: string) => void
  clearFilters: () => void
}

export function useTicketFilters(allReports: ReportWithRelations[]): UseTicketsFiltersReturn {
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    category: "all",
  })

  const filteredReports = useMemo(() => {
    let filtered = [...allReports]

    if (filters.status !== "all") {
      filtered = filtered.filter((r) => r.status_id === Number.parseInt(filters.status))
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((r) => r.category_id === Number.parseInt(filters.category))
    }

    return filtered
  }, [allReports, filters])

  const setStatusFilter = useCallback((status: string) => {
    setFilters((prev) => ({ ...prev, status }))
  }, [])

  const setCategoryFilter = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({ status: "all", category: "all" })
  }, [])

  return {
    filteredReports,
    filters,
    setStatusFilter,
    setCategoryFilter,
    clearFilters,
  }
}
