"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Plus } from "@repo/ui/icons";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@repo/ui/components/ui/dialog";
import { LabelInput } from "@repo/ui/components/custom/labeledInput";
import { createRoom } from "../../lib/actions/room/rooms";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/hooks/use-toast";

export function CreateRoom() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      roomName: formData.get("roomName") as string,
      description: formData.get("description") as string,
    };

    if (!data.roomName || !data.description) {
      toast({
        title: "Room validation Error",
        description: "Provide all fields",
        variant: "destructive",
      });
      return setLoading(false);
    }
    const res = await createRoom(data.roomName, data.description);
    if (res.success && res.roomId) {
      toast({
        title: "Room Created Successfully",
        description: "Welcome to the Room",
      });
      setIsOpen(false);
      router.push(`/chat/${res.roomId}`);
    } else if (res.error) {
      toast({
        title: res.error.code,
        description: res.error.message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span>Create Room</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-[500px]">
        <DialogHeader className="flex justify-center items-center mb-8">
          <DialogTitle>Create New Room</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 flex flex-col items-center"
        >
          <LabelInput
            label="Name"
            className="w-full sm:max-w-[50%]"
            type="text"
            placeholder="Friends Circle"
            name="roomName"
            disabled={loading}
          />
          <LabelInput
            label="Description"
            className="w-full sm:max-w-[50%] truncate"
            type="text"
            placeholder="Peaceful place to discuss with friends."
            name="description"
            disabled={loading}
          />
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <Plus />
                  <span>Create Room</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
