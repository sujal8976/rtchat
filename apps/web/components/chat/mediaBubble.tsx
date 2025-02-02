import { cn } from "@repo/ui/lib/utils";
import { UserCircle, Check, Clock } from "@repo/ui/icons";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { format } from "date-fns";
import { forwardRef } from "react";
import { ImageZoom } from "../client utilities/zoomableImage";

interface MediaBubbleProps {
  mediaType: "image" | "video" | null;
  mediaUrl: string | null;
  message: string | null;
  createdAt: Date;
  username: string;
  isCurrentUser: boolean;
  messageId: string;
}

export const MediaBubble = forwardRef<HTMLDivElement, MediaBubbleProps>(
  (
    {
      mediaType,
      mediaUrl,
      message,
      username,
      createdAt,
      isCurrentUser,
      messageId,
    },
    ref
  ) => {
    if (
      (!mediaType && !mediaUrl && !message) ||
      (!mediaType && mediaUrl) ||
      (!mediaUrl && mediaType)
    )
      return;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-0.5 w-full mb-3",
          isCurrentUser ? " flex-row-reverse" : ""
        )}
      >
        {!isCurrentUser && (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <UserCircle className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{username}</span>
          </div>
        )}
        <div
          className={cn(
            "flex gap-0.5",
            isCurrentUser ? "items-end" : "items-start"
          )}
        >
          <div
            className={cn(
              "rounded-xl max-w-[300px] md:max-w-[420px] break-words",
              isCurrentUser
                ? "bg-gradient-to-b from-black to-gray-800 text-white dark:from-white dark:to-slate-300 dark:text-black"
                : "bg-gray-300 dark:bg-slate-700"
            )}
          >
            {mediaType === "image" && mediaUrl && (
              <ImageZoom
                src={mediaUrl}
                alt="Shared media"
                height={200}
                width={420}
                className="w-full max-h-[300px] object-cover rounded-xl border-inherit border"
              />
            )}
            {mediaType === "video" && mediaUrl && (
              <video
                src={mediaUrl}
                controls
                className="w-full max-h-[300px] rounded-xl border-inherit border"
              />
            )}
            {message && (
              <div className={cn("pl-3 pr-6 py-1 pb-0 break-words")}>
                {message}
              </div>
            )}
            <div className="flex justify-end">
              <div className="text-xs pr-1.5">
                {format(new Date(createdAt), "HH:mm")}
              </div>
            </div>
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
    );
  }
);

MediaBubble.displayName = "MediaBubble";
