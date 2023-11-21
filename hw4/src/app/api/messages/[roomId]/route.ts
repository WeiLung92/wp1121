import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import type { Message } from "@/lib/types/db";
import { messagesTable } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

import Pusher from "pusher";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";


const postMessageSchema = z.object({
  senderId: z.string(),
  content: z.string().min(1).max(500),
});

const deleteMessageSchema = z.object({
  messageId: z.string(),
  deleteSelfOrNot: z.boolean(),
});
type PostMessageRequest = z.infer<typeof postMessageSchema>;
type DeleteMessageRequest = z.infer<typeof deleteMessageSchema>;

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
    try{
      const messages = await db.query.messagesTable.findMany({
        where: eq(messagesTable.roomId, params.roomId),
        orderBy: [asc(messagesTable.createdAt)],
      });
      return NextResponse.json(
        {
          messages: messages,
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

export async function POST(
    req: NextRequest,
    {
      params,
    }: {
      params: {
        roomId: string;
      };
    },
) {
  const data = await req.json();
  try {
    postMessageSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { senderId, content } = data as PostMessageRequest;
  const createdAt = new Date();
  const roomId = params.roomId;
  const deleteSelf = true;
  const newm = await db.insert(messagesTable).values({
    senderId: senderId,
    content: content,
    roomId: roomId,
    createdAt: createdAt,
  }).returning();

  const displayId = newm[0].displayId;
  const newMessage: Message = {
    displayId,
    senderId,
    content,
    roomId,
    createdAt,
    deleteSelf,
  };
  // Trigger pusher event
  const pusher = new Pusher({
    appId: privateEnv.PUSHER_ID,
    key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
    secret: privateEnv.PUSHER_SECRET,
    cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true,
  });

  await pusher.trigger(`${roomId}`, "message:create", {senderId: senderId, newmessage: newm });

  return NextResponse.json(
    {
      message: newMessage,
    },
    { status: 200 },
  );
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      roomId: string;
    };
  },
) {
  const data = await req.json();
  try {
    deleteMessageSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { messageId, deleteSelfOrNot } = data as DeleteMessageRequest;

  const pusher = new Pusher({
    appId: privateEnv.PUSHER_ID,
    key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
    secret: privateEnv.PUSHER_SECRET,
    cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true,
  });

  if(deleteSelfOrNot)
  {
    const deletem = await db
    .update(messagesTable)
    .set({deleteSelf: true})
    .where(eq(messagesTable.displayId, messageId))
    .returning();
  
    await pusher.trigger(`${params.roomId}`, "message:delete", {senderId: deletem[0].senderId, deleteId: deletem[0].displayId});
    return NextResponse.json({ senderId: deletem[0].senderId, deleteId: deletem[0].displayId });

  }else{
    const deletem = await db
    .delete(messagesTable)
    .where(eq(messagesTable.displayId, messageId))
    .returning();
    await pusher.trigger(`${params.roomId}`, "message:delete", {senderId: deletem[0].senderId, deleteId: deletem[0].displayId});
    return NextResponse.json({ senderId: deletem[0].senderId, deleteId: deletem[0].displayId });
  }

}