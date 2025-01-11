"use client";

import { useSession } from "next-auth/react";
import { MessageBubble } from "./messageBubble";
import { useMessagesStore } from "../../lib/store/messages";
import { useCallback, useEffect, useRef } from "react";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import Loading from "../loading/loading";

interface ChatMessagesProps {
  roomId: string;
}

export function ChatMessages({ roomId }: ChatMessagesProps) {
  const { data } = useSession();
  const pageRef = useRef(1);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const isFirstLoadRef = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollHeightRef = useRef(0);
  const { messages, fetchMessages, resetStore, isLoading, hasMore } =
    useMessagesStore();

  const scrollToBottom = useCallback(() => {
    if (messageEndRef.current) {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, []);

  const isNearBottom = useCallback(() => {
    const container = containerRef.current;
    const endElement = messageEndRef.current;
    
    if (!container || !endElement) return false;

    const containerRect = container.getBoundingClientRect();
    const endElementRect = endElement.getBoundingClientRect();
    
    // Distance between bottom of container and messageEndRef
    const distance = endElementRect.bottom - containerRect.bottom;
    return Math.abs(distance) < 300;
  }, []);

  const saveScrollPosition = useCallback(() => {
    if (containerRef.current) {
      scrollHeightRef.current = containerRef.current.scrollHeight;
    }
  }, []);

  const restoreScrollPosition = useCallback(() => {
    if (containerRef.current) {
      const newScrollHeight = containerRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - scrollHeightRef.current;
      containerRef.current.scrollTop += scrollDiff;
    }
  }, []);

  useEffect(() => {
    const initialLoadJob = async() => {
      resetStore();
      pageRef.current = 1;
      await fetchMessages(roomId, 1, 40);
    }
    initialLoadJob();
  }, [roomId]);

  useEffect(() => {
    if (messages.length === 0) return;

    if (isFirstLoadRef.current) {
      scrollToBottom();
      isFirstLoadRef.current = false;
    } else if (isNearBottom()) {
      scrollToBottom()
    } else if (!isLoading && pageRef.current > 1) {
      restoreScrollPosition();
    }
  }, [messages]);

  const handleInfiniteScroll = useCallback(() => {
    if (isLoading || !hasMore) return;
    saveScrollPosition();
    pageRef.current += 1;
    fetchMessages(roomId, pageRef.current, 40);
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

  if (isFirstLoadRef && isLoading) {
    return <Loading text="Loading Chats..." />;
  }
  
  return (
    <>
      <div
        ref={containerRef}
        className="w-full h-[calc(100svh-73px-81px-77px)] p-4 overflow-y-scroll"
      >
        {isLoading && (
          <div className="h-4">
            <Loading text="Loading messages..." />
          </div>
        )}
        <div ref={firstMessageRef} />
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              content={msg.content}
              username={msg.user.username}
              createdAt={msg.createdAt}
              isCurrentUser={msg.userId === data?.user?.id}
            />
          ))}
        </div>
      </div>
      <div ref={messageEndRef} />
    </>
  );
}
