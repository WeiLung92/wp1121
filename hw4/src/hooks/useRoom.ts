import { useEffect, useState} from "react";

import { useParams, useRouter } from "next/navigation";
import type { ChatRoom } from "@/lib/types/db";

export const useRoom = () => {
  const { roomId } = useParams();
  const rId = Array.isArray(roomId) ? roomId[0] : roomId;
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [userId, setUserId] = useState("");
  const [otheruser, setOtheruser] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const router = useRouter();

  const updateAnnouncement = async (received_annoucement: string) => {
    try {
      const res = await fetch(`/api/rooms/${rId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          announcement: received_annoucement,
        }),
      });
      if(!res.ok)
      {
        return;
      }
      const data = await res.json();
      setAnnouncement(data['announcement']);
      router.refresh();
    } catch (error) {
      (error);
    }
  };

  useEffect(() =>{
    const fetchRoom = async () => {
      const res = await fetch(`/api/rooms/${rId}`);
      const data = await res.json();
      setAnnouncement(data['announcement']);
      router.refresh();
    };
    fetchRoom();
    router.refresh();
  } );

  useEffect(() => {
    if (!rId) return;
    const fetchRoom = async () => {
      const res = await fetch(`/api/rooms/${rId}`);
      if (!res.ok) {
        setRoom(null);
        router.push("/chat");
        return;
      }
      const data = await res.json();
      const r = {id: data['id']};
      const rstring = JSON.stringify(r);
      setRoom(JSON.parse(rstring));
      setOtheruser(data['otheruser']);
      setUserId(data['userId']);
      // console.log(data['announcement']);
      // setDbAnnouncement(data['announcement']);
    };
    fetchRoom();
  }, [rId, router]);


  return {
    rId,
    room,
    otheruser,
    userId,
    announcement,
    updateAnnouncement
  };
};