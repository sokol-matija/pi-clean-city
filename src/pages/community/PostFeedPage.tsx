import FeedForm from "@/components/ui/community/FeedForm"
import PostItem from "@/components/ui/community/PostItem"
import { useCreatePost } from "@/features/community/hooks/useCreatePost"
import { usePosts } from "@/features/community/hooks/usePosts"

function PostFeedPage() {
  const { mutate: createPost } = useCreatePost()
  const { data: posts, isLoading, error } = usePosts()

  const handlePost = ({ title, content }: { title: string; content: string }) => {
    createPost(
      { title, content },
      {
        onError: (error: Error) => {
          alert(`Error: ${error.message || "Unexpected error"}`)
        },
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Create a post</h1>

      <FeedForm onPost={handlePost} />

      <br />

      <div className="space-y-6">
        {isLoading && (
          <div className="py-8 text-center">
            <p className="text-gray-500">Loading posts...</p>
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-red-600">
            <p>Error loading posts: {error.message}</p>
          </div>
        )}

        {!isLoading && !error && posts?.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No posts yet. Be the first to post!</p>
          </div>
        )}

        {posts?.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default PostFeedPage
