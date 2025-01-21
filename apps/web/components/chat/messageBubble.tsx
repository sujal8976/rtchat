import { cn } from "@repo/ui/lib/utils";
import { UserCircle, Check, Clock } from "@repo/ui/icons";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { format } from "date-fns";
import { forwardRef } from "react";

interface MessageBubbleProps {
  content: string;
  createdAt: Date;
  username: string;
  isCurrentUser: boolean;
  messageId: string;
}

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ content, username, createdAt, isCurrentUser, messageId }, ref) => {
    return (
      <div
        ref={ref}
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
          <div className="flex items-center justify-center gap-2">
            <div className=" gap-1 text-xs">
              {format(new Date(createdAt), "h:mm a")}
            </div>
            {isCurrentUser && (
              <div className="text-xs flex items-end">
                {messageId.startsWith("temp-") ? (
                  <Clock className="size-4" />
                ) : (
                  <Check className="size-4" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";
