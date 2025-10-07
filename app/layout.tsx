import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import toast, { Toaster } from 'react-hot-toast';
import './globals.css'
import { RainbowProvider } from '@/context'


export const metadata: Metadata = {
  title: 'BTCStrategy-BTCSTR',
  description: 'Created with BTCSTR',
  generator: 'BTCSTR',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <RainbowProvider>
          {children}
        </RainbowProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
