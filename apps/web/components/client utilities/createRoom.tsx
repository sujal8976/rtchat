"use client";

import { Button } from "@repo/ui/components/ui/button";
import { ChevronDown, Plus } from "@repo/ui/icons";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { useJoinedRoomsStore } from "../../lib/store/mobileRoomSidebar";
import { Room } from "../../types/room";

interface CreateRoomProps {
  onUpdate?: (value: boolean) => void;
}

export function CreateRoom({ onUpdate }: CreateRoomProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const addJoinedRoom = useJoinedRoomsStore().addJoinedRoom;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      roomName: formData.get("roomName") as string,
      description: formData.get("description") as string,
      code: formData.get("code") as string | null,
    };

    if (!data.roomName || !data.description || (isPrivate && !data.code)) {
      toast({
        title: "Room validation Error",
        description: "Provide all fields",
        variant: "destructive",
      });
      return setLoading(false);
    }
    const res = await createRoom(
      data.roomName,
      data.description,
      isPrivate,
      data.code
    );
    if (res.success && res.roomId) {
      toast({
        title: "Room Created Successfully",
        description: "Welcome to the Room",
      });
      setIsOpen(false);

      const newRoom: Room = {
        id: res.roomId,
        name: data.roomName,
        description: data.description,
        isPrivate,
      };
      addJoinedRoom({ room: newRoom });

      if (onUpdate) onUpdate(false);
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
      <DialogContent className="max-w-[90%] sm:max-w-[600px]">
        {/* <DialogHeader className="flex justify-center items-center mb-8"> */}
        <DialogTitle className="w-full text-center">
          Create New Room
        </DialogTitle>
        {/* </DialogHeader> */}
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 flex flex-col items-center"
        >
          <LabelInput
            label="Name"
            className="w-full sm:max-w-[70%]"
            type="text"
            placeholder="Friends Circle"
            name="roomName"
            disabled={loading}
          />
          <LabelInput
            label="Description"
            className="w-full sm:max-w-[70%] truncate"
            type="text"
            placeholder="Peaceful place to discuss with friends."
            name="description"
            disabled={loading}
          />
          <div className="flex w-full sm:max-w-[70%] justify-between items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-col gap-2">
                  <p className="text-sm">Status</p>
                  <Button variant={"outline"} className="px-6">
                    <ChevronDown />
                    <span>{isPrivate ? "Private" : "Public"}</span>
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsPrivate(false)}>
                  Public
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsPrivate(true)}>
                  Private
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <LabelInput
              label="Private Code"
              className="truncate w-full"
              type="text"
              name="code"
              placeholder="Code"
              disabled={loading || !isPrivate}
            />
          </div>
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
