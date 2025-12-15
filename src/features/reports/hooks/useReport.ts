import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { ReportWithRelations, Photo, Comment, Profile } from "@/types/database.types"

export interface ReportDetails extends ReportWithRelations {
  photos: Photo[]
  comments: (Comment & { user?: Profile })[]
}

export function useReport(id: string | undefined) {
  return useQuery({
    queryKey: ["report", id],
    queryFn: async (): Promise<ReportDetails | null> => {
      if (!id) return null

      // Fetch report with category, status, and user
      const { data: report, error: reportError } = await supabase
        .from("report")
        .select(
          `
          *,
          category(*),
          status(*),
          user:profiles!report_user_id_fkey(*),
          assigned_worker:profiles!report_assigned_worker_id_fkey(*)
        `
        )
        .eq("id", id)
        .single()

      if (reportError) throw reportError
      if (!report) return null

      // Fetch photos
      const { data: photos } = await supabase
        .from("photo")
        .select("*")
        .eq("report_id", id)
        .order("uploaded_at", { ascending: true })

      // Fetch comments with user info
      const { data: comments } = await supabase
        .from("comment")
        .select(
          `
          *,
          user:profiles(*)
        `
        )
        .eq("report_id", id)
        .order("created_at", { ascending: true })

      // Record view
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("report_view").insert({
          report_id: id,
          user_id: user.id,
        })
      }

      return {
        ...report,
        photos: photos || [],
        comments: comments || [],
      } as ReportDetails
    },
    enabled: !!id,
  })
}
