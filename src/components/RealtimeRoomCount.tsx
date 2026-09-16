'use client'

import { RoomsRealtimeCollectionSchema } from "@/collections/Rooms/rooms.realtime.collection.schema"
import { useLiveQuery } from "@tanstack/react-db"
import React from "react"

export const RealtimeRoomCount: React.FC = () => {
    const {
        data: rooms = [],
        isLoading,
        isError
    } = useLiveQuery(query => {
        return query.from({
            room: RoomsRealtimeCollectionSchema
        })
    })
    if (isLoading) {
        return (
            <span
                aria-label="Loading blog count"
                className="animate-pulse"
            >
                —
            </span>
        )
    }

    if (isError) {
        return (
            <span
                className="text-destructive"
                title="Unable to load live blog count"
            >
                Error
            </span>
        )
    }
    return <span aria-live="polite">
        {rooms.length}
    </span>
}