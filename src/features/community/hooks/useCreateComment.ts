import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { SupabaseCommentRepository } from "../repositories/SupabaseCommentRepository"
import type { ICommentRepository } from "../interfaces/ICommentRepository"

const commentRepository: ICommentRepository = new SupabaseCommentRepository()

interface CreateCommentParams {
  postId: number
  content: string
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, content }: CreateCommentParams) => {
      // trenutni korisnik iz supa autha
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to comment")
      }

      return await commentRepository.createComment({
        post_id: postId,
        user_id: user.id,
        content,
      })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}
