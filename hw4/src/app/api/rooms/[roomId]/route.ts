import { NextResponse, type NextRequest } from "next/server";

import { and, eq, ne, desc } from "drizzle-orm";

import { db } from "@/db";
import { roomsTable, usersToRoomsTable } from "@/db/schema";
import { auth } from "@/lib/auth";


// GET /api/documents/:documentId
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      roomId: string;
    };
  },
) {
  try {
    // Get user from session
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // Get the document
    const dbRoom = await db.query.usersToRoomsTable.findFirst({
      where: and(
        eq(usersToRoomsTable.userId, userId),
        eq(usersToRoomsTable.roomId, params.roomId),
      ),
      with: {
        room: {
          columns: {
            displayId: true,
          },
        },
      },
    });
    if (!dbRoom?.room) {
      return NextResponse.json({ error: "Doc Not Found" }, { status: 404 });
    }

    const annouceRoom = await db.query.roomsTable.findFirst({
      where: eq(roomsTable.displayId, params.roomId)
    });

    const otheruser = await db.query.usersToRoomsTable.findMany({
      where: and(eq(usersToRoomsTable.roomId, params.roomId), ne(usersToRoomsTable.userId, userId)),
      with: {
        user: {
          columns: {
            username: true,
            displayId: true,
          },
        },
      },
    });

    const room = dbRoom.room;
    return NextResponse.json(
      {
        id: room.displayId,
        userId: userId,
        otheruser: otheruser[0].user.username,
        announcement: annouceRoom?.announcement,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      roomId: string;
    };
  },
) {
  try{
    const reqBody = await req.json();
    if(reqBody['announcement'] == "") return;
    const [update] = await db.update(roomsTable)
    .set({ announcement: reqBody['announcement'] })
    .where(eq(roomsTable.displayId, params.roomId))
    .returning();

    return NextResponse.json(
      {
        announcement: update.announcement,
      },
      { status: 200 },
  );
  } catch(error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }

}