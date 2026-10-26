import type { Metadata } from 'next'
import { Newsreader, Schibsted_Grotesk } from 'next/font/google'
import { SessionProvider } from '@/hooks/useSession'
import './globals.css'

const schibsted = Schibsted_Grotesk({
  variable: '--font-schibsted',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Nexo Assist',
  description: 'Service desk de TI da Nexo',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${schibsted.variable} ${newsreader.variable}`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
