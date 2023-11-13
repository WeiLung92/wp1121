export type User = {
    id: string;
    username: string;
    email: string;
    provider: "github" | "credentials";
  };

export type Message = {
    id: string;
    sender: User['id'];
    receiver: User['id'];
    content: string;
    createdAt: Date;
};  

export type ChatRoom = {
    id: string;
    createdAt: Date;
};