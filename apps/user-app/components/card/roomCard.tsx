import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import { UserCircle } from "@repo/ui/icons/userCircle";
import Link from "next/link";

interface RoomCard {
  name: string;
  id: string;
  description: string;
}

export function RoomCard({ name, id, description }: RoomCard) {
  return (
    <Link href={`/chat/${id}`} className="block w-full">
      <Button variant="ghost" className="w-full justify-start py-3 px-0 h-auto">
        <div className="flex items-center space-x-3 w-full">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-gray-200">
              <UserCircle className="h-6 w-6 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start overflow-hidden w-full">
            <div className="text-sm font-medium truncate">{name}</div>
            <div className="text-xs text-gray-500 truncate max-w-full">
              {description}
            </div>
          </div>
        </div>
      </Button>
    </Link>
  );
}
