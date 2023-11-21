import type { User } from "@/lib/types/db";
import React from "react";

type Props = {
  username: User["username"];
  classname?: string;
};

function Avatar({ username, classname }: Props) {
  return (
    <div
      className={`rounded-full flex items-center justify-center ${classname}`}
    >
      <span className="font-semibold text-xl">
        {/* The first letter of text */}
        {username.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export default Avatar;