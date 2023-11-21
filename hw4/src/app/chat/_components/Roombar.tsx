import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";
import { Input } from "@/components/ui/input";
import { CgAddR } from "react-icons/cg"
import { FiSearch } from "react-icons/fi";
import { createRoom, getRooms, existedRoom, deleteRoom, getotheruser, getlatestmessage } from "./actions";
import { revalidatePath } from "next/cache";
import Avatar from "./Avatar"
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
    const myname = session.user.username;
    const rooms = await getRooms(userId);
    const otherusers = await Promise.all(rooms.map(async (i) => {
      const otheruser = await getotheruser(userId, i.roomId);
      return otheruser;
     }));

    const latestMessages = await Promise.all(rooms.map(async (i) => {
      const latestMessage = await getlatestmessage(i.roomId);
      return latestMessage;
     }));
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
                      const existedOrNot = await existedRoom(userId, username);
                      if(username === myname)
                      {
                        redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/not_exist`);
                      }
                      else if(existedOrNot)
                      {
                        redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/exist`);
                      }
                      else
                      {
                        const result = await createRoom(userId, username);
                        if (!result) {
                          redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/not_exist`);
                        }
                        redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/${result}`);
                      }
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
              <form
                action={async (e) => {
                  "use server";
                  const search = e.get("search");
                  if (!search) return;
                  if (typeof search !== "string") return;
                  const existedOrNot = await existedRoom(userId, search);
                  if(search === myname)
                  {
                    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/not_exist`);
                  }
                  else if(existedOrNot)
                  {
                    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/${existedOrNot}`);
                  }
                  else
                  {
                    revalidatePath(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/createOrNot/${search}`);
                    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/createOrNot/${search}`);
                  }
                  // const result = await createRoom(userId, username);
                  // if (!result) {
                  //   redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/not_exist`);
                  // }
                  // redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/${result}`);
                }}
              >
                <div className="flex flex-row gap-4 py-4">
                  <div className="flex-1 items-center">
                    <Input
                      id="search"
                      placeholder="Search user..."
                      name="search"
                      className="col-span-3"
                    />
                  </div>
                  <div>
                    <Button type="submit"><FiSearch size={20} /></Button>
                  </div>
                </div>
              </form>
            </div>

            <section className="flex w-full flex-col pt-3 items-center justify-between">
        {rooms.map((room, i) => {
          return (
            <div
              key={i}
              className="group flex w-4/5 h-20 cursor-pointer items-center justify-between gap-2 text-slate-400 hover:bg-blue-400 rounded-full"
            >
              <Link
                className="grow px-3 py-1"
                href={`/chat/${room.room.displayId}`}
              >
                <div className="flex gap-2">
                  <Avatar 
                    username={otherusers[i][0].user.username}
                    classname="bg-black text-white w-12 h-12 my-6"
                  />
                  <div className="flex-col ml-3 mt-6">
                    <div className="text-xl font-bold text-black">
                      {otherusers[i][0].user.username}
                    </div>
                    <div>
                      {latestMessages[i]? latestMessages[i]?.content : "Say hello to your new friend"}
                    </div>
                  </div>
                </div>
              </Link>
              <form
                className="hidden px-2 text-slate-400 hover:text-red-400 group-hover:flex"
                action={async () => {
                  "use server";
                  const roomId = room.room.displayId;
                  await deleteRoom(roomId);
                  revalidatePath("/chat");
                  redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat`);
                }}
              >
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