"use client";

import { useSession } from "next-auth/react";
import { useMessagesStore } from "../../lib/store/messages";
import { useEffect, useRef } from "react";
import { ChevronDown } from "@repo/ui/icons";
import { MediaBubble } from "./mediaBubble";
import Loading from "../loading/loading";
import { useToast } from "@repo/ui/hooks/use-toast";

const MESSAGES_PER_PAGE = 30;
const SCROLL_THRESHOLD = 200;

interface ChatMessagesProps {
  roomId: string;
}

export function ChatMessages({ roomId }: ChatMessagesProps) {
  const { data: session } = useSession();
  const { messages, fetchMessages, resetStore, isLoading, hasMore } =
    useMessagesStore();

  const pageRef = useRef(1);
  const initializedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);
  const { toast } = useToast();

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollTop === 0 && hasMore && !isLoading) {
      handleLoadMore();
    }

    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      SCROLL_THRESHOLD;
    container.dataset.showScrollButton = (!isAtBottom).toString();
  };

  const handleLoadMore = async () => {
    if (!containerRef.current || isLoading) return;

    prevScrollHeightRef.current = containerRef.current.scrollHeight;

    pageRef.current += 1;
    try {
      await fetchMessages(roomId, pageRef.current, MESSAGES_PER_PAGE);
    } catch (error) {
      toast({
        title: "Failed to load more messages",
        variant: "destructive",
      });
    }

    if (containerRef.current) {
      const newScrollHeight = containerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;
      containerRef.current.scrollTop = scrollDiff;
    }
  };

  const scrollToBottom = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  };

  useEffect(() => {
    const initializeChat = async () => {
      if (initializedRef.current) return;

      resetStore();
      pageRef.current = 1;
      try {
        await fetchMessages(roomId, 1, MESSAGES_PER_PAGE);
      } catch (error) {
        toast({
          title: "Failed to load more messages",
          variant: "destructive",
        });
      }
      scrollToBottom();
      initializedRef.current = true;
    };

    initializeChat();
  }, [roomId, resetStore, fetchMessages]);

  useEffect(() => {
    if (!containerRef.current || messages.length === 0) return;

    const container = containerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      SCROLL_THRESHOLD;

    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages]);

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col justify-center items-center text-xl font-medium w-full h-[calc(100svh-73px-81px-77px)]">
        <p>User is not Logged In</p>
        <p>Please refresh the page and try again to connect to Room...</p>
      </div>
    );
  }

  if (!initializedRef.current && isLoading) {
    return <Loading text="Loading Chats..." />;
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-[calc(100svh-73px-65px-61px)] lg:h-[calc(100svh-73px-81px-77px)] p-4 pb-0 overflow-y-scroll"
      >
        {isLoading && <Loading text="Loading messages..." />}

        <div className="">
          {messages.map((msg, index) => {
            const previousMessage = index > 0 ? messages[index - 1] : null;
            const isConsecutive = previousMessage
              ? previousMessage.userId === msg.userId
              : false;
            return (
              <MediaBubble
                key={msg.id}
                messageId={msg.id}
                message={msg.message || null}
                username={msg.user.username}
                createdAt={msg.createdAt}
                isCurrentUser={msg.userId === session?.user?.id}
                mediaUrl={msg.mediaUrl}
                mediaType={msg.mediaType}
                isConsecutive={isConsecutive}
              />
            );
          })}
        </div>
      </div>

      <button
        onClick={scrollToBottom}
        className="absolute bottom-4 right-4 z-20 dark:bg-white bg-slate-500 shadow-lg rounded-full p-2 hover:bg-gray-400 transition-colors cursor-pointer"
        style={{
          display:
            containerRef.current?.dataset.showScrollButton === "true"
              ? "block"
              : "none",
        }}
      >
        <ChevronDown className="dark:text-black" />
      </button>
    </div>
  );
}
