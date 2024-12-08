import { cn } from "@repo/ui/lib/utils";
import { Message, User } from "../../testData/chat";
import { Check, CheckCheck, UserCircle } from "@repo/ui/icons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: Message;
  user: User;
  isCurrentUser: boolean;
}

const statusIcons = {
  sent: <Check className="h-3 w-3" />,
  delivered: <CheckCheck className="h-3 w-3" />,
  read: <CheckCheck className="h-3 w-3 text-blue-500" />,
};

export function MessageBubble({
  message,
  user,
  isCurrentUser,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[75%]",
        isCurrentUser ? "ml-auto flex-row-reverse":""
      )}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={user.name} />
          ) : (
            <AvatarFallback>
              <UserCircle className="h-5 w-5" />
            </AvatarFallback>
          )}
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col gap-1",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        {!isCurrentUser && (
          <span className="text-sm font-medium">{user.name}</span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2 max-w-[420px] break-words",
            isCurrentUser ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-100 dark:bg-slate-700"
          )}
        >
          {message.message}
        </div>
        <div className="flex items-center gap-1 text-xs">
          {format(new Date(message.timestamp), "h:mm a")}
          {isCurrentUser && message.status && (
            <span className="ml-1">{statusIcons[message.status]}</span>
          )}
        </div>
      </div>
    </div>
  );
}
