import { Button } from "@repo/ui/components/ui/button";
import { LogOut, Settings, Users } from "@repo/ui/icons";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@repo/ui/components/ui/sheet";
import { ChatMembersContent } from "./chatMembers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useChatStore } from "../../lib/store/chat";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { useMessagesStore } from "../../lib/store/messages";
import Image from "next/image";

interface ChatHeaderProps {
  name: string;
  roomImage: string | null;
  description: string | null;
  exitRoom: () => void;
}

export function ChatHeader({
  name,
  description,
  roomImage,
  exitRoom,
}: ChatHeaderProps) {
  const router = useRouter();
  const setCurrentRoom = useChatStore().setCurrentRoom;
  const resetStore = useMessagesStore().resetStore;

  return (
    <div className="border-b dark:border-amber-50 lg:border-b-2 lg:dark:border-b lg:h-[81px] px-6 py-2 lg:py-4 flex items-center justify-between backdrop-blur">
      <div className="flex items-center gap-4">
        <Avatar className="size-12 flex-shrink-0">
          {roomImage ? (
            <Image
              className="h-12 w-12 rounded-full"
              src={roomImage}
              alt=""
              height={48}
              width={48}
            />
          ) : (
            <AvatarFallback className="bg-gray-200">
              <Users className="text-gray-500" size={28} />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={"ghost"} size={"icon"} className="  lg:flex">
              <Settings className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                setCurrentRoom(null);
                exitRoom();
                resetStore();
                router.push("/chat");
              }}
              className="text-base flex items-center justify-between"
            >
              <LogOut />
              Exit Room
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className="lg:hidden">
              <Users className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side={"right"} className="p-4 mb-4">
            <h2 className="font-semibold my-5">Room Members</h2>
            <ChatMembersContent />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
