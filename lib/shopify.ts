export interface ProductImage {
  url: string
  altText: string | null
}

export interface ProductVariant {
  id: string
  title: string
  price: {
    amount: string
    currencyCode: string
  }
  selectedOptions: {
    name: string
    value: string
  }[]
  availableForSale: boolean
}

export interface ProductOption {
  name: string
  values: string[]
}

export interface Product {
  id: string
  title: string
  handle: string
  image: ProductImage | null
  price: {
    amount: string
    currencyCode: string
  }
  options: ProductOption[]
  variants: ProductVariant[]
}

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(parseFloat(amount))
}

const SIZE_NAMES = ['size', 'sizes', 'shoe size', 'kids size', 'child size', 'uk size', 'eu size']
const COLOR_NAMES = ['color', 'colour', 'colors', 'colours']

export function getSizeOption(product: Product): ProductOption | undefined {
  return product.options.find((o) => SIZE_NAMES.includes(o.name.toLowerCase()))
}

export function getColorOption(product: Product): ProductOption | undefined {
  return product.options.find((o) => COLOR_NAMES.includes(o.name.toLowerCase()))
}

export function hasColors(product: Product): boolean {
  return !!getColorOption(product)
}

export function hasSizes(product: Product): boolean {
  return !!getSizeOption(product)
}
