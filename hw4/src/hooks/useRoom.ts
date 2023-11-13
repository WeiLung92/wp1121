import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import type { ChatRoom } from "@/lib/types/db";

export const useRoom = () => {
  const { roomId: roomId } = useParams();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!roomId) return;
    const fetchDocument = async () => {
      const res = await fetch(`/api/rooms/${roomId}`);
      if (!res.ok) {
        setRoom(null);
        router.push("/chat");
        return;
      }
      const data = await res.json();
      setRoom(data);
    };
    fetchDocument();
  }, [roomId, router]);

  return {
    roomId,
    room,
  };
};