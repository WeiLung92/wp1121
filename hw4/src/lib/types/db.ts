export type User = {
    id: string;
    username: string;
    email: string;
    provider: "github" | "credentials";
  };

export type Message = {
    displayId: string;
    senderId: User['id'];
    content: string;
    roomId: string;
    createdAt: Date;
    deleteSelf: boolean;
};  

export type ChatRoom = {
    id: string;
    latestMessage: string;
    announcement: string;
    createdAt: Date;
};