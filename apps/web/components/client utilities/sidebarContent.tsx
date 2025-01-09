"use client";

import { Input } from "@repo/ui/components/ui/input";
import { CreateRoom } from "./createRoom";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Room, JoinedRoomsResponse, SearchRoomsResponse, RoomWrapper } from "../../types/room";
import { useDebounce } from "../../hooks/useDebounce";
import { RoomCard } from "../cards/roomCard";
import { useToast } from "@repo/ui/hooks/use-toast";
import Loading from "../loading/loading";
import { BASE_URL } from "../../lib/config/websocket";

interface SidebarContentProps {
  onUpdate?: (value: boolean) => void;
}

export function SidebarContent({ onUpdate }: SidebarContentProps) {
  const [roomSearch, setRoomSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<RoomWrapper[]>([]);
  const { toast } = useToast();

  const debouncedSearch = useDebounce(roomSearch, 300);

  const getJoinedRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/api/rooms/joinedRooms`, {
        method: "GET"
      });

      const data: JoinedRoomsResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch rooms");
      }

      setJoinedRooms(data.rooms);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Room fetching failed",
          description: error.message || "Failed to fetch joined rooms",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const onChangeHeandler = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setRoomSearch(e.target.value);
  };

  const fetchRooms = useCallback(async () => {
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
    getJoinedRooms();
  }, [getJoinedRooms]);

  useEffect(() => {
    fetchRooms();
  }, [debouncedSearch]);

  return (
    <div className="pt-5 flex justify-center lg:border-r-2 lg:dark:border-r h-[calc(100svh-73px)]">
      <div className="flex flex-col gap-4 w-full max-w-[90%]">
        <CreateRoom />

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
                  <RoomCard
                    onClickSidebarClose={onUpdate}
                    name={room.name}
                    description={room.description}
                    id={room.id}
                    key={room.id}
                  />
                ))
              ) : (
                <>
                  <div className="dark:bg-slate-800 bg-gray-400 text-sm text-right rounded-lg mt-8 mb-3 pr-4 py-[6px]">
                    Joined Rooms
                  </div>
                  {joinedRooms && joinedRooms.length > 0 ? (
                    joinedRooms.map((room) => (
                      <RoomCard
                        onClickSidebarClose={onUpdate}
                        name={room.room.name}
                        description={room.room.description}
                        id={room.room.id}
                        key={room.room.id}
                      />
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
