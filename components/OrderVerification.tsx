'use client'

import { useState } from 'react'
import { CheckCircle, Loader2, Mail, Hash } from 'lucide-react'

interface OrderVerificationProps {
  onVerified: (data: {
    email: string
    orderId: string
    displayOrderId: string
    maskedEmail: string
  }) => void
}

export default function OrderVerification({ onVerified }: OrderVerificationProps) {
  const [email, setEmail] = useState('')
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)
  const [verifiedInfo, setVerifiedInfo] = useState<{
    maskedEmail: string
    displayOrderId: string
  } | null>(null)

  const handleVerify = async () => {
    if (!email.trim() || !orderId.trim()) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/verify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          orderId: orderId.trim(),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Verification failed. Please try again.')
        return
      }

      setVerified(true)
      setVerifiedInfo({
        maskedEmail: data.maskedEmail,
        displayOrderId: data.displayOrderId,
      })
      onVerified({
        email: email.trim(),
        orderId: data.orderId,
        displayOrderId: data.displayOrderId,
        maskedEmail: data.maskedEmail,
      })
    } catch {
      setError(
        'We couldn\'t connect. Please check your internet connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleVerify()
  }

  if (verified && verifiedInfo) {
    return (
      <div className="fade-in-up">
        <div className="flex items-center gap-4 p-5 bg-gold/5 rounded-card border border-gold/25">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p
              className="text-dark font-medium text-sm"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              Order confirmed
            </p>
            <p
              className="text-muted text-xs mt-0.5"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              {verifiedInfo.displayOrderId} · {verifiedInfo.maskedEmail}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <p
        className="text-sm text-muted leading-relaxed"
        style={{ fontFamily: 'Jost, sans-serif' }}
      >
        Enter the email you used when placing your order, along with your
        order number. You'll find both in your confirmation email from PELLI.
      </p>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label
            className="block text-xs font-medium text-dark mb-1.5 uppercase tracking-wide"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3.5 rounded-card border border-border bg-white text-dark
                placeholder:text-muted focus:border-gold transition-colors text-sm"
              style={{ fontFamily: 'Jost, sans-serif' }}
            />
          </div>
        </div>

        {/* Order ID */}
        <div>
          <label
            className="block text-xs font-medium text-dark mb-1.5 uppercase tracking-wide"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Order Number
          </label>
          <div className="relative">
            <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="1234 or #1234"
              className="w-full pl-10 pr-4 py-3.5 rounded-card border border-border bg-white text-dark
                placeholder:text-muted focus:border-gold transition-colors text-sm"
              style={{ fontFamily: 'Jost, sans-serif' }}
            />
          </div>
          <p
            className="mt-1.5 text-xs text-muted"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Found in your order confirmation email.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-orange/5 border border-orange/20 rounded-card p-4 fade-in">
          <p
            className="text-orange text-sm"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            {error}
          </p>
        </div>
      )}

      {/* Button */}
      <button
        onClick={handleVerify}
        disabled={loading || !email.trim() || !orderId.trim()}
        className="w-full bg-gold text-dark rounded-pill py-4 text-sm font-medium
          flex items-center justify-center gap-2
          hover:bg-gold/90 active:scale-[0.99]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200"
        style={{ fontFamily: 'Jost, sans-serif' }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Confirming...
          </>
        ) : (
          'Confirm Order'
        )}
      </button>
    </div>
  )
}
