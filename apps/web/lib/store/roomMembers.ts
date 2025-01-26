import { create } from "zustand";
import { ChatUser } from "../../types/chat";

interface RoomMembersStore {
  roomMembers: ChatUser[];
  adminUserId: string | null;
  setRoomMembers: (users: ChatUser[], adminUserId: string | null) => void;
  addRoomMember: (username: string) => void;
  removeRoomMember: (username: string) => void;
  setOnlineRoomMember: (username: string) => void;
  setOfflineRoomMember: (username: string) => void;
}

export const useRoomMembersStore = create<RoomMembersStore>((set, get) => ({
  roomMembers: [],
  adminUserId: null,

  setRoomMembers: (users, adminUserId) => {
    set(() => ({
      roomMembers: [...users],
      adminUserId
    }));
  },

  addRoomMember: (username) => {
    set((state) => {
      if (!state.roomMembers.find((member) => member.username === username)) {
        return {
          roomMembers: [
            ...state.roomMembers,
            {
              username,
              id: `temp-${username}`,
              isOnline: true,
            },
          ],
        };
      }
      return state;
    });
  },

  removeRoomMember: (username) => {
    set((state) => ({
      roomMembers: state.roomMembers.filter(
        (member) => member.username !== username
      ),
    }));
  },

  setOnlineRoomMember: (username) => {
    set((state) => ({
      roomMembers: state.roomMembers.map((member) =>
        member.username === username ? { ...member, isOnline: true } : member
      ),
    }));
  },

  setOfflineRoomMember: (username) => {
    set((state) => ({
      roomMembers: state.roomMembers.map((member) =>
        member.username === username ? { ...member, isOnline: false } : member
      ),
    }));
  },
}));
