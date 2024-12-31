import { ChatRoom } from "../../../../components/chat/chatRoom";
import { getRoom } from "../../../../lib/actions/room/rooms";

interface Params {
  roomId: string;
}

export default async function ({ params }: { params: Params }) {
  const room = await getRoom(params.roomId);

  if (!room) {
    return <div>Room not found</div>;
  }

  return <ChatRoom {...room} />;
}
