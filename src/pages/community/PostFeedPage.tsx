import FeedForm from "@/components/ui/community/FeedForm"
import PostItem from "@/components/ui/community/PostItem"
import { useCreatePost } from "@/features/community/hooks/useCreatePost"

function PostFeedPage() {
  const { mutate: createPost } = useCreatePost()

  const handlePost = ({ title, content }: { title: string; content: string }) => {
    createPost(
      { title, content },
      {
        onError: (error: Any) => {
          alert(`Greška: ${error.message || "Neočekivana greška"}`)
        },
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Create a post</h1>

      <FeedForm onPost={handlePost} />

      {/* TODO - Implementirati listu postova iz baze */}
      <br></br>
      <PostItem />
    </div>
  )
}

export default PostFeedPage
