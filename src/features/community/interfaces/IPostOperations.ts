/* ISP -> interface segregation principle -> razdvajanje u male fokusirane interfaceove.
    Dakle za post neću imati jedan interface sa notifikacijama, crud-om, komentarima, ocjenama.
    Nego za sve imam male interface (ovdje su stavljeni u jedan file "IPOstOperations"
    Tako izbjegavam veliki master interface */

import type { Post } from "@/types/database.types"
import type { PostWithProfile } from "../hooks/usePosts"

// [ ZASEBNI INTERFACEOVI SVAKI IMA PO JEDNU KLASU ]

// Interface samo za čitanje postova
export interface IPostReader {
  getPostById(postId: number): Promise<PostWithProfile | null>
  getAllPosts(): Promise<PostWithProfile[]>
  getPostsByUser(userId: string): Promise<PostWithProfile[]>
}

// Interface samo za kreiranje postova
export interface IPostCreator {
  createPost(data: CreatePostData): Promise<Post>
}

// Interface samo za updateanje postova
export interface IPostUpdater {
  updatePost(postId: number, data: UpdatePostData): Promise<Post>
}

// Interface samo za brisanje postova
export interface IPostDeleter {
  deletePost(postId: number, userId: string): Promise<void>
}

// Interface zta komentare
export interface ICommentOperations {
  addComment(postId: number, userId: string, content: string): Promise<Comment>
  deleteComment(commentId: number, userId: string): Promise<void>
  getComments(postId: number): Promise<Comment[]>
}

// Interface za ocjenjivanje postova
export interface IRatingOperations {
  ratePost(postId: number, userId: string, rating: number): Promise<void>
  getUserRating(postId: number, userId: string): Promise<number | null>
  getAverageRating(postId: number): Promise<number>
}

// Interface za moderiranje postova
export interface IPostModeration {
  flagPost(postId: number, reason: string): Promise<void>
  approvePost(postId: number): Promise<void>
  rejectPost(postId: number, reason: string): Promise<void>
  getFlaggedPosts(): Promise<PostWithProfile[]>
}

// Interface za analitiku postova
export interface IPostAnalytics {
  getPostViews(postId: number): Promise<number>
  trackView(postId: number): Promise<void>
  getPopularPosts(limit: number): Promise<PostWithProfile[]>
  getPostsStats(): Promise<PostStats>
}

// [ TIPOVI ]

export interface CreatePostData {
  title: string
  content: string
  userId: string
}

export interface UpdatePostData {
  title?: string
  content?: string
}

export interface Comment {
  id: number
  postId: number
  userId: string
  content: string
  createdAt: string
}

export interface PostStats {
  totalPosts: number
  totalViews: number
  averageRating: number
  postsThisWeek: number
}

// [ KOMPOZICIJSKI INTERFACE - kombinirani po potrebi tipa operacije usera, operacije autora ]

// Za obicnog usera - može citati, kreirati i brisati svoje postove
export interface IUserPostOperations extends IPostReader, IPostCreator, IPostDeleter {}

// Za vlasnika - ima dodatno pravo updateanje svojih postova
export interface IAuthorPostOperations extends IUserPostOperations, IPostUpdater {}

// Za admina - koji ima pravo na sve
export interface IAdminPostOperations
  extends IAuthorPostOperations, IPostModeration, IPostAnalytics {}
