import { cn } from "@repo/ui/lib/utils";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { UserCircle } from "@repo/ui/icons";
import { useRoomMembersStore } from "../../lib/store/roomMembers";
import Image from "next/image";

export function ChatMembers() {
  return (
    <div className="border-l-2 dark:border-l p-4 pt-2 w-72 h-[calc(100svh-73px)] lg:overflow-y-scroll hidden lg:block mb-0">
      <h2 className="font-semibold my-5">Room Members</h2>
      <ChatMembersContent />
    </div>
  );
}

export function ChatMembersContent() {
  const users = useRoomMembersStore().roomMembers;
  const adminId = useRoomMembersStore().adminUserId;

  return (
    <div className="space-y-4 mt-1 h-[calc(100%-70px)] lg:h-auto overflow-y-scroll">
      {users.map((user) => (
        <div key={user.id} className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              {user.image ? (
                <Image
                  className="h-12 w-12 rounded-full"
                  src={user.image}
                  alt=""
                  height={48}
                  width={48}
                />
              ) : (
                <AvatarFallback className="bg-gray-200">
                  <UserCircle className="text-gray-500 size-7" />
                </AvatarFallback>
              )}
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
              <span className="text-sm flex gap-2 items-center font-medium truncate">
                {user.username}
                {adminId === user.id && (
                  <span className="text-xs text-gray-400">Admin</span>
                )}
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
  );
}
