import { cn } from "@repo/ui/lib/utils";
import { Message, User } from "../../testData/chat"
import {Check, CheckCheck} from "@repo/ui/icons"

interface MessageBubbleProps {
    message: Message;
    user: User;
    isCurrentUser: boolean
}

const statusIcons = {
    send: <Check className="h-3 w-3" />,
    delivered: <CheckCheck className="h-3 w-3" />,
    read: <CheckCheck className="h-3 w-3 text-blue-50" />
}

export function MessageBubble({message, user, isCurrentUser }: MessageBubbleProps){
    return (
        <div 
        className={cn()}
        >

        </div>
    )
}