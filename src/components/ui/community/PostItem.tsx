// PostItem -> LSP (IPostFormatter), DIP (IPostFormatter interface)
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import defaultAvatar from "@/assets/default_avatar.jpg"
import type { PostWithProfile } from "@/features/community/hooks/usePosts"
import { useDeletePost } from "@/features/community/hooks/useDeletePost"
import { useCreateComment } from "@/features/community/hooks/useCreateComment"
import { useAuth } from "@/features/auth/hooks/useAuth"

// LSP: Importamo formatter - možemo koristiti bilo koji koji implementira IPostFormatter
import { createFormatter, type IPostFormatter } from "@/features/community/services/PostFormatter"

// DECORATOR PATTERN: Import za badge-ove
import type { PostBadge } from "@/features/community/patterns/Decorator/PostDecorator"

import CommentList from "./CommentList"
import MentionInput from "./MentionInput"

interface PostItemProps {
  post: PostWithProfile
  formatter?: IPostFormatter
  // DECORATOR PATTERN: Opcionalni badge-ovi koje dekorator dodaje
  badges?: PostBadge[]
}

const defaultFormatter = createFormatter("relative")

function PostItem({ post, formatter = defaultFormatter, badges = [] }: Readonly<PostItemProps>) {
  const [comment, setComment] = useState("")
  const formattedPost = formatter.formatPost(post)
  const username = formattedPost.authorName
  const avatarUrl = post.user?.avatar_url || defaultAvatar
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()
  const { mutate: createComment, isPending: isAddingComment } = useCreateComment()
  const { user } = useAuth()

  const handleDeletePost = () => {
    if (globalThis.confirm("Are you sure you want to delete this post?")) {
      deletePost(post.id, {
        onError: (error: Error) => {
          alert(`Error deleting post: ${error.message}`)
        },
      })
    }
  }

  const handleAddComment = () => {
    if (!comment.trim()) {
      alert("Please enter a comment")
      return
    }

    createComment(
      { postId: post.id, content: comment.trim() },
      {
        onSuccess: () => {
          setComment("")
        },
        onError: (error: Error) => {
          alert(`Error adding comment: ${error.message}`)
        },
      }
    )
  }

  // ako je vlasnik pokazi delete btn
  const canDelete = user?.id === post.userId

  return (
    <Card className="mb-6 w-full border border-gray-50 shadow-lg">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start gap-4">
          <div className="relative mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 right-0 h-5 w-5 rounded-full border-2 border-white bg-green-300" />
          </div>

          <div className="flex flex-col items-start gap-0 text-black">
            <p className="font-bold">{username}</p>
            {/* LSP: Koristimo formatirani datum iz formattera */}
            <p className="-mt-1 text-sm text-gray-500">{formattedPost.formattedDate}</p>
          </div>
        </div>

        <div className="mb-1 flex items-center gap-2">
          <h3 className="text-lg font-semibold text-black">{formattedPost.title}</h3>
          {/* DECORATOR PATTERN: Prikaz badge-ova */}
          {badges.length > 0 && (
            <div className="flex gap-1">
              {badges.map((badge, index) => (
                <span
                  key={`${badge.type}-${index}`}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white ${badge.color}`}
                >
                  {badge.icon && <span>{badge.icon}</span>}
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {post.averageRating !== null && (
          <p className="mb-2 text-sm text-gray-600">
            Average Rating: {post.averageRating.toFixed(1)} / 5
          </p>
        )}

        <p className="text-md mb-4 text-gray-700">{formattedPost.content}</p>

        <div className="mb-4">
          <p className="mb-2 font-medium text-black">Your Rating:</p>
          <div className="flex gap-1">rating ovdje</div>
        </div>

        <div className="mt-4">
          <p className="mb-2 font-medium text-black">Comments:</p>
          <div className="mb-3">
            <CommentList postId={post.id} />
          </div>
          <MentionInput
            value={comment}
            onChange={setComment}
            placeholder="Write a comment..."
            className="mb-2"
          />
          <div className="flex justify-end gap-2">
            {canDelete && (
              <Button
                size="sm"
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="bg-gradient-to-r from-[#2f3144] to-[#555879] text-white hover:opacity-90 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete post"}
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={isAddingComment || !comment.trim()}
              className="bg-gradient-to-r from-[#e1700e] to-[#c30e60] text-white hover:opacity-90 disabled:opacity-50"
            >
              {isAddingComment ? "Adding..." : "Add Comment"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostItem
