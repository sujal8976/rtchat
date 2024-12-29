"use client";

import { Input } from "@repo/ui/components/ui/input";
import { CreateRoom } from "./createRoom";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Room, UserJoinedRoom } from "../../types/room";
import { useDebounce } from "../../hooks/useDebounce";
import { fetchJoinedRooms, getRooms } from "../../lib/actions/room/rooms";
import { RoomCard } from "../cards/roomCard";

export function SidebarContent() {
  const [roomSearch, setRoomSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<UserJoinedRoom[]>([]);

  const debouncedSearch = useDebounce(roomSearch, 300);

  const getJoinedRooms = useCallback(async () => {
    try {
      const rooms = await fetchJoinedRooms();
      setJoinedRooms(rooms as UserJoinedRoom[]);
    } catch (error) {
      setError("Failed to fetch joined rooms");
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
        const rooms = (await getRooms(debouncedSearch)) as Room[];
        setRooms(rooms);
        setError("");
      } catch (err) {
        setError("Failed to fetch rooms");
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
    <div className="pt-5 flex justify-center lg:border-r-2 lg:dark:border-r h-[90vh]">
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

        {/* <ScrollArea className="flex-1 px-2"> */}
          <div className="flex-1 px-2 overflow-y-scroll">
            <div className="space-y-2 p-2">
              {roomSearch ? (
                rooms.map((room) => (
                  <RoomCard
                    name={room.name}
                    description={room.description}
                    id={room.id}
                    key={room.id}
                  />
                ))
              ) : (
                <>
                  <div className="dark:bg-slate-800 text-sm text-right rounded-lg mt-8 mb-3 pr-4 py-[6px]">
                    Joined Rooms
                  </div>
                  {joinedRooms &&
                    joinedRooms.map((room) => (
                      <RoomCard
                        name={room.room.name}
                        description={room.room.description}
                        id={room.room.id}
                        key={room.room.id}
                      />
                    ))}
                </>
              )}
            </div>
          </div>
        {/* </ScrollArea> */}
      </div>
    </div>
  );
}
