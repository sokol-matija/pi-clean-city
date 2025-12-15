import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Category } from "@/types/database.types"

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("category").select("*").order("name")

      if (error) throw error
      return data as Category[]
    },
  })
}
