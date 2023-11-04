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
  startAt: string | null;
  endAt: string | null;
  liked?: boolean;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Reply({
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
        <div className="flex gap-4">
            <div className="relative border-solid border-2 rounded-md w-full h-20 flex">
                <div className="absolute left-3 bottom-5 font-sans text-2xl ">{authorName?.toString() + ":" + content.toString()}</div>
            </div>  
        </div>
    </>
  );
}
