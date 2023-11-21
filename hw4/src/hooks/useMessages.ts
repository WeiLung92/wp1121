import { useEffect, useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

import type { Message, User } from "@/lib/types/db";
import { pusherClient } from "@/lib/pusher/client";
import { useSession } from "next-auth/react";

type PusherPayload = {
  senderId: string;
  newmessage: Message;
};

type DeletePusherPayload = {
  senderId: string;
  deleteId: string;
};

export const useMessage = () => {
  const { roomId } = useParams();
  const rId = Array.isArray(roomId) ? roomId[0] : roomId;
  const [messages, setMessages] = useState<Message[]>([]);

  
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

  const sendMessage = async (message: Omit<Message, "displayId" | "createdAt" | "roomId" | "deleteSelf">) => {
    try {
      const res = await fetch(`/api/messages/${roomId}`, {
        method: "POST",
        body: JSON.stringify(message),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // console.log("data?.message");
      // console.log(data?.message)
      if(data?.message)
      {
        setMessages((messages) => [...messages, data["messages"]]);
      }
      router.refresh();
    } catch (error) {
      (error);
    }
  };

  const deleteMessage = async (messageId: string, deleteSelfOrNot: boolean) => {
    try {
      const res = await fetch(`/api/messages/${roomId}`, {
        method: "DELETE",
        body: JSON.stringify({messageId: messageId, deleteSelfOrNot: deleteSelfOrNot}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if(data["deleteId"])
      {
        setMessages(messages.filter(item => item.displayId !== data["deleteId"]));
      }
      router.refresh();
    } catch (error) {
      (error);
    }
  };

  // Subscribe to pusher events
  useEffect(() => {
    if (!rId) return;
    const channelName = `${rId}`;
    try {
      const channel = pusherClient.subscribe(channelName);
      channel.bind("message:create", ({ senderId, newmessage: received_newmessages }: PusherPayload) => {
        if(senderId == userId)
        {
          return;
        }
        setMessages((messages) => [...messages, Array.isArray(received_newmessages) ? received_newmessages[0] : received_newmessages]);
        // console.log("received_newmessages");
        // console.log(received_newmessages);
      });

      channel.bind("message:delete", ({senderId: senderId, deleteId: deleteId}: DeletePusherPayload) => {
        if(senderId == userId)
        {
          return;
        }
        setMessages(messages.filter(item => item.displayId !== deleteId));
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      router.push("/chat");
    }

    const fetchRoom = async () => {
      const res = await fetch(`/api/messages/${rId}`);
      const data = await res.json();
      setMessages(data["messages"]);
      router.refresh();
    };
    fetchRoom();
    // Unsubscribe from pusher events when the component unmounts
    return () => {
      pusherClient.unsubscribe(channelName);
    };
    
  }, []);

  return {
    messages,
    setMessages,
    sendMessage,
    deleteMessage,
  };
};