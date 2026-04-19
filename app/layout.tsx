import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'

// Font serif untuk heading — memberikan kesan akademik yang sesuai untuk IELTS
const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
})

// Font sans-serif untuk body — mudah dibaca di layar untuk sesi latihan panjang
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Jalin — Jago Lingo',
  description: 'Platform latihan IELTS Academic Writing dengan penilaian AI yang mendetail.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${dmSerifDisplay.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
