import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { RoomCard } from "./roomCard";
import { ChangeEvent, useState } from "react";
import { Input } from "@repo/ui/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/hooks/use-toast";
import {
  addUserToRoom,
  validatePrivateRoomCode,
} from "../../lib/actions/room/rooms";

interface SearchedRoomCardProps {
  name: string;
  id: string;
  description: string;
  isPrivate: boolean;
  isJoinedRoom: boolean;
  onUpdate?: (value: boolean) => void;
}

export function SearchedRoomCard({
  name,
  id,
  description,
  isPrivate,
  isJoinedRoom,
  onUpdate,
}: SearchedRoomCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [privateCode, setPrivateCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const privateJoinRoomHandler = async () => {
    setLoading(true);
    if (!privateCode) {
      toast({
        title: "Please provide Private Key",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const isValidated = await validatePrivateRoomCode(id, privateCode);

      if (!isValidated) {
        throw new Error("Please provide correct private key");
      }

      const isUserAdded = await addUserToRoom(id);
      if (isUserAdded === "added") {
        setIsOpen(false);
        if (onUpdate) onUpdate(false);
        router.push(`/chat/${id}`);
      } else {
        throw new Error("Failed to add user to room");
      }
    } catch (error) {
      toast({
        title: "Access denied",
        description:
          error instanceof Error
            ? error.message
            : "Failed to Valide private key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const publicJoinRoomHandler = () => {
    setIsOpen(false);
    if (onUpdate) {
      onUpdate(false);
    }
    router.push(`/chat/${id}`);
  };

  if (isJoinedRoom) {
    return (
      <Link prefetch={false} href={`/chat/${id}`} className="w-full">
        <RoomCard
          onClickSidebarClose={onUpdate}
          name={name}
          description={description}
          id={id}
        />
      </Link>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <RoomCard name={name} id={id} description={description} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Join Room</DialogTitle>
          <DialogDescription>Do you want to join the room?</DialogDescription>
        </DialogHeader>
        <h1 className="text-lg mb-2">
          Room status:{" "}
          <span className="font-semibold">
            {isPrivate ? "Private" : "Public"}
          </span>
        </h1>
        {isPrivate && (
          <div className="flex flex-col sm:flex-row w-full justify-center">
            <h4 className="mb-1">Enter Private Code:</h4>
            <Input
              placeholder="Code"
              type="password"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPrivateCode(e.target.value);
              }}
              disabled={loading}
            />
          </div>
        )}
        <DialogFooter className="flex flex-row gap-3 items-center justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              if (isPrivate) {
                privateJoinRoomHandler();
              } else {
                publicJoinRoomHandler();
              }
            }}
            disabled={loading}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
