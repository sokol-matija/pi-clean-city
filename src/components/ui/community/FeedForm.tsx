import { useState } from "react"
import defaultAvatar from "@/assets/default_avatar.jpg"
import { Input } from "../input"
import { Textarea } from "../textarea"
import { Button } from "../button"

// SINGLETON PATTERN: Koristimo glavnu instancu za validaciju
import { postServiceManager } from "@/features/community/patterns/Singleton/PostServiceManager"

type FeedFormProps = {
  onPost?: (payload: { title: string; content: string }) => Promise<void> | void
}

const FeedForm: React.FC<FeedFormProps> = ({ onPost }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  // SINGLETON PATTERN: Dohvacamo konfiguraciju iz jedine instance
  const config = postServiceManager.getConfig()

  // SINGLETON PATTERN: Koristimo metode iz Singletona za validaciju
  const isTitleValid = postServiceManager.isTitleValid(title)
  const isContentValid = postServiceManager.isPostContentValid(content)
  const canPost = isTitleValid && isContentValid

  const handlePost = async () => {
    if (!canPost) {
      alert(
        `Title mora imati min ${config.minTitleLength} znaka, content mora imati 1-${config.maxPostLength} znakova`
      )
      return
    }

    await onPost?.({ title, content })

    // reset form after post
    setTitle("")
    setContent("")
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full flex-row gap-6 border-b py-4">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div style={{ width: 64, height: 64 }} className="relative">
              <img
                src={defaultAvatar}
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = "none"
                }}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-200 font-medium text-slate-700"
                style={{ display: "none" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className="w-full">
            {/* SINGLETON PATTERN: Prikaz validacije u realtimeu */}
            <div className="mb-2 text-xs text-gray-500">
              <span className={isTitleValid ? "text-green-600" : "text-red-500"}>
                Naslov: {title.length}/{config.minTitleLength}+ znakova {isTitleValid ? "✓" : "✗"}
              </span>
              <span className="mx-2">|</span>
              <span className={isContentValid ? "text-green-600" : "text-red-500"}>
                Sadrzaj: {content.length}/{config.maxPostLength} {isContentValid ? "✓" : "✗"}
              </span>
            </div>

            <Input
              type="text"
              id="postTitle"
              placeholder="Feed title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mb-2 ${!isTitleValid && title.length > 0 ? "border-red-300" : ""}`}
            />

            <Textarea
              id="postContent"
              placeholder="Type your message here."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`mb-2 ${!isContentValid && content.length > 0 ? "border-red-300" : ""}`}
            />

            <div className="mt-4 flex justify-end">
              <Button
                onClick={handlePost}
                disabled={!canPost}
                className={`mr-2 ${!canPost ? "opacity-50" : ""}`}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedForm
