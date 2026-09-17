"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useLiveQuery } from "@tanstack/react-db"
import { createMessagesRealtimeCollection } from "@/collections/Messages/messages.realtime.collection.schema"
import { Header } from "@/components/Header"
import { ExpiryTimer } from "@/components/ExpiryTimer"

type ChatRoomProps = {
    roomId: number | string
    lastActivityAt: string | Date
}

const ROOM_INACTIVITY_LIMIT_MS = 10 * 60 * 1000
const getUsernameStorageKey = (roomId: number | string) => `otc_username_${roomId}`

export function Room({ roomId, lastActivityAt }: ChatRoomProps) {
    const router = useRouter()

    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [username, setUsername] = useState<string | null>(null)
    const [usernameChecked, setUsernameChecked] = useState(false)
    const [usernameInput, setUsernameInput] = useState("")

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

    const messagesCollection = useMemo(() => createMessagesRealtimeCollection(roomId), [roomId])

    const { data: messages = [], isLoading, isError } = useLiveQuery((query) =>
        query.from({ message: messagesCollection }).orderBy(({ message }) => message.createdAt, "asc"),
    )

    // --- Naye message pr sabse neeche auto-scroll ---
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages.length])

    // --- 10-min inactivity timer (pehle jaisa hi, koi change nahi) ---
    const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
        inactivityTimerRef.current = setTimeout(() => router.refresh(), ROOM_INACTIVITY_LIMIT_MS)
        return () => {
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
        }
    }, [messages.length, router])

    const sendMessage = async () => {
        const text = message.trim()
        if (!text || sending || !username) return
        setSending(true)
        try {
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, message_by: username, room: roomId }),
            })
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.errors?.[0]?.message || error.message || "Failed to send message")
            }
            setMessage("")
        } catch (error) {
            console.error(error)
        } finally {
            setSending(false)
        }
    }

    if (!usernameChecked) return null

    if (!username) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background p-6">
                <h2 className="text-lg font-semibold text-foreground">Enter your name to join</h2>
                <form onSubmit={handleUsernameSubmit} className="flex w-full max-w-sm gap-2">
                    <input
                        value={usernameInput}
                        onChange={(event) => setUsernameInput(event.target.value)}
                        placeholder="Your name"
                        autoFocus
                        className="flex-1 rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                        type="submit"
                        disabled={!usernameInput.trim()}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                    >
                        Join
                    </button>
                </form>
            </div>
        )
    }

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">Loading messages...</div>
    }

    if (isError) {
        return <div className="flex h-screen items-center justify-center text-sm text-destructive">Failed to load messages.</div>
    }

    return (
        // h-screen + overflow-hidden: header aur input apni jagah "chipke"
        // rehte hen, sirf beech wala messages area scroll hoga
        <div className="flex h-screen flex-col overflow-hidden bg-background">
            <Header
                rightSlot={<ExpiryTimer lastActivityAt={lastActivityAt} limitMs={ROOM_INACTIVITY_LIMIT_MS} />}
            />

            {/* Messages area — apne existing --primary/--accent tokens ka
                radial gradient, WhatsApp jaise wallpaper ka effect, image nahi */}
            <div
                className="flex-1 space-y-3 overflow-y-auto p-6"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at top left, var(--primary) 0%, transparent 45%), radial-gradient(circle at bottom right, var(--accent) 0%, transparent 50%)",
                    backgroundColor: "var(--background)",
                    backgroundBlendMode: "soft-light",
                }}
            >
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No messages yet. Say hello.
                    </div>
                ) : (
                    messages.map((item) => {
                        const isOwnMessage = item.messageBy === username

                        return (
                            <div key={item.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} py-`}>
                                <div
                                    className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${isOwnMessage
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-border bg-card text-card-foreground"
                                        }`}
                                >
                                    <p
                                        className={`text-xs font-medium ${isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                                            }`}
                                    >
                                        {item.messageBy}
                                    </p>

                                    <p className="mt-0.5 text-sm">{item.message}</p>

                                    <p
                                        className={`mt-1 text-[11px] ${isOwnMessage ? "text-right text-primary-foreground/60" : "text-left text-muted-foreground"
                                            }`}
                                    >
                                        {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}

                {/* Auto-scroll target */}
                <div ref={messagesEndRef} />
            </div>

            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    void sendMessage()
                }}
                className="flex gap-2 border-t border-border bg-background p-4"
            >
                <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                >
                    {sending ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
    )
}