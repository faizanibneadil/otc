import { createCollection } from "@tanstack/react-db"
import { electricCollectionOptions } from "@tanstack/electric-db-collection"
import { snakeCamelMapper } from "@electric-sql/client"

export type RealtimeMessage = {
    id: number | string
    message: string
    messageById: number | string
    roomId: number | string
    createdAt: Date
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