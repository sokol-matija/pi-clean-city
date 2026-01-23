import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import defaultAvatar from "@/assets/default_avatar.jpg"
import type { PostCommentWithProfile } from "@/features/community/interfaces/ICommentRepository"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useDeleteComment } from "@/features/community/hooks/useDeleteComment"

interface CommentItemProps {
  comment: PostCommentWithProfile
  postId: number
}

function CommentItem({ comment, postId }: Readonly<CommentItemProps>) {
  const { user } = useAuth()
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment()

  const username = comment.user?.username || "Anonymous"
  const avatarUrl = comment.user?.avatar_url || defaultAvatar

  const handleDelete = () => {
    if (globalThis.confirm("Are you sure you want to delete this comment?")) {
      deleteComment(
        { commentId: comment.id, postId },
        {
          onError: (error: Error) => {
            alert(`Error deleting comment: ${error.message}`)
          },
        }
      )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const canDelete = user?.id === comment.user_id

  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{username}</span>
          <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
        </div>
        <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
      </div>
      {canDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-6 px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
        >
          {isDeleting ? "..." : "Delete"}
        </Button>
      )}
    </div>
  )
}

export default CommentItem
