"use client";

import { useSession } from "next-auth/react";
import { MessageBubble } from "./messageBubble";
import { useMessagesStore } from "../../lib/store/messages";
import { useCallback, useEffect, useRef } from "react";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import Loading from "../loading/loading";
import { ChevronDown } from "@repo/ui/icons";

interface ChatMessagesProps {
  roomId: string;
}

export function ChatMessages({ roomId }: ChatMessagesProps) {
  const { data } = useSession();
  const pageRef = useRef(1);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollHeightRef = useRef(0);
  const isFirstLoadRef = useRef(true);
  const initialLoadCompletedRef = useRef(false);

  const { messages, fetchMessages, resetStore, isLoading, hasMore } =
    useMessagesStore();

  const scrollToBottom = useCallback(() => {
    if (messageEndRef.current) {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, []);

  const isNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;

    const distanceFromBottom =
      container.scrollHeight - (container.scrollTop + container.clientHeight);

    const threshold = 300;
    return distanceFromBottom <= threshold;
  }, []);

  // Initial load effect
  useEffect(() => {
    const initialLoad = async () => {
      if (initialLoadCompletedRef.current) return;

      resetStore();
      pageRef.current = 1;
      await fetchMessages(roomId, 1, 30);
      scrollToBottom();
      initialLoadCompletedRef.current = true;
      isFirstLoadRef.current = false;
    };

    initialLoad();
  }, [roomId, resetStore, fetchMessages]);

  useEffect(() => {
    if (messages.length === 0 || !initialLoadCompletedRef.current) return;

    if (isNearBottom()) {
      scrollToBottom();
    }
  }, [messages]);

  const handleInfiniteScroll = useCallback(async () => {
    if (isLoading || !hasMore || !initialLoadCompletedRef.current) return;

    if (containerRef.current) {
      scrollHeightRef.current = containerRef.current.scrollHeight;
    }

    pageRef.current += 1;
    await fetchMessages(roomId, pageRef.current, 30);

    if (containerRef.current) {
      const newScrollHeight = containerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - scrollHeightRef.current;
      containerRef.current.scrollTop += scrollDiff;
    }
  }, [isLoading, hasMore, fetchMessages, roomId]);

  const firstMessageRef = useInfiniteScroll<HTMLDivElement>(
    handleInfiniteScroll,
    [hasMore, !isLoading]
  );

  if (!data?.user?.id) {
    return (
      <div className="flex flex-col justify-center items-center text-xl font-medium w-full h-[calc(100svh-73px-81px-77px)]">
        <p className="w-[80%]">User is not Logged In</p>
        <p className="w-[80%]">
          Please try to refresh the page and try again to connect to Room...
        </p>
      </div>
    );
  }

  if (isFirstLoadRef.current && isLoading) {
    return <Loading text="Loading Chats..." />;
  }

  return (
    <>
      <div className="relative">
        <div
          ref={containerRef}
          className="w-full h-[calc(100svh-73px-81px-77px)] p-4 overflow-y-scroll"
        >
          {isLoading && (
            <div className="h-4">
              <Loading text="Loading messages..." />
            </div>
          )}
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                messageId={msg.id}
                ref={i === 0 ? firstMessageRef : null}
                content={msg.content}
                username={msg.user.username}
                createdAt={msg.createdAt}
                isCurrentUser={msg.userId === data?.user?.id}
              />
            ))}
          </div>
          <div ref={messageEndRef} />
        </div>
        {!isNearBottom() && (
          <div
            onClick={() => scrollToBottom()}
            className="absolute bottom-4 right-4 z-20 dark:bg-white bg-slate-500 shadow-lg rounded-full p-2 hover:bg-gray-400 transition-colors cursor-pointer"
          >
            <ChevronDown className="dark:text-black" />
          </div>
        )}
      </div>
    </>
  );
}
