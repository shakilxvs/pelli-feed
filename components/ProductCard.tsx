'use client'

import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import { Product, formatPrice } from '@/lib/shopify'

interface ProductCardProps {
  product: Product
  selected: boolean
  onSelect: (product: Product) => void
}

export default function ProductCard({ product, selected, onSelect }: ProductCardProps) {
  return (
    <button
      onClick={() => onSelect(product)}
      className={`
        w-full text-left rounded-card-lg overflow-hidden transition-all duration-200 bg-white group
        ${
          selected
            ? 'ring-2 ring-gold shadow-lg shadow-gold/10 scale-[1.01]'
            : 'border border-border hover:border-gold/40 hover:shadow-md'
        }
      `}
    >
      {/* Image */}
      <div className="relative aspect-square bg-card-accent overflow-hidden">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.altText || product.title}
            fill
            className={`object-cover transition-transform duration-500 ${
              selected ? 'scale-105' : 'group-hover:scale-103'
            }`}
            sizes="(max-width: 640px) 50vw, 340px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted text-xs" style={{ fontFamily: 'Jost, sans-serif' }}>
              No image
            </span>
          </div>
        )}

        {/* Selected badge */}
        {selected && (
          <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-gold rounded-full flex items-center justify-center shadow-md">
            <CheckCircle className="w-4 h-4 text-dark fill-dark/10" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p
          className={`text-sm leading-snug mb-1 line-clamp-2 transition-colors ${
            selected ? 'text-dark font-medium' : 'text-body'
          }`}
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          {product.title}
        </p>
        <p
          className="text-xs font-medium text-gold"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          {formatPrice(product.price.amount, product.price.currencyCode)}
        </p>
      </div>
    </button>
  )
}
