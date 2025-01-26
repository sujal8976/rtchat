import { create } from "zustand";
import { JoinedRoomsResponse, UserJoinedRoom } from "../../types/room";
import { BASE_URL } from "../config/websocket";

interface JoinedRooms {
  joinedRooms: UserJoinedRoom[];
  loading: boolean;
  fetchJoinedRooms: () => Promise<void>;
  addJoinedRoom: (room: UserJoinedRoom) => void;
  removeJoinedRoom: (room: string) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useJoinedRoomsStore = create<JoinedRooms>((set, get) => ({
  joinedRooms: [],
  loading: false,

  fetchJoinedRooms: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${BASE_URL}/api/rooms/joinedRooms`, {
        method: "GET",
      });
      const data: JoinedRoomsResponse = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch rooms");
      }
      set({
        joinedRooms: data.rooms,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch joined rooms"
      );
    }
  },

  addJoinedRoom: (room) => {
    const currentRooms = get().joinedRooms;
    const exists = currentRooms.some((r) => r.room.id === room.room.id);
    if (!exists) {
      set({
        joinedRooms: [...currentRooms, room],
      });
    }
  },

  removeJoinedRoom: (roomId) => {
    set({
      joinedRooms: get().joinedRooms.filter((r) => r.room.id !== roomId),
    });
  },

  setLoading: (isLoading) => {
    set({ loading: isLoading });
  },
}));
