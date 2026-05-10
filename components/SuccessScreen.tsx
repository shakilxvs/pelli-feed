'use client'

import { CheckCircle, ArrowUpRight } from 'lucide-react'

interface SuccessScreenProps {
  firstName: string
}

export default function SuccessScreen({ firstName }: SuccessScreenProps) {
  return (
    <div className="fade-in-up">
      <div className="bg-white rounded-card-lg border border-border p-10 sm:p-14 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-7">
          <CheckCircle className="w-10 h-10 text-gold" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <h2
          className="text-4xl sm:text-5xl text-dark mb-5 leading-tight"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 300,
          }}
        >
          Thank you,<br />
          <span style={{ fontStyle: 'italic' }}>{firstName}!</span>
        </h2>

        {/* Body */}
        <p
          className="text-muted leading-relaxed max-w-sm mx-auto mb-10"
          style={{ fontFamily: 'Jost, sans-serif', fontSize: '15px' }}
        >
          Your feedback has been received.{' '}
          <span className="text-body">
            We read every single response — it means a lot to us.
          </span>
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-border mx-auto mb-10" />

        {/* CTA */}
        <a
          href="https://pellishoes.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gold text-dark rounded-pill px-8 py-3.5 text-sm font-medium
            hover:bg-gold/90 transition-colors active:scale-[0.99]"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          Back to PELLI Shoes
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
