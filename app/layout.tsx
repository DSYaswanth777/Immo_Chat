// app/layout.tsx or app/layout.js

import type React from 'react'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300','400','500','600','700','800'],
  style: ['normal','italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Immochat - Valuta Casa su WhatsApp',
  description: 'Piattaforma per agenti immobiliari per valutazioni proprietà via WhatsApp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      {/* Move className to body to isolate possible mismatch */}
      <body className={openSans.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
