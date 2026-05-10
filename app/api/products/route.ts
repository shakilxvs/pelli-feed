import { NextResponse } from 'next/server'

const PRODUCTS_QUERY = `
  query Products($cursor: String) {
    products(first: 250, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
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

async function fetchPage(domain: string, token: string, cursor: string | null) {
  const response = await fetch(
    `https://${domain}/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Shopify-Storefront-Private-Token': token,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { cursor },
      }),
      next: { revalidate: 300 },
    }
  )
  if (!response.ok) throw new Error(`Shopify API returned ${response.status}`)
  const data = await response.json()
  if (data.errors) throw new Error(data.errors[0]?.message || 'GraphQL error')
  return data.data.products
}

function normalizeProduct(node: any) {
  return {
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
  }
}

export async function GET() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN

  if (!domain || !token) {
    return NextResponse.json({ error: 'Store configuration is missing.' }, { status: 500 })
  }

  try {
    const allProducts: any[] = []
    let cursor: string | null = null
    let hasNextPage = true

    // Paginate through all products
    while (hasNextPage) {
      const page = await fetchPage(domain, token, cursor)
      page.edges.forEach(({ node }: any) => allProducts.push(normalizeProduct(node)))
      hasNextPage = page.pageInfo.hasNextPage
      cursor = page.pageInfo.endCursor
    }

    return NextResponse.json({ products: allProducts })
  } catch (error: any) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Unable to load products right now. Please refresh the page.' },
      { status: 500 }
    )
  }
}
