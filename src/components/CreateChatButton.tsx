"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateChatButton() {
    const router = useRouter()
    const [creating, setCreating] = useState(false)

    const handleCreate = async () => {
        setCreating(true)

        try {
            // Payload ka native create endpoint — koi custom API route nahi
            const response = await fetch("/api/rooms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}), // Rooms ki koi required field nahi, khali room ban jayega
            })

            if (!response.ok) {
                throw new Error("Failed to create chat")
            }

            const { doc } = await response.json()

            // Naya room ban gaya — seedha uske chat page pr le jate hen,
            // wahin username poocha jayega (Room component khud handle karta he)
            router.push(`/chat/${doc.id}`)
        } catch (error) {
            console.error(error)
            setCreating(false)
        }
    }

    return (
        <button
            onClick={handleCreate}
            disabled={creating}
            className="rounded-md bg-black px-6 py-3 text-white disabled:opacity-50"
        >
            {creating ? "Creating..." : "Create Chat"}
        </button>
    )
}