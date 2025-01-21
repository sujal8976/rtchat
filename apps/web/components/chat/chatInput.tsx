"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Send } from "@repo/ui/icons";
import { useEffect, useRef, useState } from "react";
import { useMessagesStore } from "../../lib/store/messages";
import { useSession } from "next-auth/react";

export function ChatInput({
  sendMessage,
  roomId,
}: {
  sendMessage: (message: string, tempId: string) => void;
  roomId: string;
}) {
  const [message, setMessage] = useState("");
  const addMessage = useMessagesStore().addMessage;
  const { data } = useSession();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const tempId = `temp-${Date.now().toString()}`;

    sendMessage(message, tempId);
    addMessage({
      id: tempId,
      content: message,
      userId: data?.user?.id as string,
      roomId: roomId,
      createdAt: new Date(),
      user: {
        username: data?.user?.username as string,
      },
    });

    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t-2 h-[77px] dark:border-t p-4 bg-background bottom-0"
    >
      <div className="flex gap-4 items-end max-w-[900px] mx-auto">
        <Textarea
          ref={textareaRef}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[44px] max-h-[200px] resize-none"
          rows={1}
        />
        <Button type="submit" size="icon" className="h-11 w-11 shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
