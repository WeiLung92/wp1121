"use client";
import { useRouter } from "next/navigation";
import { publicEnv } from "@/lib/env/public";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

function Exist() {
  const router = useRouter();
  const handleBack = () => {
    router.push(`${publicEnv.NEXT_PUBLIC_BASE_URL}/chat`);
  };
  return (
    <div className="flex items-center justify-center mt-20">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>聊天室已存在</CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-between">
        <Button onClick={() => handleBack()}>返回</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Exist;