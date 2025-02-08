"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Camera, ChevronDown, Plus, Users, X } from "@repo/ui/icons";
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
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { useJoinedRoomsStore } from "../../lib/store/joinedRooms";
import { Room } from "../../types/room";
import { getSignedURL } from "../../lib/s3/getSignedUrl";
import { computeSHA256 } from "../../lib/utils/sha";

interface RequestDataType {
  roomName: string;
  description: string;
  code: string | null;
  image: string | null;
}

interface CreateRoomProps {
  onUpdate?: (value: boolean) => void;
}

export function CreateRoom({ onUpdate }: CreateRoomProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const addJoinedRoom = useJoinedRoomsStore().addJoinedRoom;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Image should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: RequestDataType = {
      roomName: formData.get("roomName") as string,
      description: formData.get("description") as string,
      code: formData.get("code") as string,
      image: null,
    };

    if (!data.roomName || !data.description || (isPrivate && !data.code)) {
      toast({
        title: "Room validation Error",
        description: "Provide all fields",
        variant: "destructive",
      });
      return setLoading(false);
    }
    try {
      if (selectedImage) {
        try {
          const signedUrl = await getSignedURL(
            selectedImage.type,
            await computeSHA256(selectedImage)
          );

          const url = signedUrl.success.url;

          const response = await fetch(url, {
            method: "PUT",
            body: selectedImage,
            headers: {
              "Content-Type": selectedImage.type,
            },
          });

          if (!response.ok) {
            toast({
              title: "Something went wrong",
              description: "Failed to upload Profile picture.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }

          data.image = url.split("?")[0] as string;
        } catch (error) {
          toast({
            title: "Something went wrong",
            description: "Failed to upload Profile picture.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      const res = await createRoom(
        data.roomName,
        data.description,
        isPrivate,
        data.code,
        data.image
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
          roomImage: data.image,
        };
        addJoinedRoom({ room: newRoom });

        if (onUpdate) onUpdate(false);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedImage(null);
        setPreviewUrl(null);
        router.push(`/chat/${res.roomId}`);
      } else if (res.error) {
        toast({
          title: res.error.code,
          description: res.error.message,
          variant: "destructive",
        });
      }
      setLoading(false);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Failed to create room",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(null);
    setPreviewUrl(null);
    const fileInput = document.querySelector(
      '#image'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
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
        <DialogTitle className="w-full text-center">
          Create New Room
        </DialogTitle>
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-4 flex flex-col items-center"
        >
          <div className="w-full sm:max-w-[70%] flex flex-col gap-2">
            <div className="mb-4 flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                  {previewUrl ? (
                   <> <img id="image"
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                    <div 
                    onClick={handleRemoveImage}
                    className="absolute p-1 top-3 right-0 bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                    <X size={16} className="text-white" />
                    </div></>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Users size={40} />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 cursor-pointer">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Camera size={16} className="text-white" />
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

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
                  <Button variant="outline" className="px-6">
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
