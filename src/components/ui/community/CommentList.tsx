import { useComments } from "@/features/community/hooks/useComments"
import CommentItem from "./CommentItem"

interface CommentListProps {
  postId: number
}

function CommentList({ postId }: Readonly<CommentListProps>) {
  const { data: comments, isLoading, error } = useComments(postId)

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading comments...</p>
  }

  if (error) {
    return <p className="text-sm text-red-500">Error loading comments</p>
  }

  if (!comments || comments.length === 0) {
    return <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  )
}

export default CommentList
