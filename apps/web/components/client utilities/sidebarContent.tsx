"use client";

import { Input } from "@repo/ui/components/ui/input";
import { CreateRoom } from "./createRoom";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Room, SearchRoomsResponse } from "../../types/room";
import { useDebounce } from "../../hooks/useDebounce";
import { RoomCard } from "../cards/roomCard";
import { useToast } from "@repo/ui/hooks/use-toast";
import Loading from "../loading/loading";
import { BASE_URL } from "../../lib/config/websocket";
import Link from "next/link";
import { SearchedRoomCard } from "../cards/searchedRoomCard";
import { useJoinedRoomsStore } from "../../lib/store/joinedRooms";

interface SidebarContentProps {
  onUpdate?: (value: boolean) => void;
}

export function SidebarContent({ onUpdate }: SidebarContentProps) {
  const { joinedRooms, loading, fetchJoinedRooms, setLoading } =
    useJoinedRoomsStore();
  const [roomSearch, setRoomSearch] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();

  const debouncedSearch = useDebounce(roomSearch, 300);

  const onChangeHeandler = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setRoomSearch(e.target.value);
  };

  const fetchSearchRooms = useCallback(async () => {
    if (debouncedSearch.length > 1) {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/api/rooms/searchRooms?query=${debouncedSearch}`
        );
        const data: SearchRoomsResponse = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch rooms");
        }
        setRooms(data.rooms);
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Room fetching failed",
            description: error.message || "Failed to fetch joined rooms",
            variant: "destructive",
          });
        }
        setRooms([]);
      } finally {
        setLoading(false);
      }
    } else {
      setRooms([]);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const getJoinedRooms = async () => {
      try {
        await fetchJoinedRooms();
      } catch (error) {
        toast({
          title: "Room fetching failed",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch joined rooms",
          variant: "destructive",
        });
      }
    };

    getJoinedRooms();
  }, []);

  useEffect(() => {
    fetchSearchRooms();
  }, [debouncedSearch]);

  return (
    <div className="pt-5 flex justify-center lg:border-r-2 lg:dark:border-r h-[calc(100svh-73px)]">
      <div className="flex flex-col gap-4 w-full max-w-[90%]">
        <CreateRoom onUpdate={onUpdate} />

        <Input
          placeholder="Search rooms..."
          type="text"
          name="room"
          className="mt-2"
          onChange={(e) => {
            onChangeHeandler(e);
          }}
        />

        {loading ? (
          <div className="w-full h-[40vh] flex justify-center items-center">
            <Loading text="Loading Rooms..." />
          </div>
        ) : (
          <div className="flex-1 px-2 overflow-y-scroll">
            <div className="space-y-2 p-2">
              {roomSearch ? (
                rooms.map((room) => (
                  <SearchedRoomCard
                    roomImage={room.roomImage}
                    name={room.name}
                    description={room.description}
                    id={room.id}
                    key={room.id}
                    isPrivate={room.isPrivate}
                    isJoinedRoom={joinedRooms.some(
                      (joinedRoom) => joinedRoom.room.id === room.id
                    )}
                    onUpdate={onUpdate}
                  />
                ))
              ) : (
                <>
                  <div className="dark:bg-slate-800 bg-gray-400 text-sm text-right rounded-lg mt-8 mb-3 pr-4 py-[6px]">
                    Joined Rooms
                  </div>
                  {joinedRooms && joinedRooms.length > 0 ? (
                    joinedRooms.map((room) => (
                      <Link
                        prefetch={false}
                        href={`/chat/${room.room.id}`}
                        className="w-full"
                        key={room.room.id}
                      >
                        <RoomCard
                          roomImage={room.room.roomImage}
                          onClickSidebarClose={onUpdate}
                          name={room.room.name}
                          description={room.room.description}
                        />
                      </Link>
                    ))
                  ) : (
                    <>
                      <div className="w-full h-[40vh] flex flex-col justify-center items-center">
                        <div className="text-5xl text-red-400">!</div>
                        <div>
                          Start joining rooms that interest you and connect with
                          like-minded people!
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
