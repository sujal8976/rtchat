"use client";

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { Users } from "@repo/ui/icons";
import Link from "next/link";

interface RoomCardProps {
  name: string;
  id: string;
  description: string | null;
  onClickSidebarClose?: (value: boolean) => void;
}

export function RoomCard({
  name,
  id,
  description,
  onClickSidebarClose,
}: RoomCardProps) {
  return (
    <Link href={`/chat/${id}`} className="w-full">
      <Button
        onClick={() => {
          if (onClickSidebarClose) onClickSidebarClose(false);
        }}
        variant="ghost"
        className="w-full justify-start py-3 px-0 h-auto"
      >
        <div className="flex items-center space-x-3 w-full">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-gray-200">
              <Users className="h-6 w-6 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start overflow-hidden w-full">
            <div className="text-sm font-medium truncate">{name}</div>
            <p className="text-xs text-gray-500 truncate">{description}</p>
          </div>
        </div>
      </Button>
    </Link>
  );
}
