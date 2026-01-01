import { supabase } from "@/lib/supabase"
import { Category, ReportWithRelations, Status } from "@/types/database.types"
import { useEffect, useState } from "react"

interface UseAdminTicketsReturn {
  reports: ReportWithRelations[]
  categories: Category[]
  statuses: Status[]
  isLoading: boolean
  error: string | null
  refreshTickets: () => Promise<void>
}

export function useAdminTickets(): UseAdminTicketsReturn {
  const [reports, setReports] = useState<ReportWithRelations[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: reportsData, error: reportsError } = await supabase
        .from("report")
        .select(
          `
                    *,
                    category(*),
                    status(*),
                    user: profiles! report_user_id_fkey(*),
                    assigned_worker: profiles!report_assigned_worker_id_fkey(*)
                    `
        )
        .order("created_at", { ascending: false })

      if (reportsError) throw reportsError

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("category")
        .select("*")
        .order("name")

      if (categoriesError) throw categoriesError

      const { data: statusesData, error: statusesError } = await supabase
        .from("status")
        .select("*")
        .order("sort_order")

      if (statusesError) throw statusesError

      setReports(reportsData as ReportWithRelations[])
      setCategories(categoriesData as Category[])
      setStatuses(statusesData as Status[])
    } catch (err) {
      console.error("Error loading data:", err)
      setError("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return {
    reports,
    categories,
    statuses,
    isLoading,
    error,
    refreshTickets: loadData,
  }
}
