import { useState } from 'react';
import defaultAvatar from '@/assets/default_avatar.jpg';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Button } from '../button';

type FeedFormProps = {
  onPost?: (payload: { title: string; content: string }) => Promise<void> | void;
};

const FeedForm: React.FC<FeedFormProps> = ({ onPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");



  const handlePost = async () => {
    await onPost?.({ title, content });
    // reset form after post
    setTitle("");
    setContent("");
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-row w-full border-b gap-6 py-4">
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* Avatar: image or fallback initials */}
            <div style={{ width: 64, height: 64 }} className="relative">
              {/* Replace the src with your avatar URL */}
              <img
                src={defaultAvatar}
                onError={(e) => {
                  // hide broken image to show fallback
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
                className="w-16 h-16 rounded-full object-cover"
              />
              {/* If image fails, show fallback (initials) */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-full bg-gray-200 flex items-center justify-center text-slate-700 font-medium"
                style={{ display: "none" }}
              >
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="w-full">
            <Input 
              type="text" 
              id="postTitle" 
              placeholder="Feed title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)} 
              className="mb-2" 
            />

            <Textarea 
              id="postContent" 
              placeholder="Type your message here." 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              className="mb-2" 
            />

            <div className="flex justify-end mt-4">
              <Button onClick={handlePost} className="mr-2">Post</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedForm