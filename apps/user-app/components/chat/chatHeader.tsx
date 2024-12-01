import { Button } from "@repo/ui/components/ui/button";
import { Settings, Users } from "@repo/ui/icons";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@repo/ui/components/ui/sheet";
import { ChatMembersContent } from "./chatMembers";

export function ChatHeader() {
  return (
    <div className="border-b-2 dark:border-b-slate-500 px-6 py-4 flex items-center justify-between backdrop-blur">
      <div>
        <h2 className="text-xl font-semibold">Room 1</h2>
        <p className="text-sm text-gray-500">
          A place for general chat and discussions
        </p>
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
            <ChatMembersContent />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
