import { PiChatsLight } from "react-icons/pi";
import { BiLogOut } from "react-icons/bi";
import Link from "next/link";
import { RxAvatar } from "react-icons/rx";

import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

async function Navbar() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  return (
    // <nav className="flex w-full flex-col overflow-y-scroll bg-slate-100 pb-10">
    //   <nav className="relative sticky top-0 flex flex-col justify-between border-b bg-slate-100 pb-2">
    //     <div className="flex w-full items-center justify-between px-3 py-1">
    //       <div className="flex items-center gap-2">
    //         <RxAvatar />
    //         <h1 className="text-sm font-semibold">
    //           {session?.user?.username ?? "User"}
    //         </h1>
    //       </div>
    //     </div>

    //     <form className="w-full hover:bg-slate-200">
    //       <button
    //         type="submit"
    //         className="flex w-full items-center gap-2 px-3 py-1 text-left text-sm text-slate-500"
    //       >
    //         <AiFillFileAdd size={16} />
    //         <p>Create Document</p>
    //       </button>
    //     </form>
    //   </nav>
    // </nav>
    <>
      <div className="relative flex-col">
        <Button className="" variant={"ghost"}>
          <Image src="/messenger.png" alt="messenger icon" width={100} height={100} />
        </Button>  
        
        <Button
          className="absolute top-28 flex"
          variant={"ghost"}
        >
          {/* Remember to copy "github.png" to ./public folder */}
          
          <PiChatsLight className="text-blue-500" size={40}/>
          <span className="grow text-3xl text-blue-500">Chat</span>
        </Button>


        <Link href={`/auth/signout`}>
          <Button
            className="absolute bottom-0 flex"
            variant={"ghost"}
          >
            {/* Remember to copy "github.png" to ./public folder */}
            
            <BiLogOut size={30}/>
            <span className="grow text-2xl">Logout</span>
          </Button>
        </Link>
      </div>
    </>
  );
}

export default Navbar;

  