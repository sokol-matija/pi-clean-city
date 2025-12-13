import { useMutation, useQueryClient } from '@tanstack/react-query'

import { supabase } from '@/lib/supabase'

interface CreatePostData {
  title: string
  content: string
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ title, content }: CreatePostData) => {
      //console.log('useCreatePost - Insertam sa:', { title, content })
      
      try {
        console.log('Slanje zahtjeva')
        const response = await supabase
          .from('post')
          .insert({ title, content })
          .select()
          .single()

        console.log('Response je:', response)
        const { data: newPost, error: postError, status } = response

        console.log('Parsean response:', { 
          status, 
          newPost, 
          postError: postError ? { message: postError.message, code: postError.code } : null 
        })

        if (postError) {
          console.error('Error:', postError)
          throw postError
        }

        return newPost
      } catch (err) {
        console.error('Error:', err)
        throw err
      }
    },
    onSuccess: (data) => {
      console.log('Post uspjesan:', data)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => {
      console.error('Error:', error)
    }
  })
}
