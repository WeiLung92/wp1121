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
  authorName,
  content,
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
