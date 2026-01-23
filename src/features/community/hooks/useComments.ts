import { useQuery } from "@tanstack/react-query"
import { SupabaseCommentRepository } from "../repositories/SupabaseCommentRepository"
import type { ICommentRepository } from "../interfaces/ICommentRepository"

const commentRepository: ICommentRepository = new SupabaseCommentRepository()

export function useComments(postId: number) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      return await commentRepository.getCommentsByPostId(postId)
    },
    enabled: !!postId,
  })
}
