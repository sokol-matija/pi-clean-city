import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Profile } from "@/types/database.types"

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("username", { ascending: true })

      if (error) {
        throw new Error(`Failed to fetch users: ${error.message}`)
      }

      return data ?? []
    },
    staleTime: 5 * 60 * 1000, // cacheaj usere 5 min
  })
}
