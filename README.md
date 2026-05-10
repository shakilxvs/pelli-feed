# PELLI Feedback App

Customer feedback web application for [PELLI Shoes](https://pellishoes.com) — a premium kids' footwear brand.

Built with **Next.js 14**, **Tailwind CSS**, and **Formspree**. Deployed on **Vercel**.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Form submission**: Formspree.io
- **Product data**: Shopify Storefront API (Headless channel)
- **Deployment**: Vercel

---

## Features

- 3-step multi-page form (no page reloads)
- Fetches live products from Shopify Storefront API
- Size + color variant selection
- Order number + email confirmation
- 5-star rating + 4 feedback text fields
- Submits to Formspree dashboard
- Fully mobile responsive (375px+)
- Loading skeletons, smooth transitions, error states
- Success screen with personalized thank-you

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/pelli-feedback.git
cd pelli-feedback
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Fill in your values in `.env.local`:

```env
SHOPIFY_STORE_DOMAIN=pellishoes.myshopify.com
SHOPIFY_STOREFRONT_PUBLIC_TOKEN=your_public_token
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=shpat_your_private_token
NEXT_PUBLIC_FORMSPREE_URL=https://formspree.io/f/xxxxxxxx
```

**Where to find these:**
- `SHOPIFY_STORE_DOMAIN` — your `.myshopify.com` domain
- `SHOPIFY_STOREFRONT_PUBLIC_TOKEN` — Shopify Admin → Sales Channels → Headless → Storefront API → Public access token
- `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` — same page → Private access token (starts with `shpat_`)
- `NEXT_PUBLIC_FORMSPREE_URL` — [formspree.io](https://formspree.io) → your form → endpoint URL

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option B — GitHub integration (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variables in the Vercel dashboard:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_PUBLIC_TOKEN`
   - `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`
   - `NEXT_PUBLIC_FORMSPREE_URL`
4. Deploy

### Custom domain (feedback.pellishoes.com)

1. In Vercel → your project → Settings → Domains
2. Add `feedback.pellishoes.com`
3. In your DNS provider, add a CNAME record:
   - Name: `feedback`
   - Value: `cname.vercel-dns.com`
4. Wait for propagation (usually under 5 minutes)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | Yes | e.g. `pellishoes.myshopify.com` |
| `SHOPIFY_STOREFRONT_PUBLIC_TOKEN` | Yes | Public Storefront API token |
| `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | Yes | Private Storefront API token (server-side) |
| `NEXT_PUBLIC_FORMSPREE_URL` | Yes | Formspree endpoint URL |

> **Important:** Never commit `.env.local` to Git. It is already in `.gitignore`.

---

## Project Structure

```
pelli-feedback/
├── app/
│   ├── layout.tsx              # Metadata, fonts
│   ├── page.tsx                # Main multi-step page
│   ├── globals.css             # Tailwind + Google Fonts
│   └── api/
│       ├── products/
│       │   └── route.ts        # Shopify Storefront API → product list
│       └── verify-order/
│           └── route.ts        # Order number + email validation
├── components/
│   ├── StepIndicator.tsx       # Step 1/2/3 progress bar
│   ├── ProductGrid.tsx         # Product grid with skeletons
│   ├── ProductCard.tsx         # Individual product card
│   ├── VariantSelector.tsx     # Size pills + color swatches
│   ├── OrderVerification.tsx   # Email + order number form
│   ├── StarRating.tsx          # Interactive 5-star rating
│   ├── FeedbackForm.tsx        # 4 textarea cards + submit
│   └── SuccessScreen.tsx       # Thank you screen
├── lib/
│   └── shopify.ts              # TypeScript types + helpers
├── .env.example                # Environment variable template
├── .env.local                  # Your actual secrets (never commit)
├── next.config.js
├── tailwind.config.js
├── vercel.json
└── README.md
```

---

## Formspree

All feedback submissions go to your Formspree dashboard at [formspree.io](https://formspree.io).

Each submission includes:
- `customer_email`
- `order_id`
- `product_name`
- `product_size`
- `product_color`
- `star_rating`
- `what_loved`
- `what_could_be_better`
- `what_to_improve`
- `full_comment`
- `submitted_at`

You can set up email notifications, export to CSV, or connect to Airtable/Google Sheets from the Formspree dashboard.

---

## Brand Design System

| Token | Value |
|---|---|
| Background | `#f7f4f0` |
| Card | `#ffffff` |
| Gold accent | `#c9a97a` |
| Dark | `#2c2519` |
| Orange | `#b5622a` |
| Body text | `#5a4f45` |
| Muted | `#9a8e82` |
| Border | `#ede8e0` |
| Heading font | Cormorant Garamond (300/400) |
| Body font | Jost (300/400/500) |

---

Built for PELLI Shoes · feedback.pellishoes.com
