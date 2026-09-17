"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useLiveQuery } from "@tanstack/react-db"
import { createMessagesRealtimeCollection } from "@/collections/Messages/messages.realtime.collection.schema"

type ChatRoomProps = {
    roomId: number | string
}

// Room 10 min tak koi bhi naya message na aye to expire ho jata he
const ROOM_INACTIVITY_LIMIT_MS = 10 * 60 * 1000

// Har room ka username localStorage me alag rakha jata he,
// taake ek hi banda alag alag chats me alag naam use kr sake
const getUsernameStorageKey = (roomId: number | string) => `otc_username_${roomId}`

export function Room({
    roomId,
}: ChatRoomProps) {
    const router = useRouter()

    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)

    // Username flow: shuru me "null" (abhi pata nahi), phir localStorage
    // check hone k baad ya to saved username mil jayega ya khali form dikhega
    const [username, setUsername] = useState<string | null>(null)
    const [usernameChecked, setUsernameChecked] = useState(false)
    const [usernameInput, setUsernameInput] = useState("")

    // Component mount hote hi localStorage check kr lete hen —
    // agar pehle se naam save he to dobara nahi poochna
    useEffect(() => {
        const savedUsername = window.localStorage.getItem(getUsernameStorageKey(roomId))
        setUsername(savedUsername)
        setUsernameChecked(true)
    }, [roomId])

    const handleUsernameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const trimmedName = usernameInput.trim()
        if (!trimmedName) return

        window.localStorage.setItem(getUsernameStorageKey(roomId), trimmedName)
        setUsername(trimmedName)
    }

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

    // --- 10-min inactivity timer (pura client-side, koi cron/job nahi) ---
    //
    // Flow: har baar jab "messages" array change ho (matlab naya message
    // aya, realtime subscription k zariye), timer reset ho jata he.
    // Agar 10 min tak koi naya message na aye, to timer fire ho k
    // router.refresh() call karega. Us waqt server-side (page component)
    // latest message ka createdAt check kre ga aur decide kre ga k
    // chat expired dikhani he ya normal UI.
    const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        // Pichla timer clear kr k naya start karna he — reset ka yehi tarika he
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current)
        }

        inactivityTimerRef.current = setTimeout(() => {
            router.refresh()
        }, ROOM_INACTIVITY_LIMIT_MS)

        // Component unmount ya dependency change hone pr purana timer saaf kr dein
        return () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current)
            }
        }
        // messages.length dependency he taake har naye message pr timer reset ho
    }, [messages.length, router])

    const sendMessage = async () => {
        const text = message.trim()

        if (!text || sending || !username) return

        setSending(true)

        try {
            // Payload ka apna auto-generated create endpoint use kr rahe hen —
            // koi custom API route nahi likhi, Payload khud validation aur
            // access control handle karta he
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: text,
                    message_by: username,
                    room: roomId,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(
                    error.errors?.[0]?.message || error.message || "Failed to send message",
                )
            }

            setMessage("")
        } catch (error) {
            console.error(error)
        } finally {
            setSending(false)
        }
    }

    // Username abhi tak localStorage se load nahi hua — kuch bhi render na karein
    // (taake "no username" form aur "chat UI" ke beech flash na ho)
    if (!usernameChecked) {
        return null
    }

    // Username nahi mila — pehle wo capture karna he, chat UI baad me
    if (!username) {
        return (
            <div className="flex h-[600px] flex-col items-center justify-center gap-4 rounded-lg border p-6">
                <h2 className="text-lg font-semibold">
                    Enter your name to join
                </h2>

                <form
                    onSubmit={handleUsernameSubmit}
                    className="flex w-full max-w-sm gap-2"
                >
                    <input
                        value={usernameInput}
                        onChange={(event) => setUsernameInput(event.target.value)}
                        placeholder="Your name"
                        autoFocus
                        className="flex-1 rounded-md border px-3 py-2"
                    />

                    <button
                        type="submit"
                        disabled={!usernameInput.trim()}
                        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        Join
                    </button>
                </form>
            </div>
        )
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
                                User: {item.messageBy}
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
                className="flex gap-2 p-4 pt-0"
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