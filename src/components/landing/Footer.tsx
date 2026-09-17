export function Footer() {
    return (
        <footer className="border-t border-border px-6 py-8">
            <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-foreground">OTC</span>
                    <span className="text-xs text-muted-foreground">One Time Chat</span>
                </div>

                <p className="text-xs text-muted-foreground">A DevSlix product</p>
            </div>
        </footer>
    )
}