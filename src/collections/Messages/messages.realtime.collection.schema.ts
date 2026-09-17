import { createCollection } from "@tanstack/react-db"
import { electricCollectionOptions } from "@tanstack/electric-db-collection"
import { snakeCamelMapper } from "@electric-sql/client"

import type { Message } from "@/payload-types"

// Electric ka shape Payload ke document se thora alag he (raw columns,
// camelCase names), is lia hooba-hoo Message type use nahi ho sakta —
// lekin field types Payload ke generated Message type se hi le rahe hen
export type RealtimeMessage = {
    id: Message["id"]
    message: Message["message"]
    messageBy: Message["message_by"]
    roomId: Message["room"]
    createdAt: Message["createdAt"]
}

export const createMessagesRealtimeCollection = (
    roomId: number | string,
) => {
    return createCollection(electricCollectionOptions<RealtimeMessage>({
        id: `messages-room-${roomId}`,

        shapeOptions: {
            url: new URL(`/api/e/messages?roomId=${encodeURIComponent(roomId)}`, process.env.NEXT_PUBLIC_APP_URL!).toString(),
            columnMapper: snakeCamelMapper(),
        },

        getKey: (message) => message.id,
    }))
}