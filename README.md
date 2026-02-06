# Hyundai Motors E-Commerce

An infinite-scroll e-commerce website for browsing and purchasing Hyundai vehicles.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + shadcn/ui + Radix
- **API**: tRPC v11 (end-to-end type safety)
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Auth**: Clerk
- **Payments**: Stripe
- **Search**: Meilisearch
- **State**: Zustand (client) + TanStack Query (server)
- **Images**: Cloudinary + next/image

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in values
3. Install dependencies and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to DB |
| `npm run db:studio` | Open Drizzle Studio |

## Project Structure

```
src/
  app/
    (shop)/          # Commerce pages (vehicles, cart, checkout, compare, search)
    (auth)/          # Auth pages (sign-in, sign-up)
    (account)/       # Dashboard pages (orders, wishlist, garage, settings)
    api/             # tRPC handler + webhooks
  components/
    ui/              # shadcn/ui components
    layout/          # Header, Footer, MobileNav
    vehicles/        # VehicleCard, VehicleGrid, etc.
    filters/         # FilterSidebar, PriceRange, etc.
    cart/            # CartSheet, CartItem, etc.
    ...
  server/
    api/             # tRPC routers and context
    db/              # Drizzle schema and connection
  trpc/              # tRPC client, server caller, provider
  stores/            # Zustand stores (cart, compare)
  hooks/             # Custom React hooks
  lib/               # Utils, constants, validators
  types/             # TypeScript type definitions
```
