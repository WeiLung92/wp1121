"use client";

import { useRoom } from "@/hooks/useRoom";

function RoomPage() {
  const { roomId, room } = useRoom();
  return (
    <div>
      <h1>Doc ID: {roomId}</h1>
      <p>{JSON.stringify(room, null, 2)}</p>
    </div>
  );
}

export default RoomPage;
