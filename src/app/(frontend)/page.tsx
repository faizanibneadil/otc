import Link from 'next/link'
import { CreateChatButton } from '@/components/CreateChatButton'
import { Header } from '@/components/Header'
import { HeroPreview } from '@/components/landing/HeroPreview'
import { Features } from '@/components/landing/Features'
import { UseCases } from '@/components/landing/UseCases'
import { Footer } from '@/components/landing/Footer'

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        nav={
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <Link href="#features" className="hover:text-foreground">Features</Link>
            <Link href="#use-cases" className="hover:text-foreground">Use Cases</Link>
          </nav>
        }
        rightSlot={<CreateChatButton />}
      />

      <section className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-10 px-6 py-16 sm:grid-cols-2">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Start a chat that disappears
          </h1>
          <p className="max-w-sm text-base text-muted-foreground">
            Create a link, share it with anyone, and talk. No sign-up on either end,
            and the room closes itself after ten minutes of silence.
          </p>
          <CreateChatButton />
        </div>

        <div className="flex justify-center sm:justify-end">
          <HeroPreview />
        </div>
      </section>

      <Features />
      <UseCases />
      <Footer />
    </div>
  )
}