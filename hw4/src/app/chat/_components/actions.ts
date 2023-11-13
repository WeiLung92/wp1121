import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersTable, roomsTable, usersToRoomsTable } from "@/db/schema";

export const createRoom = async (userId: string, otherusername: string) => {
  "use server";
  console.log("[createRoom]");

  const [otheruser] = await db
    .select({
      displayId: usersTable.displayId,
    })
    .from(usersTable)
    .where(eq(usersTable.username, otherusername));
  if (!otheruser) {
    return false;
  }

  const newRoomId = await db.transaction(async (tx) => {
    const [newRoom] = await tx
      .insert(roomsTable)
      .values({
      })
      .returning();
    await tx.insert(usersToRoomsTable).values({
      userId: userId,
      roomId: newRoom.displayId,
    });
    await tx.insert(usersToRoomsTable).values({
      userId: otheruser.displayId,
      roomId: newRoom.displayId,
    });
    return newRoom.displayId;
  });
  return newRoomId;
};

export const getRooms = async (userId: string) => {
  "use server";

  const documents = await db.query.usersToRoomsTable.findMany({
    where: eq(usersToRoomsTable.userId, userId),
    with: {
      room: {
        columns: {
          displayId: true,
        },
      },
    },
  });
  return documents;
};