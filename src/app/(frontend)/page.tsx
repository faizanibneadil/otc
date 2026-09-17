import { CreateChatButton } from '@/components/CreateChatButton'

export default async function HomePage() {
  return (
    <div className="flex h-150 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">OTC — One Time Chat</h1>
      <CreateChatButton />
    </div>
  )
}