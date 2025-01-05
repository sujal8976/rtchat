import { cn } from "@repo/ui/lib/utils";
import { ChatMessage } from "../../types/websocket";
import { UserCircle } from "@repo/ui/icons";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { format } from "date-fns";
import { ChatUser } from "../../types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  messageUser?: ChatUser;
}

export function MessageBubble({
  messageUser,
  message,
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
          <span className="text-sm font-medium">{messageUser?.username}</span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2 max-w-[420px] break-words",
            isCurrentUser
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-100 dark:bg-slate-700"
          )}
        >
          {message.content}
        </div>
        <div className="flex items-center gap-1 text-xs">
          {format(new Date(message.createdAt), "h:mm a")}
        </div>
      </div>
    </div>
  );
}
