// usePosts -> DIP (IPostRepository umjesto direktnog supabasea), SRP (repo dohvaca podatke)
import { useQuery } from "@tanstack/react-query"
import type { Post, Profile } from "@/types/database.types"
import { SupabasePostRepository } from "../repositories/SupabasePostRepository"
import type { IPostRepository } from "../interfaces/IPostRepository"

export interface PostWithProfile extends Post {
  user: Profile | null
}

const postRepository: IPostRepository = new SupabasePostRepository()

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      // DIP + SRP: repo dohvaca podatke, lako mogu zamjeniti bazu samo pormjenim rpeo
      return await postRepository.getAllPosts()
    },
  })
}
