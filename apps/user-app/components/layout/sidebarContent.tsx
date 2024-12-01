"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Plus } from "@repo/ui/icons";
import { useState } from "react";
import { DEMO_ROOMS } from "../../testData/room";
import { RoomCard } from "../card/roomCard";

export function SidebarContent() {
  const [roomSearch, setRoomSearch] = useState("");

  return (
    <div className="flex flex-col gap-4 w-[90%]">
      <Button className="">
        <Plus />
        <span>Create Room</span>
      </Button>

      <Input
        placeholder="Search rooms..."
        type="text"
        name="room"
        className="mt-2"
        onChange={(e) => {
          e.preventDefault();
          setRoomSearch(e.target.value);
        }}
      />

      <div className="h-[calc(100vh-200px)] overflow-hidden w-full">
        {" "}
        <ScrollArea className="h-full w-full">
          <div className="space-y-2">
            {roomSearch &&
              DEMO_ROOMS.map((room) => (
                <RoomCard
                  name={room.name}
                  description={room.description}
                  id={room.id}
                  key={room.id}
                />
              ))}
            {!roomSearch && (
              <div className="dark:bg-slate-800 text-sm text-right rounded-lg mt-8 pr-4 py-2">
                Joined Rooms
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
