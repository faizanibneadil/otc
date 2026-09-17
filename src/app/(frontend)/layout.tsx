import React from 'react'
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import '@/styles/globals.css'

// Headings/body ke liye humanist sans
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

// Sirf timer ke digits ke liye — tabular figures taake
// countdown change hote waqt layout jitter na kre
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata = {
  title: 'OTC — One Time Chat',
  description: 'Create a chat link that disappears. No sign-up, no history, no trace.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}