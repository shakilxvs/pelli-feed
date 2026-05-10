import { NextRequest, NextResponse } from 'next/server'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function isValidOrderId(orderId: string): boolean {
  const cleaned = orderId.replace(/^#/, '').trim()
  return /^[A-Za-z0-9]{3,}$/.test(cleaned)
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  const visible = local.substring(0, Math.min(2, local.length))
  return `${visible}***@${domain}`
}

function normalizeOrderId(orderId: string): string {
  return orderId.replace(/^#/, '').trim()
}

function displayOrderId(orderId: string): string {
  const normalized = normalizeOrderId(orderId)
  return `#${normalized}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, orderId } = body

    if (!email || !orderId) {
      return NextResponse.json(
        { error: 'Please fill in both your email address and order number.' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "That email address doesn't look right. Please double-check it." },
        { status: 400 }
      )
    }

    if (!isValidOrderId(orderId)) {
      return NextResponse.json(
        { error: "Please enter a valid order number — you'll find it in your confirmation email." },
        { status: 400 }
      )
    }

    return NextResponse.json({
      verified: true,
      maskedEmail: maskEmail(email.trim()),
      orderId: normalizeOrderId(orderId),
      displayOrderId: displayOrderId(orderId),
    })
  } catch (error) {
    console.error('verify-order error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again in a moment.' },
      { status: 500 }
    )
  }
}
