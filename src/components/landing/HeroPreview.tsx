"use client"

import { useEffect, useState } from "react"

// Ye sirf landing page ke liye illustration he — real data nahi,
// countdown ek loop me demo ke tor pr tick karta rehta he
const DEMO_START_SECONDS = 9 * 60 + 47

export function HeroPreview() {
    const [secondsLeft, setSecondsLeft] = useState(DEMO_START_SECONDS)

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((current) => (current <= 0 ? DEMO_START_SECONDS : current - 1))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    const isLowTime = secondsLeft <= 120

    return (
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-foreground">OTC</span>
                    <span className="text-xs text-muted-foreground">One Time Chat</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${isLowTime ? "bg-destructive" : "bg-primary"}`}
                    />
                    <span
                        className={`font-mono text-xs tabular-nums ${isLowTime ? "text-destructive" : "text-muted-foreground"}`}
                    >
                        {minutes}:{seconds.toString().padStart(2, "0")}
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-start">
                    <div className="max-w-[75%] rounded-2xl border border-border bg-background px-3 py-1.5">
                        <p className="text-[11px] font-medium text-muted-foreground">Sara</p>
                        <p className="text-xs text-foreground">Send me the link when you&apos;re ready</p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="max-w-[75%] rounded-2xl bg-primary px-3 py-1.5 text-primary-foreground">
                        <p className="text-[11px] font-medium text-primary-foreground/70">You</p>
                        <p className="text-xs">Sent — no login needed on your end</p>
                    </div>
                </div>
            </div>
        </div>
    )
}