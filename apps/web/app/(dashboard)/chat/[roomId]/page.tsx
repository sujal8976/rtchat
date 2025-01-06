import { ChatRoom } from "../../../../components/chat/chatRoom";
import { RoomNotFound } from "../../../../components/client utilities/roomNotFound";
import { getRoom } from "../../../../lib/actions/room/rooms";

interface Params {
  roomId: string;
}

export default async function ({ params }: { params: Params }) {
  const room = await getRoom(params.roomId);

  if (!room) {
    return <RoomNotFound />;
  }

  return <ChatRoom {...room} />;
}
