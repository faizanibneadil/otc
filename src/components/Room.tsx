"use client"

import { useMemo, useState } from "react"
import { useLiveQuery } from "@tanstack/react-db"
import { createMessagesRealtimeCollection } from "@/collections/Messages/messages.realtime.collection.schema"

type ChatRoomProps = {
    roomId: number | string
}

export function Room({
    roomId,
}: ChatRoomProps) {
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)

    const messagesCollection = useMemo(
        () => createMessagesRealtimeCollection(roomId),
        [roomId],
    )

    const {
        data: messages = [],
        isLoading,
        isError,
    } = useLiveQuery((query) =>
        query
            .from({
                message: messagesCollection,
            })
            .orderBy(
                ({ message }) => message.createdAt,
                "asc",
            ),
    )

    const sendMessage = async () => {
        const text = message.trim()

        if (!text || sending) return

        setSending(true)

        try {
            const response = await fetch("/api/chat/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    roomId,
                    messageBy: 1, // temporary, auth ke baad current user
                    message: text,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Failed to send message")
            }

            setMessage("")
        } catch (error) {
            console.error(error)
        } finally {
            setSending(false)
        }
    }

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault()
        await sendMessage()
    }

    if (isLoading) {
        return (
            <div className="p-6">
                Loading messages...
            </div>
        )
    }

    if (isError) {
        return (
            <div className="p-6 text-destructive">
                Failed to load messages.
            </div>
        )
    }

    return (
        <div className="flex h-[600px] flex-col rounded-lg border">
            <div className="border-b p-4">
                <h2 className="font-semibold">
                    Chat Room
                </h2>

                <p className="text-sm text-muted-foreground">
                    Room: {roomId}
                </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No messages yet.
                    </div>
                ) : (
                    messages.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-lg border p-3"
                        >
                            <p>{item.message}</p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                User: {item.messageById}
                            </p>
                        </div>
                    ))
                )}
            </div>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    void sendMessage()
                }}
                className="flex gap-2"
            >
                <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-md border px-3 py-2"
                />

                <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                    {sending ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    )
}