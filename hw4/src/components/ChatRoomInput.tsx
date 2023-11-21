"use client";

import { useMessage } from "@/hooks/useMessages";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    senderId: string;
};
  
function ChatRoomInput({ senderId } : Props) {
    const { sendMessage } = useMessage();
    const [content, setContent] = useState<string>("");
  
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!content) return;
      sendMessage({ content, senderId: senderId });
      setContent("");
      router.refresh();
    };

    return (
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Aa"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-md flex-1 border border-gray-300 p-1 rounded-md outline-none focus:border-gray-600 transition duration-200 ease-in-out"
        />
        <button
          type="submit"
          className="bg-black text-white py-1 px-2 rounded-lg text-sm hover:bg-gray-700 transition duration-200 ease-in-out"
        >
          Send
        </button>
      </form>
    );
  }
  
  export default ChatRoomInput;