'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronRight, ChevronLeft } from 'lucide-react'

import { Product } from '@/lib/shopify'
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
    subtitle: 'Select the product you purchased, then choose your size.',
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

  // Step 1
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  // Step 2
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  // Success
  const [isSuccess, setIsSuccess] = useState(false)
  const [successName, setSuccessName] = useState('')

  // Fetch products on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setProducts(data.products)
      } catch (e: any) {
        setProductsError(
          e.message || 'Unable to load products. Please refresh the page.'
        )
      } finally {
        setProductsLoading(false)
      }
    }
    loadProducts()
  }, [])

  const goToStep = (next: number) => {
    setStep(next)
    setAnimKey((k) => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setSelectedSize(null)
    setSelectedColor(null)
  }

  const canContinueStep1 = selectedProduct !== null && selectedSize !== null

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
              {/* Step indicator */}
              <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

              {/* Step heading */}
              <div
                key={`heading-${animKey}`}
                className="mb-6 fade-in-up"
              >
                <h1
                  className="text-3xl sm:text-4xl text-dark leading-tight"
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontWeight: 300,
                  }}
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

              {/* ── STEP 1: Product Selection ── */}
              {step === 1 && (
                <div
                  key={`step1-${animKey}`}
                  className="space-y-5 fade-in-up"
                >
                  <ProductGrid
                    products={products}
                    selectedProduct={selectedProduct}
                    onSelect={handleProductSelect}
                    loading={productsLoading}
                    error={productsError}
                  />

                  {/* Variant selector — appears after product selected */}
                  {selectedProduct && (
                    <div
                      className="bg-white rounded-card-lg p-6 border border-border fade-in-up"
                    >
                      <p
                        className="text-xs font-medium text-muted uppercase tracking-wide mb-5"
                        style={{ fontFamily: 'Jost, sans-serif' }}
                      >
                        {selectedProduct.title}
                      </p>
                      <VariantSelector
                        product={selectedProduct}
                        selectedSize={selectedSize}
                        selectedColor={selectedColor}
                        onSizeChange={setSelectedSize}
                        onColorChange={setSelectedColor}
                      />
                      {!selectedSize && (
                        <p
                          className="text-xs text-muted mt-4"
                          style={{ fontFamily: 'Jost, sans-serif' }}
                        >
                          Please select your size to continue.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Continue */}
                  {canContinueStep1 && (
                    <button
                      onClick={() => goToStep(2)}
                      className="w-full bg-gold text-dark rounded-pill py-4 text-sm font-medium
                        flex items-center justify-center gap-2
                        hover:bg-gold/90 active:scale-[0.99]
                        transition-all duration-200 fade-in-up"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* ── STEP 2: Order Verification ── */}
              {step === 2 && (
                <div
                  key={`step2-${animKey}`}
                  className="space-y-5 fade-in-up"
                >
                  <div className="bg-white rounded-card-lg p-6 border border-border">
                    <OrderVerification
                      onVerified={(data) => setOrderData(data)}
                    />
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        goToStep(1)
                        setOrderData(null)
                      }}
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
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Feedback Form ── */}
              {step === 3 && orderData && selectedProduct && (
                <div
                  key={`step3-${animKey}`}
                  className="space-y-5 fade-in-up"
                >
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
                    Back to order confirmation
                  </button>
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <footer className="mt-16 text-center">
            <p
              className="text-xs text-muted"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              © PELLI Shoes · feedback.pellishoes.com
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
