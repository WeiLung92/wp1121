import Link from "next/link";

import { MessageCircle, Repeat2, Share } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import LikeButton from "./LikeButton";
import TimeText from "./TimeText";
import CheckIcon from '@mui/icons-material/Check';
import { green } from '@mui/material/colors';

type TweetProps = {
  username?: string;
  handle?: string;
  id: number;
  authorName: string;
  authorHandle: string;
  content: string;
  likes: number;
  createdAt: Date;
  startAt: string;
  endAt: string;
  liked?: boolean;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Activity({
  username,
  handle,
  id,
  authorName,
  authorHandle,
  content,
  likes,
  createdAt,
  startAt,
  endAt,
  liked,
}: TweetProps) {
  return (
    <>
      <Link
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/tweet/${id}`,
          query: {
            username,
            handle,
          },
        }}
      >
        <div className="flex gap-4">
            <div className="relative border-solid border-2 rounded-md w-full h-20 flex">
                <div className="absolute left-3 bottom-5 font-sans text-2xl ">{content}</div>
                <div className="absolute right-3 bottom-5 font-sans text-2xl ">{liked && <CheckIcon fontSize="large" sx={{ color: green[500] }}/>}    {likes??0}人參加</div>
            </div>  
        </div>
      </Link>
      
    </>
  );
}
