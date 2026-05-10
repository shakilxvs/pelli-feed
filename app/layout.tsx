import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Share Your Experience — PELLI',
  description: 'Share your honest feedback about your PELLI Shoes purchase.',
  icons: {
    icon: 'https://cdn.shopify.com/s/files/1/0685/4859/1755/files/logo_brown.png?v=1749682575',
    apple: 'https://cdn.shopify.com/s/files/1/0685/4859/1755/files/logo_brown.png?v=1749682575',
  },
  openGraph: {
    title: 'Share Your Experience — PELLI',
    description: 'Share your honest feedback about your PELLI Shoes purchase.',
    siteName: 'PELLI Shoes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
