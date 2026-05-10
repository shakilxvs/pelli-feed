import { NextResponse } from 'next/server'

const PRODUCTS_QUERY = `
  query Products {
    products(first: 50) {
      edges {
        node {
          id
          title
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          options {
            name
            values
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN

  if (!domain || !token) {
    return NextResponse.json(
      { error: 'Store configuration is missing.' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://${domain}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Shopify-Storefront-Private-Token': token,
        },
        body: JSON.stringify({ query: PRODUCTS_QUERY }),
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) {
      const text = await response.text()
      console.error('Shopify error:', response.status, text)
      throw new Error(`Shopify API returned ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      console.error('GraphQL errors:', data.errors)
      throw new Error(data.errors[0]?.message || 'GraphQL error')
    }

    const products = data.data.products.edges.map(
      ({ node }: any) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        image: node.images.edges[0]?.node ?? null,
        price: node.priceRange.minVariantPrice,
        options: node.options,
        variants: node.variants.edges.map(({ node: v }: any) => ({
          id: v.id,
          title: v.title,
          price: v.price,
          selectedOptions: v.selectedOptions,
          availableForSale: v.availableForSale,
        })),
      })
    )

    return NextResponse.json({ products })
  } catch (error: any) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Unable to load products right now. Please refresh the page.' },
      { status: 500 }
    )
  }
}
