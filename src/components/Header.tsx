import Link from "next/link"

type HeaderProps = {
    nav?: React.ReactNode
    rightSlot?: React.ReactNode
}

export function Header({ nav, rightSlot }: HeaderProps) {
    return (
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <Link href="/" className="flex items-baseline gap-2">
                <span className="text-lg font-semibold tracking-tight text-foreground">OTC</span>
                <span className="text-sm text-muted-foreground">One Time Chat</span>
            </Link>

            {nav}
            {rightSlot}
        </header>
    )
}