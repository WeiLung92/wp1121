import { BiError } from "react-icons/bi";
import { getRooms } from "./_components/actions"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";

async function DocsPage() {
  const session = await auth();
    if (!session || !session?.user?.id) {
      redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
    }
    const userId = session.user.id;
    const rooms = await getRooms(userId);
    if(rooms[0])
    {
      redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/${rooms[0].roomId}`)
    }
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <BiError className="text-yellow-500" size={80} />
        <p className="text-sm font-semibold text-slate-700">
          Please create a room
        </p>
      </div>
    </div>
  );
}
export default DocsPage;