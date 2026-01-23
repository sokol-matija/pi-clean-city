import { supabase } from "@/lib/supabase"
import type { PostComment } from "@/types/database.types"
import type {
  ICommentRepository,
  PostCommentWithProfile,
  CreateCommentData,
} from "../interfaces/ICommentRepository"

export class SupabaseCommentRepository implements ICommentRepository {
  async getCommentsByPostId(postId: number): Promise<PostCommentWithProfile[]> {
    const { data, error } = await supabase
      .from("post_comment")
      .select(
        `
        *,
        user:profiles!post_comment_user_id_fkey(*)
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`)
    }

    return data as PostCommentWithProfile[]
  }

  async createComment(data: CreateCommentData): Promise<PostComment> {
    const { data: newComment, error } = await supabase
      .from("post_comment")
      .insert({
        post_id: data.post_id,
        user_id: data.user_id,
        content: data.content,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create comment: ${error.message}`)
    }

    return newComment
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("post_comment")
      .delete()
      .eq("id", commentId)
      .eq("user_id", userId)

    if (error) {
      throw new Error(`Failed to delete comment: ${error.message}`)
    }
  }

  async updateComment(commentId: string, content: string, userId: string): Promise<PostComment> {
    const { data: updatedComment, error } = await supabase
      .from("post_comment")
      .update({ content })
      .eq("id", commentId)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update comment: ${error.message}`)
    }

    return updatedComment
  }
}
