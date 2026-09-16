import { createCollection } from "@tanstack/react-db"
import { electricCollectionOptions } from "@tanstack/electric-db-collection"
import { Room } from "@/payload-types"


export const RoomsRealtimeCollectionSchema = createCollection(electricCollectionOptions<Pick<Room, "id">>({
    id: "blogs-live-count",
    shapeOptions: {
        url: new URL('/api?table=rooms&columns=id', process.env.NEXT_PUBLIC_APP_URL!).toString(),
        // subsetMethod: "POST"
    },
    getKey: room => room.id
}))