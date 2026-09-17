const useCases = [
    {
        title: "Quick support handoff",
        description: "Drop a customer straight into a live conversation without asking them to sign up first.",
    },
    {
        title: "Anonymous feedback",
        description: "Let someone speak freely without a named account attached to what they say.",
    },
    {
        title: "One-off coordination",
        description: "Sort out a plan with someone you'll likely never message again after today.",
    },
    {
        title: "Pairing on something quickly",
        description: "Share a link in a call or a doc, talk it through, and let the room close on its own.",
    },
]

export function UseCases() {
    return (
        <section id="use-cases" className="border-t border-border bg-secondary/40">
            <div className="mx-auto max-w-4xl px-6 py-20">
                <h2 className="max-w-md text-2xl font-semibold tracking-tight text-foreground">
                    Where a temporary chat works better than a permanent one
                </h2>

                <dl className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
                    {useCases.map((useCase) => (
                        <div key={useCase.title}>
                            <dt className="text-base font-medium text-foreground">{useCase.title}</dt>
                            <dd className="mt-1 text-sm text-muted-foreground">{useCase.description}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}