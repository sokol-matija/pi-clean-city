import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: number) => {
      // Get current user from Supabase auth
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to delete a post")
      }

      const { error } = await supabase.from("post").delete().eq("id", postId).eq("userId", user.id)

      if (error) {
        throw error
      }

      return postId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
