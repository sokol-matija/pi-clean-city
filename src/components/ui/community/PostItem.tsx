import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import defaultAvatar from '@/assets/default_avatar.jpg';

function PostItem() {
  /*const [averageRating] = useState(3.2);
  const [comment] = useState("");
  const [comments] = useState([]);*/


  return (
    <Card className="w-full mb-6 shadow-lg border border-gray-50">
  <CardContent className="p-6">
    <div className="flex items-start mb-4 gap-4">
      <div className="relative mb-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={defaultAvatar} />
          <AvatarFallback>Ime Prezime</AvatarFallback>
        </Avatar>
        <span className="absolute w-5 h-5 bg-green-300 border-2 border-white rounded-full -bottom-1 right-0" />
      </div>

      <div className="flex flex-col gap-0 items-start text-black">
        <p className="font-bold">
          Ime Prezime
        </p>
        <p className="text-sm text-gray-500 -mt-1">
          Posted just now
        </p>
      </div>
    </div>

    <h3 className="text-lg font-semibold mb-1 text-black">
     Greska u post titleu
    </h3>

    <p className="text-sm text-gray-600 mb-2">
      Average Rating: {/*averageRating?.toFixed(1)*/}3.2 / 5
    </p>

    <p className="text-md text-gray-700 mb-4">
      Greska u post contentu
    </p>

    <div className="mb-4">
      <p className="font-medium mb-2 text-black">
        Your Rating:
      </p>
      <div className="flex gap-1">
        rating ovdje
        </div>
    </div>

    <div className="mt-4">
      <p className="font-medium mb-2 text-black">
        Comments:
      </p>
      <div className="flex flex-col gap-3 items-start mb-2 w-full">
      </div>
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