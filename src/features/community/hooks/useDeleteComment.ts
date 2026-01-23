// useDeleteComment -> DIP (ICommentRepository), SRP (samo brisanje komentara)
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { SupabaseCommentRepository } from "../repositories/SupabaseCommentRepository"
import type { ICommentRepository } from "../interfaces/ICommentRepository"

const commentRepository: ICommentRepository = new SupabaseCommentRepository()

interface DeleteCommentParams {
  commentId: string
  postId: number
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ commentId }: DeleteCommentParams) => {
      // trenutni korisnik iz supa autha
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to delete a comment")
      }

      await commentRepository.deleteComment(commentId, user.id)
      return commentId
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] })
    },
  })
}
