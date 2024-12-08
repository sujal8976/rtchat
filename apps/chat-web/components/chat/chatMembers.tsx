import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { MEMBERS } from "../../testData/roomMembers";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { UserCircle } from "@repo/ui/icons";
import { cn } from "@repo/ui/lib/utils";

const statusStyles = {
  online: "bg-green-500",
  offline: "bg-gray-400",
};

export function ChatMembers() {
  return (
    <div className="border-l-2 dark:border-l-slate-500 p-4 w-72 mb-4 hidden lg:block">
    <h2 className="font-semibold my-5">Room Members</h2>
      <ChatMembersContent />
    </div>
  );
}

export function ChatMembersContent(){
  return(
      // <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-4 mt-1 overflow-y-scroll scroll-area max-h-[80vh]">
          {MEMBERS.map((mem) => (
            <div key={mem.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarFallback>
                    <UserCircle className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 size-2.5 rounded-full border-2",
                    statusStyles[mem.status]
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">
                    {mem.username}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-xs",
                    mem.status === "online" ? "text-green-500" : "text-gray-400"
                  )}
                >
                  {mem.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      // </ScrollArea>
  )
}