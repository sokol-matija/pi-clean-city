import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Post, Profile } from "@/types/database.types"

export interface PostWithProfile extends Post {
  user: Profile | null
}

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post")
        .select(
          `
          *,
          user:profiles!post_userId_fkey(*)
        `
        )
        .order("created_at", { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data as PostWithProfile[]
    },
  })
}
