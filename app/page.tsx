'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { ChevronRight, ChevronLeft, Search, X, RotateCcw } from 'lucide-react'

import { Product, formatPrice, getSizeOption } from '@/lib/shopify'
import StepIndicator from '@/components/StepIndicator'
import ProductGrid from '@/components/ProductGrid'
import VariantSelector from '@/components/VariantSelector'
import OrderVerification from '@/components/OrderVerification'
import FeedbackForm from '@/components/FeedbackForm'
import SuccessScreen from '@/components/SuccessScreen'

const TOTAL_STEPS = 3

const STEP_COPY = [
  {
    title: 'Which product are you reviewing?',
    subtitle: 'Find your product, pick your size, then continue.',
  },
  {
    title: 'Confirm your order',
    subtitle: "Enter your order details so we know it's you.",
  },
  {
    title: 'Share your experience',
    subtitle: 'Your honest words help us make every pair better.',
  },
]

interface OrderData {
  email: string
  orderId: string
  displayOrderId: string
  maskedEmail: string
}

export default function FeedbackPage() {
  const [step, setStep] = useState(1)
  const [animKey, setAnimKey] = useState(0)

  // Products
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')

  // Step 1 — product picking flow
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productConfirmed, setProductConfirmed] = useState(false) // grid hidden after this
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  // Step 2
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  // Success
  const [isSuccess, setIsSuccess] = useState(false)
  const [successName, setSuccessName] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setProducts(data.products)
      } catch (e: any) {
        setProductsError(e.message || 'Unable to load products. Please refresh.')
      } finally {
        setProductsLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter((p) => p.title.toLowerCase().includes(q))
  }, [products, search])

  const goToStep = (next: number) => {
    setStep(next)
    setAnimKey((k) => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // User taps a product card in the grid
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setSelectedSize(null)
    setSelectedColor(null)
    setProductConfirmed(true) // collapse grid, show variant selectors
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // "Change product" resets back to grid
  const handleChangeProduct = () => {
    setSelectedProduct(null)
    setProductConfirmed(false)
    setSelectedSize(null)
    setSelectedColor(null)
  }

  const hasSizeOption = selectedProduct ? !!getSizeOption(selectedProduct) : false
  // Size required only if the product actually has a Size option
  const canContinueStep1 = selectedProduct !== null && (!hasSizeOption || selectedSize !== null)

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-10 pb-20">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <a href="https://pellishoes.com" target="_blank" rel="noopener noreferrer">
            <Image
              src="https://cdn.shopify.com/s/files/1/0685/4859/1755/files/logo_brown.png?v=1749682575"
              alt="PELLI Shoes"
              width={90}
              height={36}
              className="object-contain opacity-90 hover:opacity-100 transition-opacity"
              priority
            />
          </a>
        </div>

        <div className="max-w-feedback mx-auto">
          {isSuccess ? (
            <SuccessScreen firstName={successName} />
          ) : (
            <>
              <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

              {/* Step heading */}
              <div key={`heading-${animKey}`} className="mb-6 fade-in-up">
                <h1
                  className="text-3xl sm:text-4xl text-dark leading-tight"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
                >
                  {STEP_COPY[step - 1].title}
                </h1>
                <p
                  className="text-muted mt-2 text-sm leading-relaxed"
                  style={{ fontFamily: 'Jost, sans-serif' }}
                >
                  {STEP_COPY[step - 1].subtitle}
                </p>
              </div>

              {/* ── STEP 1 ── */}
              {step === 1 && (
                <div key={`step1-${animKey}`} className="space-y-4 fade-in-up">

                  {/* ── A: Grid view (no product confirmed yet) ── */}
                  {!productConfirmed && (
                    <>
                      {/* Search bar */}
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search products..."
                          className="w-full pl-11 pr-10 py-3.5 rounded-pill border border-border bg-white
                            text-dark placeholder:text-muted focus:border-gold focus:outline-none
                            transition-colors text-sm"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        />
                        {search && (
                          <button
                            onClick={() => setSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-dark transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Product count hint */}
                      {!productsLoading && products.length > 0 && (
                        <p className="text-xs text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
                          {search
                            ? `${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} for "${search}"`
                            : `${products.length} products`}
                        </p>
                      )}

                      <ProductGrid
                        products={filteredProducts}
                        selectedProduct={selectedProduct}
                        onSelect={handleProductSelect}
                        loading={productsLoading}
                        error={productsError}
                      />
                    </>
                  )}

                  {/* ── B: Product confirmed — show compact card + variant selectors ── */}
                  {productConfirmed && selectedProduct && (
                    <div className="space-y-4 fade-in-up">

                      {/* Selected product card */}
                      <div className="bg-white rounded-card-lg border border-gold/40 p-4 flex items-center gap-4">
                        {selectedProduct.image && (
                          <div className="w-16 h-16 rounded-card overflow-hidden flex-shrink-0 bg-card-accent">
                            <Image
                              src={selectedProduct.image.url}
                              alt={selectedProduct.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-dark font-medium text-sm leading-snug truncate"
                            style={{ fontFamily: 'Jost, sans-serif' }}
                          >
                            {selectedProduct.title}
                          </p>
                          <p
                            className="text-gold text-xs mt-0.5"
                            style={{ fontFamily: 'Jost, sans-serif' }}
                          >
                            {formatPrice(selectedProduct.price.amount, selectedProduct.price.currencyCode)}
                          </p>
                        </div>
                        <button
                          onClick={handleChangeProduct}
                          className="flex items-center gap-1.5 text-xs text-muted hover:text-dark
                            border border-border rounded-pill px-3 py-1.5 transition-colors flex-shrink-0"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        >
                          <RotateCcw className="w-3 h-3" />
                          Change
                        </button>
                      </div>

                      {/* Variant selectors */}
                      <div className="bg-white rounded-card-lg border border-border p-6">
                        <VariantSelector
                          product={selectedProduct}
                          selectedSize={selectedSize}
                          selectedColor={selectedColor}
                          onSizeChange={setSelectedSize}
                          onColorChange={setSelectedColor}
                        />
                        {hasSizeOption && !selectedSize && (
                          <p
                            className="text-xs text-orange mt-5 pt-4 border-t border-border"
                            style={{ fontFamily: 'Jost, sans-serif' }}
                          >
                            Please select a size to continue.
                          </p>
                        )}
                      </div>

                      {/* Next button */}
                      <button
                        onClick={() => goToStep(2)}
                        disabled={!canContinueStep1}
                        className="w-full bg-gold text-dark rounded-pill py-4 text-sm font-medium
                          flex items-center justify-center gap-2
                          hover:bg-gold/90 active:scale-[0.99]
                          disabled:opacity-40 disabled:cursor-not-allowed
                          transition-all duration-200"
                        style={{ fontFamily: 'Jost, sans-serif' }}
                      >
                        Next — Confirm Order
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <div key={`step2-${animKey}`} className="space-y-4 fade-in-up">
                  <div className="bg-white rounded-card-lg p-6 border border-border">
                    <OrderVerification onVerified={(data) => setOrderData(data)} />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => { goToStep(1); setOrderData(null) }}
                      className="flex items-center gap-1.5 px-5 py-4 rounded-pill border border-border
                        text-body text-sm hover:border-dark hover:text-dark transition-colors"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      onClick={() => goToStep(3)}
                      disabled={!orderData}
                      className="flex-1 bg-gold text-dark rounded-pill py-4 text-sm font-medium
                        flex items-center justify-center gap-2
                        hover:bg-gold/90 active:scale-[0.99]
                        disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all duration-200"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                    >
                      Next — Write Feedback
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3 ── */}
              {step === 3 && orderData && selectedProduct && (
                <div key={`step3-${animKey}`} className="space-y-5 fade-in-up">
                  <FeedbackForm
                    product={selectedProduct}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    orderData={orderData}
                    onSuccess={(name) => {
                      setSuccessName(name)
                      setIsSuccess(true)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  />
                  <button
                    onClick={() => goToStep(2)}
                    className="flex items-center gap-1.5 text-muted text-sm
                      hover:text-dark transition-colors mx-auto"
                    style={{ fontFamily: 'Jost, sans-serif' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                </div>
              )}
            </>
          )}

          <footer className="mt-16 text-center">
            <p className="text-xs text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
              © PELLI Shoes · feedback.pellishoes.com
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
