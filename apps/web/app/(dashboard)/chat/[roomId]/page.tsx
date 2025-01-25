import { ChatRoom } from "../../../../components/chat/chatRoom";
import { RoomNotFound } from "../../../../components/client utilities/roomNotFound";
import { getRoom } from "../../../../lib/actions/room/rooms";

interface Params {
  roomId: string;
}

export default async function ({ params }: { params: Params }) {
  try {
    const room = await getRoom(params.roomId);

    if (!room) {
      return <RoomNotFound />;
    }

    return <ChatRoom {...room} />;
  } catch (error) {
    if (error instanceof Error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-semibold text-red-500">
            {error.message === "ACCESS_DENIED"
              ? "Access Denied"
              : error.message}
          </h1>
          <p className="text-lg text-gray-600">
            {error.message === "ACCESS_DENIED" &&
              "You are not a member of this room. Please join this room first."}{" "}
          </p>
        </div>
      );
    }

    return <RoomNotFound />;
  }
}
