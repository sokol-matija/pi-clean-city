import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import defaultAvatar from "@/assets/default_avatar.jpg"

function PostItem() {
  /*const [averageRating] = useState(3.2);
  const [comment] = useState("");
  const [comments] = useState([]);*/

  return (
    <Card className="mb-6 w-full border border-gray-50 shadow-lg">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start gap-4">
          <div className="relative mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={defaultAvatar} />
              <AvatarFallback>Ime Prezime</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 right-0 h-5 w-5 rounded-full border-2 border-white bg-green-300" />
          </div>

          <div className="flex flex-col items-start gap-0 text-black">
            <p className="font-bold">Ime Prezime</p>
            <p className="-mt-1 text-sm text-gray-500">Posted just now</p>
          </div>
        </div>

        <h3 className="mb-1 text-lg font-semibold text-black">Greska u post titleu</h3>

        <p className="mb-2 text-sm text-gray-600">
          Average Rating: {/*averageRating?.toFixed(1)*/}3.2 / 5
        </p>

        <p className="text-md mb-4 text-gray-700">Greska u post contentu</p>

        <div className="mb-4">
          <p className="mb-2 font-medium text-black">Your Rating:</p>
          <div className="flex gap-1">rating ovdje</div>
        </div>

        <div className="mt-4">
          <p className="mb-2 font-medium text-black">Comments:</p>
          <div className="mb-2 flex w-full flex-col items-start gap-3"></div>
          <Textarea
            /*value={comment}
        onChange={(e) => setComment(e.target.value)}*/
            placeholder="Write a comment..."
            className="mb-2"
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              /*onClick={handleDeletePost}*/
              className="bg-gradient-to-r from-[#2f3144] to-[#555879] text-white hover:opacity-90"
            >
              Delete post
            </Button>
            <Button
              size="sm"
              /*onClick={}*/
              className="bg-gradient-to-r from-[#e1700e] to-[#c30e60] text-white hover:opacity-90"
            >
              Add Comment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostItem
