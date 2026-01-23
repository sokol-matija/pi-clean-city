import type { Profile, PostComment } from "@/types/database.types"

export interface PostCommentWithProfile extends PostComment {
  user: Profile | null
}

export interface ICommentRepository {
  getCommentsByPostId(postId: number): Promise<PostCommentWithProfile[]>
  createComment(data: CreateCommentData): Promise<PostComment>
  deleteComment(commentId: string, userId: string): Promise<void>
  updateComment(commentId: string, content: string, userId: string): Promise<PostComment>
}

export interface CreateCommentData {
  post_id: number
  user_id: string
  content: string
}
