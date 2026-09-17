"use client"

import { useEffect, useState } from "react"

type ExpiryTimerProps = {
    lastActivityAt: string | Date
    limitMs: number
}

// Itna time bachne pr color "expiring soon" (ember) ho jayega
const LOW_TIME_THRESHOLD_MS = 2 * 60 * 1000

export function ExpiryTimer({ lastActivityAt, limitMs }: ExpiryTimerProps) {
    const [remainingMs, setRemainingMs] = useState(() => {
        const elapsed = Date.now() - new Date(lastActivityAt).getTime()
        return Math.max(limitMs - elapsed, 0)
    })

    // Ye sirf DISPLAY ke liye har second update hota he — asal expiry
    // decision Room.tsx ke router.refresh() + server-side check se hoti he,
    // ye timer sirf user ko waqt dikhata he
    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = Date.now() - new Date(lastActivityAt).getTime()
            setRemainingMs(Math.max(limitMs - elapsed, 0))
        }, 1000)

        return () => clearInterval(interval)
    }, [lastActivityAt, limitMs])

    const totalSeconds = Math.floor(remainingMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const isLowTime = remainingMs <= LOW_TIME_THRESHOLD_MS

    return (
        <div
            className="flex items-center gap-2"
            title="This chat closes automatically after 10 minutes with no new messages"
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${isLowTime ? "bg-ember" : "bg-live"}`}
                aria-hidden="true"
            />

            <span
                className={`font-mono text-sm tabular-nums ${isLowTime ? "text-ember" : "text-muted-foreground"}`}
            >
                {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
        </div>
    )
}