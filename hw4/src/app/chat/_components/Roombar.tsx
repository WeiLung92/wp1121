import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { Input } from "@/components/ui/input";
import { CgAddR } from "react-icons/cg"
import { createRoom, getRooms } from "./actions";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { AiFillDelete } from "react-icons/ai";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

async function Roombar() {
    const session = await auth();
    if (!session || !session?.user?.id) {
      redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
    }
    const userId = session.user.id;
    const rooms = await getRooms(userId);
    return (
      <div className="flex-col h-[90vh] w-full">
        <div className="flex flex-col ">
          <div className="relative w-full m-8">
            <span className="text-3xl">Chat</span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="absolute right-20" variant={"ghost"}>
                    <CgAddR size={30}/>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add ChatRoom</DialogTitle>
                    <DialogDescription>
                      Input the username you want to add a chatroom with
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    action={async (e) => {
                      "use server";
                      const username = e.get("username");
                      if (!username) return;
                      if (typeof username !== "string") return;
                      const result = await createRoom(userId, username);
                      if (!result) {
                        redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/not_exist`);
                      }
                      redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/${result}`);
                    }}
                  >
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Username 
                        </Label>
                        <Input
                          id="username"
                          placeholder="username"
                          name="username"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mx-8">
              <Input placeholder="Search user..."></Input>
            </div>

            <section className="flex w-full flex-col pt-3">
        {rooms.map((room, i) => {
          return (
            <div
              key={i}
              className="group flex w-full cursor-pointer items-center justify-between gap-2 text-slate-400 hover:bg-slate-200 "
            >
              <Link
                className="grow px-3 py-1"
                href={`/chat/${room.room.displayId}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-light ">
                    {room.room.displayId}
                  </span>
                </div>
              </Link>
              <form className="hidden px-2 text-slate-400 hover:text-red-400 group-hover:flex">
                <button type={"submit"}>
                  <AiFillDelete size={16} />
                </button>
              </form>
            </div>
          );
        })}
      </section>
        </div>
      </div>
    );
  }
  
  export default Roombar;