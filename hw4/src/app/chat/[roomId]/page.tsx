"use client";

import { useRoom } from "@/hooks/useRoom";
import { useMessage } from "@/hooks/useMessages";
import Avatar from "../_components/Avatar"
import ChatRoomInput from "@/components/ChatRoomInput";
import ChatRoomMessages from "@/components/ChatRoomMessages";
import { GrAnnounce } from "react-icons/gr";
import { useEffect, useState } from "react";

function RoomPage() {
  const { otheruser, userId, announcement } = useRoom();
  return (
    <div className="w-full h-full overflow-hidden flex flex-col shadow-lg">
    <nav className="flex w-full shadow-md p-3 text-md font-semibold">
      <Avatar 
        username={otheruser}
        classname="bg-black text-white w-12 h-12 my-3"
      />
      <div className="flex-col ml-5 mt-5">
        <div className="text-xl font-bold text-black">
          {otheruser}
        </div>
      </div>
      <div className="m-5">
        {announcement == null ? <></> : <div> <GrAnnounce/> {announcement} </div>}
      </div>
    </nav>
    <div className="overflow-y-scroll grow">
      <ChatRoomMessages />
    </div>
    <div className="p-2">
      <ChatRoomInput senderId={userId}/>
    </div>
  </div>
  );
}

export default RoomPage;
