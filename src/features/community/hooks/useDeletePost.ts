// useDeletePost -> DIP (IPostRepository umjesto dir. supa), SRP (samo crudalica nad repoom)
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"
import { SupabasePostRepository } from "../repositories/SupabasePostRepository"
import type { IPostRepository } from "../interfaces/IPostRepository"

const postRepository: IPostRepository = new SupabasePostRepository()

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

      // DIP + SRP: Koristimo repository za brisanje
      await postRepository.deletePost(postId, user.id)

      return postId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
