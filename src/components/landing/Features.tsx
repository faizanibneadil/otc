import { Link2, MessageCircleOff, Zap } from "lucide-react"

export function Features() {
    return (
        <section id="features" className="mx-auto max-w-4xl px-6 py-20">
            <h2 className="max-w-md text-2xl font-semibold tracking-tight text-foreground">
                Built for conversations that don&apos;t need to stick around
            </h2>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div className="sm:col-span-2 rounded-2xl border border-border bg-card p-6">
                    <Link2 className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 text-base font-medium text-foreground">One link, instantly shareable</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create a room and get a link back right away. Send it to one person or a whole group —
                        anyone who opens it joins the same conversation, no invite step in between.
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                    <Zap className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 text-base font-medium text-foreground">No accounts, no setup</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Just a name and you&apos;re in. Nothing to remember, nothing to verify.
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6">
                    <MessageCircleOff className="h-5 w-5 text-primary" />
                    <h3 className="mt-3 text-base font-medium text-foreground">Closes itself</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ten minutes of silence and the link stops working. No one has to clean up after the conversation.
                    </p>
                </div>
            </div>
        </section>
    )
}