"use client";

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { Users } from "@repo/ui/icons";
import Image from "next/image";

interface RoomCardProps {
  name: string;
  description: string | null;
  roomImage: string | null;
  onClickSidebarClose?: (value: boolean) => void;
}

export function RoomCard({
  name,
  description,
  roomImage,
  onClickSidebarClose,
}: RoomCardProps) {
  return (
    <Button
      onClick={() => {
        if (onClickSidebarClose) onClickSidebarClose(false);
      }}
      variant="ghost"
      className="w-full justify-start py-3 px-0 h-auto"
    >
      <div className="flex items-center space-x-3 w-full">
        <Avatar className="h-10 w-10 flex-shrink-0">
          {roomImage ? (
            <Image
              className="h-10 w-10 rounded-full"
              src={roomImage}
              alt=""
              height={40}
              width={40}
            />
          ) : (
            <AvatarFallback className="bg-gray-200">
              <Users className="h-6 w-6 text-gray-500" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col items-start overflow-hidden w-full">
          <div className="text-sm font-medium truncate">{name}</div>
          <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>
      </div>
    </Button>
  );
}
