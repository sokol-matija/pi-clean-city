import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { NotificationFactory } from "@/features/notifications/patterns/Factory/NotificationFactory"
import { NtfyService } from "@/features/notifications/services/NtfyService"
import { getUserTopic } from "@/features/notifications/utils/topicHelpers"

interface AddCommentData {
  reportId: string
  content: string
}

export function useAddComment() {
  const queryClient = useQueryClient()
  const ntfyService = new NtfyService()

  return useMutation({
    mutationFn: async ({ reportId, content }: AddCommentData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data: commenterProfile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user?.id)
        .single()

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

      const { data: report } = await supabase
        .from("report")
        .select(
          `
          *,
          user:profiles!report_user_id_fkey(username)
        `
        )
        .eq("id", reportId)
        .single()

      if (report && report.user && user?.id !== report.user_id) {
        try {
          const notification = NotificationFactory.createCommentNotification({
            topic: getUserTopic(report.user.username),
            reportId: reportId,
            commenterName: commenterProfile?.username || "Someone",
            commentPreview: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
            reportTitle: report.title,
          })

          await ntfyService.publish({
            topic: notification.topic,
            message: notification.message,
            title: notification.title,
            priority: notification.priority,
            tags: notification.tags,
            click: notification.click,
            actions: notification.actions,
          })
        } catch (notifError) {
          console.error("Failed to send notification:", notifError)
        }
      }

      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["report", variables.reportId] })
    },
  })
}
