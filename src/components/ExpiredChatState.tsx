"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type ExpiredChatStateProps = {
    reason: "expired" | "not-found"
}

export function ExpiredChatState({ reason }: ExpiredChatStateProps) {
    const router = useRouter()
    const [creating, setCreating] = useState(false)

    const handleCreateNew = async () => {
        setCreating(true)
        try {
            const response = await fetch("/api/rooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            })
            if (!response.ok) throw new Error("Failed to create chat")
            const { doc } = await response.json()
            router.push(`/chat/${doc.id}`)
        } catch (error) {
            console.error(error)
            setCreating(false)
        }
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
            {/* "Signal fading out" animation — chat band ho chuki he ka visual */}
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                <circle cx="36" cy="36" r="30" className="stroke-muted-foreground/30" strokeWidth="2" />
                <circle
                    cx="36"
                    cy="36"
                    r="30"
                    className="origin-center animate-ping stroke-primary/50"
                    strokeWidth="2"
                    fill="none"
                />
                <circle cx="36" cy="36" r="6" className="fill-muted-foreground/50" />
            </svg>

            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-foreground">
                    {reason === "expired" ? "This chat has expired" : "This chat does not exist"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {reason === "expired"
                        ? "It closed after 10 minutes with no new messages."
                        : "Check the link, or start a new one."}
                </p>
            </div>

            <button
                onClick={handleCreateNew}
                disabled={creating}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
                {creating ? "Creating..." : "Create a new chat"}
            </button>
        </div>
    )
}