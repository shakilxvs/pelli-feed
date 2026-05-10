'use client'

import { Product, getSizeOption, getColorOption } from '@/lib/shopify'

interface VariantSelectorProps {
  product: Product
  selectedSize: string | null
  selectedColor: string | null
  onSizeChange: (size: string) => void
  onColorChange: (color: string) => void
}

const COLOR_MAP: Record<string, string> = {
  black: '#1c1c1c',
  white: '#f0eeea',
  red: '#c0392b',
  blue: '#2980b9',
  navy: '#1a2a4a',
  green: '#27ae60',
  pink: '#e91e8c',
  purple: '#8e44ad',
  yellow: '#f1c40f',
  orange: '#b5622a',
  brown: '#6b3f1e',
  grey: '#7f8c8d',
  gray: '#7f8c8d',
  beige: '#d4b896',
  tan: '#c9a97a',
  cream: '#fff8f2',
  camel: '#c19a6b',
  nude: '#e8c4a0',
  coral: '#e8735a',
  mint: '#3eb489',
  silver: '#bdc3c7',
  gold: '#c9a97a',
}

function getColorHex(colorName: string): string {
  const lower = colorName.toLowerCase()
  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return value
  }
  return '#c9a97a'
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 180
}

export default function VariantSelector({
  product,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: VariantSelectorProps) {
  const sizeOption = getSizeOption(product)
  const colorOption = getColorOption(product)

  if (!sizeOption && !colorOption) return null

  return (
    <div className="space-y-6">
      {sizeOption && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p
              className="text-sm font-medium text-dark"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              Size
            </p>
            {selectedSize && (
              <span
                className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-pill"
                style={{ fontFamily: 'Jost, sans-serif' }}
              >
                {selectedSize} selected
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizeOption.values.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`
                  min-w-[48px] px-4 py-2 rounded-pill text-sm font-medium
                  border transition-all duration-150
                  ${
                    selectedSize === size
                      ? 'bg-dark text-white border-dark shadow-sm'
                      : 'bg-white text-body border-border hover:border-gold/60 hover:text-dark'
                  }
                `}
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colorOption && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p
              className="text-sm font-medium text-dark"
              style={{ fontFamily: 'Jost, sans-serif' }}
            >
              Color
            </p>
            {selectedColor && (
              <span
                className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-pill"
                style={{ fontFamily: 'Jost, sans-serif' }}
              >
                {selectedColor}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {colorOption.values.map((color) => {
              const hex = getColorHex(color)
              const isSelected = selectedColor === color
              const light = isLightColor(hex)

              return (
                <button
                  key={color}
                  onClick={() => onColorChange(color)}
                  title={color}
                  className={`
                    flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-pill text-sm
                    border transition-all duration-150
                    ${
                      isSelected
                        ? 'border-dark bg-dark text-white shadow-sm'
                        : 'border-border bg-white text-body hover:border-gold/60'
                    }
                  `}
                  style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex-shrink-0 border ${
                      light ? 'border-border' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                  {color}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
