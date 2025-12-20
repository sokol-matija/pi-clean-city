/* DIP -> dependency inversion principle -> kreiramo apstrakciju (interface) koji definira ŠTO radimo, a ne KAKO.
Dakle tu je definirano kakve metode interface ima a implementiram ih u konkretnoj klasi */

import type { Post } from "@/types/database.types"
import type { PostWithProfile } from "../hooks/usePosts"

export interface IPostRepository {
  // Dohvaca sve postove s profilima korisnika
  getAllPosts(): Promise<PostWithProfile[]>

  // Dohvaca pojedinačni post po ID-u
  getPostById(postId: number): Promise<PostWithProfile | null>

  // Kreira novi post
  createPost(data: CreatePostData): Promise<Post>

  // Briše post (samo ako je korisnik vlasnik)
  deletePost(postId: number, userId: string): Promise<void>

  // Azuirira postojeci post
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
