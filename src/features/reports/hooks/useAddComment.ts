import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

interface AddCommentData {
  reportId: string
  content: string
}

export function useAddComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ reportId, content }: AddCommentData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from("comment")
        .insert({
          report_id: reportId,
          user_id: user?.id,
          content,
        })
        .select(
          `
          *,
          user:profiles(*)
        `
        )
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["report", variables.reportId] })
    },
  })
}
