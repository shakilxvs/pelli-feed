'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
}

const LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Great',
  5: 'Excellent',
}

export default function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex gap-1.5"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            className="transition-transform duration-100 hover:scale-110 active:scale-95 focus:outline-none"
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              className={`w-9 h-9 transition-all duration-150 ${
                star <= active
                  ? 'fill-gold text-gold drop-shadow-sm'
                  : 'text-border fill-transparent'
              }`}
            />
          </button>
        ))}
      </div>

      <div
        className={`h-5 transition-all duration-200 ${
          active > 0 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span
          className="text-sm font-medium text-gold"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          {LABELS[active] || ''}
        </span>
      </div>
    </div>
  )
}
