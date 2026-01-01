import type { Post } from "@/types/database.types"
import type { PostWithProfile } from "../hooks/usePosts"

export interface IPostRepository {
  getAllPosts(): Promise<PostWithProfile[]>
  getPostById(postId: number): Promise<PostWithProfile | null>
  createPost(data: CreatePostData): Promise<Post>
  deletePost(postId: number, userId: string): Promise<void>
  updatePost(postId: number, data: UpdatePostData): Promise<Post>
}

export interface CreatePostData {
  title: string
  content: string
  userId: string
}

export interface UpdatePostData {
  title?: string
  content?: string
}
