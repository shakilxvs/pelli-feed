'use client'

import { Product } from '@/lib/shopify'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  selectedProduct: Product | null
  onSelect: (product: Product) => void
  loading: boolean
  error?: string
}

function SkeletonCard() {
  return (
    <div className="rounded-card-lg overflow-hidden border border-border animate-pulse bg-white">
      <div className="aspect-square bg-border/60" />
      <div className="p-3.5 space-y-2">
        <div className="h-3.5 bg-border rounded-full w-4/5" />
        <div className="h-3 bg-border rounded-full w-2/5" />
      </div>
    </div>
  )
}

export default function ProductGrid({
  products,
  selectedProduct,
  onSelect,
  loading,
  error,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-orange/5 border border-orange/20 rounded-card-lg p-6 text-center">
        <p className="text-orange text-sm" style={{ fontFamily: 'Jost, sans-serif' }}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-xs text-muted underline underline-offset-2 hover:text-dark transition-colors"
          style={{ fontFamily: 'Jost, sans-serif' }}
        >
          Try again
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p style={{ fontFamily: 'Jost, sans-serif' }}>No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="fade-in-up"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <ProductCard
            product={product}
            selected={selectedProduct?.id === product.id}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  )
}
