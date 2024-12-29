import { Button } from "@repo/ui/components/ui/button";
import { ChatUser } from "../../types/chat";
import { Settings, Users } from "@repo/ui/icons";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/components/ui/sheet";
import { ChatMembersContent } from "./chatMembers";

interface ChatHeaderProps {
    name: string;
    description: string | null;
    users: ChatUser[]
  }
  
  export function ChatHeader({name, description, users}:ChatHeaderProps){
    return (
        <div className="border-b-2 dark:border-b-slate-500 px-6 py-4 flex items-center justify-between backdrop-blur">
             <div>
        <h2 className="text-xl font-semibold">{name}</h2>
        {description && <p className="text-sm text-gray-500">
         {description}
        </p>}
      </div>
      <div className="flex justify-center gap-2">
        {/* Desktop  */}
        <Button variant={"ghost"} size={"icon"} className=" hidden lg:flex">
          <Settings className="size-4" />
        </Button>
        {/* Mobile  */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className="lg:hidden">
              <Users className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side={"right"} className="p-4 mb-4">
            <h2 className="font-semibold my-5">Room Members</h2>
            <ChatMembersContent users={users} />
          </SheetContent>
        </Sheet>
      </div>
        </div>
    )
}