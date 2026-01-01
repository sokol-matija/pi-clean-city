import { supabase } from "@/lib/supabase"
import type { Post } from "@/types/database.types"
import type { IPostRepository, CreatePostData, UpdatePostData } from "../interfaces/IPostRepository"
import type { PostWithProfile } from "../hooks/usePosts"

export class SupabasePostRepository implements IPostRepository {
  async getAllPosts(): Promise<PostWithProfile[]> {
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
      throw new Error(`Failed to fetch posts: ${error.message}`)
    }

    return data as PostWithProfile[]
  }

  async getPostById(postId: number): Promise<PostWithProfile | null> {
    const { data, error } = await supabase
      .from("post")
      .select(
        `
        *,
        user:profiles!post_userId_fkey(*)
      `
      )
      .eq("id", postId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch post: ${error.message}`)
    }

    return data as PostWithProfile
  }

  async createPost(data: CreatePostData): Promise<Post> {
    const { data: newPost, error } = await supabase
      .from("post")
      .insert({
        title: data.title,
        content: data.content,
        userId: data.userId,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create post: ${error.message}`)
    }

    return newPost
  }

  async deletePost(postId: number, userId: string): Promise<void> {
    const { error } = await supabase.from("post").delete().eq("id", postId).eq("userId", userId)

    if (error) {
      throw new Error(`Failed to delete post: ${error.message}`)
    }
  }

  async updatePost(postId: number, data: UpdatePostData): Promise<Post> {
    const { data: updatedPost, error } = await supabase
      .from("post")
      .update(data)
      .eq("id", postId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update post: ${error.message}`)
    }

    return updatedPost
  }
}
