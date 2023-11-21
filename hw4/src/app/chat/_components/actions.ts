import { and, eq, ne, desc } from "drizzle-orm";
import { db } from "@/db";
import { usersTable, roomsTable, usersToRoomsTable, messagesTable } from "@/db/schema";

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

  const rooms = await db.query.usersToRoomsTable.findMany({
    where: eq(usersToRoomsTable.userId, userId),
    with: {
      room: {
        columns: {
          displayId: true,
        },
      },
    },
  });
  return rooms;
};

export const existedRoom = async (userId: string, otherusername: string) => {
  "use server";
  const [otheruser] = await db
    .select({
      displayId: usersTable.displayId,
    })
    .from(usersTable)
    .where(eq(usersTable.username, otherusername));
  if (!otheruser) {
    return false;
  }

  const rooms = await db.query.usersToRoomsTable.findMany({
    where: eq(usersToRoomsTable.userId, userId),
  });

  const otheruserRooms = await db.query.usersToRoomsTable.findMany({
    where: eq(usersToRoomsTable.userId, otheruser.displayId),
  });


  let existed: boolean = false;
  let roomId: string = "";
  rooms.map((room) => {
    otheruserRooms.map((otheruserRoom) => {
      if(room.roomId === otheruserRoom.roomId)
      {
        existed = true;
        roomId = room.roomId;
      }
    })
  });
  if(existed)
  {
    return roomId;
  }

  return false;

};

export const deleteRoom = async (roomId: string) => {
  "use server";
  console.log("[deleteRoom]");
  await db
    .delete(roomsTable)
    .where(eq(roomsTable.displayId, roomId));
  return;
};

export const getotheruser = async (userId: string, roomId: string) => {
  "use server";

  const otheruser = await db.query.usersToRoomsTable.findMany({
    where: and(eq(usersToRoomsTable.roomId, roomId), ne(usersToRoomsTable.userId, userId)),
    with: {
      user: {
        columns: {
          username: true,
          displayId: true,
        },
      },
    },
  });
  return otheruser;
};

export const getlatestmessage = async (roomId: string) => {
  "use server";

  const latestMessage = await db.query.messagesTable.findFirst({
    where: eq(messagesTable.roomId, roomId),
    orderBy: [desc(messagesTable.createdAt)],
  });
  return latestMessage;
};