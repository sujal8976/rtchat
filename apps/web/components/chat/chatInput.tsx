"use client";
import { Button } from "@repo/ui/components/ui/button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { useToast } from "@repo/ui/hooks/use-toast";
import { Send, ImagePlus } from "@repo/ui/icons";
import { useEffect, useRef, useState } from "react";
import { ImageZoom } from "../client utilities/zoomableImage";
import { MediaFile } from "../../types/messages";

export function ChatInput({
  sendMessage,
}: {
  sendMessage: (message: string, media: MediaFile | null) => void;
}) {
  const [message, setMessage] = useState("");
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // (5MB = 5 * 1024 * 1024 bytes)
      toast({
        title: "File size must be less than 5MB",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    const fileType = file.type.split("/")[0];
    if (fileType !== "image" && fileType !== "video") {
      toast({
        title: "Only image and video files are allowed",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setMediaFile({
      file,
      type: fileType as "image" | "video",
      preview,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !mediaFile) return;

    sendMessage(message, mediaFile);

    setMessage("");
    setMediaFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const removeMedia = () => {
    if (mediaFile) {
      URL.revokeObjectURL(mediaFile.preview);
      setMediaFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className=" bottom-0 left-0 right-0 bg-background">
      {mediaFile && (
        <div className="fixed bottom-[68px] left-10 right-0 bg-background">
          <div className="max-w-[900px] mx-auto p-2">
            <div className="relative inline-block">
              {mediaFile.type === "image" && (
                <ImageZoom
                  src={mediaFile.preview}
                  alt="preview"
                  className="h-[150px] w-auto object-contain rounded-lg"
                  height={150}
                  width={200}
                />
              )}
              {mediaFile.type === "video" && (
                <video
                  src={mediaFile.preview}
                  controls
                  className="h-[150px] w-auto object-contain rounded-lg"
                />
              )}
              <button
                type="button"
                onClick={removeMedia}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="lg:border-t-2 h-[52px] p-2 px-4 lg:dark:border-t lg:p-4"
      >
        <div className="flex gap-2 items-end max-w-[900px] mx-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,video/*"
            className="hidden"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-11 w-11 shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
          <Textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[44px] max-h-[44px] w-full resize-none px-3"
            rows={1}
          />
          {(message || mediaFile) && (
            <Button type="submit" size="icon" className="h-11 w-11 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
