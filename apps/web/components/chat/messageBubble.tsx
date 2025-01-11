import { cn } from "@repo/ui/lib/utils";
import { UserCircle } from "@repo/ui/icons";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { format } from "date-fns";

interface MessageBubbleProps {
  content: string;
  createdAt: Date;
  username: string;
  isCurrentUser: boolean;
}

export function MessageBubble({
  content,
  username,
  createdAt,
  isCurrentUser,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[75%]",
        isCurrentUser ? "ml-auto flex-row-reverse" : ""
      )}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <UserCircle className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col gap-1",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        {!isCurrentUser && (
          <span className="text-sm font-medium">{username}</span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2 max-w-[420px] break-words",
            isCurrentUser
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-100 dark:bg-slate-700"
          )}
        >
          {content}
        </div>
        <div className="flex items-center gap-1 text-xs">
          {format(new Date(createdAt), "h:mm a")}
        </div>
      </div>
    </div>
  );
}
