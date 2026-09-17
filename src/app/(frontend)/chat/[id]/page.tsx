import { getPayload } from "payload"
import config from "@payload-config"
import { Room } from "@/components/Room"

const ROOM_INACTIVITY_LIMIT_MS = 10 * 60 * 1000

type ChatPageProps = {
    params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
    const { id } = await params
    const payload = await getPayload({ config })

    // Room exist karta he ya nahi, pehle confirm kr lein
    const room = await payload.findByID({
        collection: "rooms",
        id,
        depth: 0,
    }).catch(() => null)

    if (!room) {
        return (
            <div className="flex h-150 items-center justify-center">
                <p className="text-sm text-muted-foreground">This chat does not exist.</p>
            </div>
        )
    }

    // "Last activity" = agar koi message he to uska createdAt,
    // warna room khud kab bana tha (naya room, abhi tak koi message nahi)
    const latestMessage = await payload.find({
        collection: "messages",
        where: {
            room: { equals: id },
        },
        sort: "-createdAt",
        limit: 1,
        depth: 0,
    })

    const lastActivityAt = latestMessage.docs[0]?.createdAt ?? room.createdAt
    const isExpired =
        Date.now() - new Date(lastActivityAt).getTime() >= ROOM_INACTIVITY_LIMIT_MS

    if (isExpired) {
        return (
            <div className="flex h-150 items-center justify-center">
                <p className="text-sm text-muted-foreground">This chat link has expired.</p>
            </div>
        )
    }

    return <Room roomId={room.id} />
}