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
  DialogClose,
} from "@repo/ui/components/ui/dialog";
import { LabelInput } from "@repo/ui/components/custom/labeledInput";
import { createRoom } from "../../lib/actions/room/rooms";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export function CreateRoom() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = {
        roomName: formData.get("roomName") as string,
        description: formData.get("description") as string,
      };
      const res = await createRoom(data.roomName, data.description);
      if (res.success) {
        console.log("Room created");
        router.push(`/chat/${res.roomId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
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
            required
          />
          <LabelInput
            label="Description"
            className="w-full sm:max-w-[50%] truncate"
            type="text"
            placeholder="Peaceful place to discuss with friends."
            name="description"
            required
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">
                <Plus />
                <span>Create Room</span>
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
