"use client";

import React from "react";
import { useRoom } from "@/hooks/useRoom";
import { useMessage } from "@/hooks/useMessages";
import Avatar from "@/app/chat/_components/Avatar"
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"


function ChatRoomMessages() {
  const { messages, deleteMessage } = useMessage();
  const { otheruser, userId, announcement, updateAnnouncement } = useRoom();
  // console.log("ChatRoomMessage");
  // console.log(messages);
  const handleAnnounce = (content: string) => {
    updateAnnouncement(content);
  }
  const handleDeleteAll = (messageId: string) => {
    deleteMessage(messageId, false);
  }
  const handleDeleteSelf = (messageId: string) => {
    deleteMessage(messageId, true);
  }
  return (
    <div className="px-2 pt-4">
      {messages?.map((message, index) => {
        const isSender = message.senderId === userId;
        return (
          <div key={index} className="w-full pt-1">
            {(!message.deleteSelf || !isSender)&&
            <div
              className={`flex flex-row items-end gap-2 ${
                isSender && "justify-end"
              }`}
            >
              {!isSender && (
                <Avatar
                  username={otheruser}
                  classname="bg-black text-white w-8 h-8"
                />
              )}
              <Dialog>
                <DialogTrigger asChild>
                    <Button
                      className={`max-w-[60%] rounded-2xl px-3 py-1 leading-6 ${
                        isSender ? "bg-blue-600 text-white" : " bg-gray-200 text-black hover:bg-blue-400"
                      }`}
                    >
                      {message.content}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  將這則訊息
                  <DialogClose asChild>
                    <Button onClick={() => handleAnnounce(message.content)}>
                      設為公告
                    </Button>
                  </DialogClose>
                  {isSender && <> <DialogClose asChild>
                    <Button onClick={() => handleDeleteAll(message.displayId)}>
                      對所有人收回
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={() => handleDeleteSelf(message.displayId)}>
                      對自己收回
                    </Button>
                  </DialogClose> </>}
                </DialogContent>
              </Dialog>
            </div>
          }
          </div>
        );
      })}
    </div>
  );
}

export default ChatRoomMessages;