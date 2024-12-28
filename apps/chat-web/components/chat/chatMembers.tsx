import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { UserCircle } from "@repo/ui/icons";
import { cn } from "@repo/ui/lib/utils";
import { ChatUser } from "../../types/chat";

const statusStyles = {
  online: "bg-green-500",
  offline: "bg-gray-400",
};

interface ChatMembersProps {
  users: ChatUser[];
}

export function ChatMembers({ users }: ChatMembersProps) {
  return (
    <div className="border-l-2 dark:border-l-slate-500 p-4 w-72 mb-4 hidden lg:block">
      <h2 className="font-semibold my-5">Room Members</h2>
      <ChatMembersContent users={users} />
    </div>
  );
}

interface ChatMembersContentProps {
  users: ChatUser[];
}

export function ChatMembersContent({ users }: ChatMembersContentProps) {
  return (
    // <ScrollArea className="h-[calc(100vh-8rem)]">
    <div className="space-y-4 mt-1 overflow-y-scroll scroll-area max-h-[80vh]">
      {users.map((user) => (
        <div key={user.id} className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarFallback>
                <UserCircle className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "absolute bottom-0 right-0 size-2.5 rounded-full border-2",
                user.isOnline ? "bg-green-500" : "bg-gray-400"
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">
                {user.username}
              </span>
            </div>
            <span
              className={cn(
                "text-xs",
                user.isOnline ? "text-green-500" : "text-gray-400"
              )}
            >
              {user.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      ))}
    </div>
    // </ScrollArea>
  );
}