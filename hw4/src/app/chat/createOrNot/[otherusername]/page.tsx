
import { redirect } from "next/navigation";
import { publicEnv } from "@/lib/env/public";
import { headers } from "next/headers";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { createRoom } from "@/app/chat/_components/actions";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export default async function CreateOrNot() {
  const headersList = headers(); 
  const domain = headersList.get('x-pathname');
  const t = domain?.split('/');
  const otherusername = Array.isArray(t) ? t[3] : "";
  // console.log(domain);
  // console.log(t);
  // console.log(otherusername);
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;

  return (
    <div className="flex items-center justify-center mt-20">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>是否新增聊天室？</CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <form
            action={async () => {
              "use server";
              redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat`);
            }}
          >
          <Button>返回</Button>
          </form>
          <form
            action={async () => {
              "use server";
              const result = await createRoom(userId, otherusername);
              revalidatePath('/CreateOrNot');
              // console.log(otherusername);
              if (!result) {
                 redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/not_exist`);
               }
              redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat/${result}`);
            }}
          >
          <Button>新增</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
