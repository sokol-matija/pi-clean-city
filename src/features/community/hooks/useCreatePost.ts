// useCreatePost -> DIP (IPostRepostiory umjesto dir. supabasea), SRP (repo sa bazom, validator s validacijom), OCP (mogu se dodati nova pravila validiranja bez mjenjanja ovog hooka)
// + OBSERVER PATTERN - emitira događaj kada se post kreira
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { supabase } from "@/lib/supabase"
import { SupabasePostRepository } from "../repositories/SupabasePostRepository"
import { createBasicValidator } from "../services/PostValidator"
import type { IPostRepository } from "../interfaces/IPostRepository"
// Observer Pattern - import event emittera
import { postEventEmitter } from "../patterns/Observer/PostEventEmitter"

interface CreatePostData {
  title: string
  content: string
}

// DIP: Kreiramo instancu repository-a koji implementira IPostRepository interface
const postRepository: IPostRepository = new SupabasePostRepository()

// OCP: Validator s pravilima - mozemo dodati nova pravila bez mijenjanja koda
const postValidator = createBasicValidator()

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ title, content }: CreatePostData) => {
      // OCP: Validacija kroz PostValidator
      const validationResult = postValidator.validate({ title, content })
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(", "))
      }

      // Get current user from Supabase auth
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Validate user is authenticated
      if (!user) {
        throw new Error("You must be logged in to create a post")
      }

      const newPost = await postRepository.createPost({
        title,
        content,
        userId: user.id,
      })

      // OBSERVER PATTERN: Emitiramo događaj da je post kreiran
      postEventEmitter.emit("post:created", {
        post: newPost,
        authorId: user.id,
      })

      return newPost
    },
    onSuccess: (data) => {
      console.log("Post uspjesan:", data)
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: (error) => {
      console.error("Error:", error)
    },
  })
}
