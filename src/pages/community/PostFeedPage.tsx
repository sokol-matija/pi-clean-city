import FeedForm from "@/components/ui/community/FeedForm"
import PostItem from "@/components/ui/community/PostItem"
import { useCreatePost } from "@/features/community/hooks/useCreatePost"
// OBSERVER PATTERN - hook za slušanje događaja
import { usePostEvents } from "@/features/community/hooks/usePostEvents"
// DECORATOR PATTERN: Hook koji automatski dodaje badge-ove postovima
import { useDecoratedPosts } from "@/features/community/hooks/useDecoratedPosts"

function PostFeedPage() {
  const { mutateAsync: createPost } = useCreatePost()
  // DECORATOR PATTERN: Koristimo useDecoratedPosts umjesto usePosts
  const { decoratedPosts, isLoading, error, stats } = useDecoratedPosts()

  // OBSERVER PATTERN: Slušamo kada se kreira novi post
  usePostEvents("post:created", (payload) => {
    console.log("[OBSERVER] Dovhacen dogadaj 'post:created':", payload)
    console.log("--> Naslov posta:", payload.post.title)
    console.log("--> Autor ID:", payload.authorId)
  })

  const handlePost = async ({ title, content }: { title: string; content: string }) => {
    try {
      await createPost({ title, content })
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Unexpected error"}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Create a post</h1>

      {/* DECORATOR PATTERN: Prikaz statistike badge-ova */}
      <div className="mb-4 rounded-lg bg-gray-100 p-3 text-sm text-gray-600">
        <span className="font-medium">Decorator Pattern Stats:</span>
        <span className="ml-2">Ukupno: {stats.total}</span>
        <span className="ml-2">• S badge-ovima: {stats.withBadges}</span>
        <span className="ml-2">• Hightlightani: {stats.highlighted}</span>
      </div>

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

        {!isLoading && !error && decoratedPosts.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No posts yet. Be the first to post!</p>
          </div>
        )}

        {/* DECORATOR PATTERN: Prosljeđujemo badge-ove u PostItem */}
        {decoratedPosts.map((post) => (
          <PostItem key={post.id} post={post} badges={post.badges} />
        ))}
      </div>
    </div>
  )
}

export default PostFeedPage
