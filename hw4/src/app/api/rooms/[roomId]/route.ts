import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { usersToRoomsTable } from "@/db/schema";
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

    const room = dbRoom.room;
    return NextResponse.json(
      {
        id: room.displayId,
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
