'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ThumbsUp,
  AlertCircle,
  Wrench,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import StarRating from './StarRating'
import { Product } from '@/lib/shopify'

interface FeedbackFormProps {
  product: Product
  selectedSize: string | null
  selectedColor: string | null
  orderData: {
    email: string
    orderId: string
    displayOrderId: string
    maskedEmail: string
  }
  onSuccess: (firstName: string) => void
}

interface TextareaField {
  key: string
  icon: React.ElementType
  label: string
  required: boolean
  placeholder: string
}

const FIELDS: TextareaField[] = [
  {
    key: 'whatLoved',
    icon: ThumbsUp,
    label: 'What did you love about this product?',
    required: false,
    placeholder: 'Share what stood out to you...',
  },
  {
    key: 'whatBetter',
    icon: AlertCircle,
    label: 'What could be better?',
    required: false,
    placeholder: 'Any issues or things you\'d improve...',
  },
  {
    key: 'whatImprove',
    icon: Wrench,
    label: 'What should we work on?',
    required: false,
    placeholder: 'Feature requests or suggestions...',
  },
  {
    key: 'fullComment',
    icon: MessageSquare,
    label: 'Your full comment or report',
    required: true,
    placeholder: 'Tell us about your overall experience...',
  },
]

function getFirstName(email: string): string {
  const local = email.split('@')[0]
  const part = local.split(/[._-]/)[0]
  return part.charAt(0).toUpperCase() + part.slice(1)
}

export default function FeedbackForm({
  product,
  selectedSize,
  selectedColor,
  orderData,
  onSuccess,
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [fields, setFields] = useState<Record<string, string>>({
    whatLoved: '',
    whatBetter: '',
    whatImprove: '',
    fullComment: '',
  })
  const [loading, setLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState('')

  const formspreeUrl = process.env.NEXT_PUBLIC_FORMSPREE_URL

  const isValid =
    rating > 0 && fields.fullComment.trim().length >= 20

  const setField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!isValid || hasSubmitted || loading) return

    setLoading(true)
    setHasSubmitted(true)
    setError('')

    try {
      const res = await fetch(formspreeUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_email: orderData.email,
          order_id: orderData.displayOrderId,
          product_name: product.title,
          product_size: selectedSize || 'Not specified',
          product_color: selectedColor || 'Not specified',
          star_rating: rating,
          what_loved: fields.whatLoved || '(not answered)',
          what_could_be_better: fields.whatBetter || '(not answered)',
          what_to_improve: fields.whatImprove || '(not answered)',
          full_comment: fields.fullComment,
          submitted_at: new Date().toISOString(),
        }),
      })

      if (!res.ok) {
        throw new Error(`Formspree error: ${res.status}`)
      }

      onSuccess(getFirstName(orderData.email))
    } catch {
      setError(
        'We couldn\'t send your feedback right now. Please try again in a moment.'
      )
      setHasSubmitted(false)
    } finally {
      setLoading(false)
    }
  }

  const variantLabel = [selectedSize, selectedColor].filter(Boolean).join(' · ')

  return (
    <div className="space-y-5">
      {/* Order + product summary */}
      <div className="bg-card-accent rounded-card-lg p-4 border border-border flex items-center gap-4">
        {product.image && (
          <div className="w-14 h-14 rounded-card overflow-hidden flex-shrink-0 bg-white border border-border">
            <Image
              src={product.image.url}
              alt={product.title}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p
            className="text-dark font-medium text-sm leading-snug truncate"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            {product.title}
          </p>
          {variantLabel && (
            <p
              className="text-muted text-xs mt-0.5"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              {variantLabel}
            </p>
          )}
          <p
            className="text-muted text-xs mt-0.5"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Order {orderData.displayOrderId}
          </p>
        </div>
      </div>

      {/* Star rating */}
      <div className="bg-white rounded-card-lg p-6 border border-border">
        <div className="flex items-center justify-between mb-5">
          <p
            className="text-sm font-medium text-dark"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Overall Rating
          </p>
          <span
            className="text-xs bg-orange/10 text-orange px-2.5 py-1 rounded-pill font-medium"
            style={{ fontFamily: 'Jost, sans-serif' }}
          >
            Required
          </span>
        </div>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Textarea cards */}
      {FIELDS.map(({ key, icon: Icon, label, required, placeholder }) => {
        const value = fields[key]
        const isFullComment = key === 'fullComment'
        const charCount = value.trim().length

        return (
          <div
            key={key}
            className="bg-white rounded-card-lg border border-border overflow-hidden"
            style={{ borderLeft: '4px solid #c9a97a' }}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-gold" />
                  </div>
                  <p
                    className="text-sm font-medium text-dark leading-tight"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    {label}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 text-xs px-2.5 py-0.5 rounded-pill font-medium ${
                    required
                      ? 'bg-orange/10 text-orange'
                      : 'bg-border text-muted'
                  }`}
                  style={{ fontFamily: 'Jost, sans-serif' }}
                >
                  {required ? 'Required' : 'Optional'}
                </span>
              </div>

              {/* Textarea */}
              <textarea
                value={value}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full resize-none bg-transparent text-body placeholder:text-muted
                  text-sm leading-relaxed focus:outline-none"
                style={{ fontFamily: 'Jost, sans-serif' }}
              />

              {/* Footer for required field */}
              {isFullComment && (
                <div className="flex justify-between items-center pt-3 mt-1 border-t border-border">
                  <p
                    className="text-xs text-muted"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    Min. 20 characters
                  </p>
                  <p
                    className={`text-xs font-medium tabular-nums transition-colors ${
                      charCount >= 20 ? 'text-gold' : 'text-muted'
                    }`}
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    {charCount} / 20
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })}

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

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || loading || hasSubmitted}
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
            Submitting...
          </>
        ) : (
          'Submit Feedback'
        )}
      </button>

      <p
        className="text-xs text-muted text-center"
        style={{ fontFamily: 'Jost, sans-serif' }}
      >
        Your feedback is private and goes directly to the PELLI team.
      </p>
    </div>
  )
}
