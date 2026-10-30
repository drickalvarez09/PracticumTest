# Wanderly

A tour-booking site built as one project across four weeks: hand-written HTML and CSS, then React with Vite, then Next.js with Postgres and authentication, then Stripe Checkout in test mode.

## Live Demo

**https://assignment-main-eight.vercel.app**

The site runs entirely in Stripe **test mode** — no real cards are charged. Sign up with any email, then use the test card below on any tour.

| Field | Value |
| --- | --- |
| Card number | `4242 4242 4242 4242` |
| Expiry | Any future date |
| CVC | Any three digits |
| Postal code | Any value |

## The Journey

### Week 1 — Vanilla HTML and CSS

The first version was a single static page with hand-written HTML and CSS, no framework and no build step. The goal was to settle the visual design — typography, the cream/teal/orange palette, the tour grid — before adding any moving parts. Everything on the page was markup; nothing was data-driven yet.

### Week 2 — React with Vite

The page was broken into components (Header, Hero, Packages, TourCard, PlanForm, and so on) and moved to React with Vite as the dev server and bundler. Tour content was hardcoded in `src/data/siteData.js`, and client-side state arrived: category filters, a per-card traveler stepper, a slideshow, and a booking form that autofilled from the selected tour. This was the first point where the UI had behavior rather than just layout.

### Week 3 — Next.js, Postgres, and Auth

The Vite app was migrated to Next.js 16 using the App Router, with Tailwind v4 for styling. Prisma and a free Neon Postgres database replaced the hardcoded tours: an `Item` table holds the tour packages, seeded from the old `siteData.js`, and a `User` table backs authentication. Auth.js v5 with a credentials provider handles signup, login, and sign-out, and the home page became a server component that fetches `/api/items` with `cache: 'no-store'` and passes the rows down as props. The app was deployed to Vercel with automatic deploys from `main`.

### Week 4 — Stripe Checkout

The last week added a real purchase path without changing the planning tool. A **Buy now** button sits next to the existing "Book this trip" action; it asks the server for a Stripe Checkout URL and sends the browser to Stripe's hosted page. Two new tables, `Order` and `OrderItem`, record each attempt and freeze the price at the time of purchase. A signed webhook — not the success page — is the only code that marks an order paid. The whole flow was tested locally with the Stripe CLI and then in production with a dashboard webhook endpoint.

## Tech Stack

| Concern | Tools |
| --- | --- |
| Frontend | React 19, Next.js 16 App Router, Tailwind CSS v4 (`@theme` tokens and a class-based dark mode), JavaScript/JSX only |
| Backend | Next.js route handlers in `src/app/api/`, Prisma Client 6 |
| Database | Neon Postgres (free tier), pooled connection string |
| Auth | Auth.js v5 (`next-auth` beta), credentials provider, JWT sessions, Node `scrypt` password hashing |
| Payments | Stripe Node SDK v23, Checkout Sessions, signed webhooks (test mode) |
| Deployment | Vercel, auto-deploy from GitHub `main`, environment variables in the Vercel dashboard |

## Architecture Overview

```text
Browser
  │
  ├── Pages (React 19, src/app)
  │     └── server component `/` ── fetch /api/items ── Prisma ── Neon Postgres
  │
  ├── Auth.js credentials ── POST /api/auth/[...nextauth] ── JWT cookie
  │
  └── Buy now ── POST /api/checkout ── Prisma (Order + OrderItem) ── Stripe Checkout

Stripe (hosted payment page)
  └── checkout.session.completed
        └── POST /api/webhooks/stripe
              └── signature check ── Order.status = 'paid'
```

- All server code lives inside Next.js as route handlers; there is no separate Express API.
- The session is an encrypted JWT in a cookie, so no session table is required.
- Order lookup for the success page goes through `GET /api/orders/[id]`, which checks both authentication and ownership.
- The webhook is the only writer of `status = 'paid'`. The success page only reads.

## Project Structure

```text
src/
├── app/
│   ├── layout.jsx                 # root layout, theme-init script, SessionProvider
│   ├── page.jsx                   # server component; fetches items and renders MainContent
│   ├── globals.css                # Tailwind import, @theme palette, .dark overrides
│   ├── login/page.jsx             # credentials sign-in form
│   ├── signup/page.jsx            # account form; posts to /api/signup
│   ├── success/page.jsx           # polls the order until paid/pending/failed
│   └── api/
│       ├── auth/[...nextauth]/route.js   # Auth.js handlers
│       ├── signup/route.js               # create user, hash password
│       ├── items/route.js                # GET tour packages from Postgres
│       ├── checkout/route.js             # create order + Stripe session
│       ├── orders/[id]/route.js          # read one order (auth + ownership)
│       └── webhooks/stripe/route.js      # verified Stripe events
├── components/                    # Header, Hero, Slideshow, MainContent, Packages,
│                                  # TourCard, TravelerStepper, HowItWorks, Stories,
│                                  # PlanForm, Footer, Icon, buttonStyles.js
├── data/siteData.js               # static content: nav, slides, stats, steps, reviews, filters
└── lib/
    ├── prisma.js                  # one PrismaClient per process
    ├── password.js                # scrypt hash + timing-safe verify
    └── stripe.js                  # lazily created Stripe client

prisma/
├── schema.prisma                  # User, Item, Order, OrderItem
├── seed.js                        # idempotent upsert of tours into Item
└── migrations/                    # init, add_orders
```

Path alias `@/*` maps to `src/*` via `jsconfig.json`.

## Database Schema

| Model | Purpose | Notable fields |
| --- | --- | --- |
| `User` | One row per person who can sign in | `email` (unique), `passwordHash`, `name` |
| `Item` | One row per tour package; the database copy of the old `tours` array | `name`, `description`, `type`, `days`, `price`, `badge`, `featured`, `image`, `alt` |
| `Order` | One checkout attempt | `userId`, `status` (`pending` / `paid`), `amountTotal`, `stripeSessionId` (unique), `createdAt` |
| `OrderItem` | The frozen line items of an order | `orderId`, `itemId`, `quantity`, `unitPrice` |

`Item.price` is stored in whole dollars because the UI displays dollars. `Order.amountTotal` and `OrderItem.unitPrice` are stored in **cents**, matching Stripe's smallest currency unit; the conversion happens once in `POST /api/checkout`.

## Key Flows

### Signup and Login

`POST /api/signup` validates the email and an eight-character minimum password, hashes the password with Node's `scrypt` (stored as `salt:hash`), and creates the `User` row. Duplicate emails return `409`. Login posts to Auth.js through the credentials provider, which looks the user up and verifies the hash with `timingSafeEqual`; on success Auth.js sets the encrypted JWT session cookie. The header reads the session and shows either **Sign in** or **Sign out**, and the session survives a page refresh.

### Checkout

`TourCard`'s **Buy now** button sends `{ itemId, quantity }` to `POST /api/checkout`; quantity is the card's traveler count. The route rejects unauthenticated requests with `401`, then loads the `Item` from Postgres to get the real price — the browser never supplies an amount. Inside a Prisma transaction it creates an `Order` with `status: 'pending'` and an `OrderItem` carrying the price at that moment, then creates a Stripe Checkout Session with `metadata.orderId` and the site origin as the success/cancel target. The session id is saved on the order, and the route returns `{ url }`, which the client follows with `window.location.assign`.

### Payment Confirmation (webhook)

Stripe posts to `/api/webhooks/stripe`. The route reads the raw body with `await request.text()` — parsing it as JSON would change the bytes and break the signature — and verifies it with `constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)`. Invalid signatures get `400`. On `checkout.session.completed`, it reads `session.metadata.orderId`, loads the order, and returns `200` without changes if the order is missing or already paid, making redelivery harmless. Otherwise it sets `status = 'paid'`. Database errors return `500` so Stripe retries. The success page polls `GET /api/orders/[id]` once per second for up to ten seconds, because the redirect can arrive before the webhook.

## Local Setup

Requires Node 20.6+ (the commands below use `--env-file`).

1. Clone and install:
```bash
git clone https://github.com/drickalvarez09/PracticumTest.git
cd PracticumTest
npm install
```
`postinstall` runs `prisma generate`.

2. Create a Neon project and copy its **pooled** connection string (`-pooler` host, `sslmode=require`).

3. Create `.env.local` in the repo root:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@ep-...-pooler.REGION.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="a-long-random-string"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."   # added later, from the Stripe CLI
```
Generate `AUTH_SECRET` with:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

4. Apply migrations and seed the tours. The Prisma CLI reads `.env`, not `.env.local`, so pass the file to Node explicitly:
```powershell
node --env-file=.env.local ./node_modules/prisma/build/index.js migrate deploy
node --env-file=.env.local ./node_modules/prisma/build/index.js db seed
```
The seed upserts each tour by id, so running it twice does not create duplicates.

5. Start the app:
```bash
npm run dev
```
Open `http://localhost:3000`, sign up, and the tour CTA opens Stripe Checkout with the test card from the top of this file.

## Environment Variables

| Name | Used by | Where it comes from |
| --- | --- | --- |
| `DATABASE_URL` | Prisma runtime and CLI | Neon dashboard → connection details → pooled connection string |
| `AUTH_SECRET` | Auth.js | Generated once per environment with `crypto.randomBytes` |
| `STRIPE_SECRET_KEY` | Stripe SDK (server only) | Stripe dashboard → Developers → API keys, **test mode** (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature check | Locally: printed by `stripe listen`. Production: the endpoint's own signing secret in the Stripe dashboard |

The two `whsec_...` values are different and not interchangeable. `.env*.local` is ignored by git; production values live in the Vercel dashboard.

## Running Local Webhook Testing

1. Install the Stripe CLI and link it to your account:
```powershell
winget install Stripe.StripeCLI
stripe login
```

2. Keep the dev server running on port 3000, then start forwarding in a second terminal:
```powershell
stripe listen --forward-to localhost:3000/api/webhooks/stripe --events checkout.session.completed
```
It prints `Ready! Your webhook signing secret is whsec_...`.

3. Put that value in `.env.local` as `STRIPE_WEBHOOK_SECRET`, then **restart `npm run dev`** — Next reads env files only at startup.

4. Buy a tour with `4242 4242 4242 4242`. The CLI should log `checkout.session.completed` followed by `200 POST /api/webhooks/stripe`, and the success page should switch to "Payment received" within a second or two.

If the route returns `400`, the signing secret is wrong or the body was parsed before verification. If it returns `500`, check the terminal for the Prisma error.

## Deployment

The app is deployed on Vercel from `main`; pushes build automatically.

- **Build command:** `vercel.json` sets `prisma generate && next build`, and `package.json` also runs `prisma generate` on `postinstall`. Both exist because a stale generated client is the failure mode that matters most here.
- **Environment variables:** `DATABASE_URL`, `AUTH_SECRET`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` are set for the Production environment in Vercel. Changing one requires a new deployment.
- **Production webhook:** a separate endpoint in the Stripe dashboard points at `https://assignment-main-eight.vercel.app/api/webhooks/stripe` and subscribes only to `checkout.session.completed`. Its signing secret — not the CLI's — goes into Vercel.
- **Migrations:** the deployed app shares the same Neon database used locally in this project, so `prisma migrate deploy` is run against that connection before testing a schema change:
```powershell
node --env-file=.env.local ./node_modules/prisma/build/index.js migrate deploy
```
- **Verification:** sign in on the live URL, buy a tour with the test card, confirm "Payment received" on `/success`, and check the Stripe dashboard shows a `200` delivery for the event.

## Notable Debugging / Lessons

- **Prisma client not regenerating on Vercel.** A schema revert shipped to Vercel produced a generated client without the `Order` model, so `/api/checkout` crashed with `Cannot read properties of undefined (reading 'create')` while local development still worked against a stale client. Generating the client explicitly in the build command, in addition to `postinstall`, removed the gap between schema and runtime.
- **Schema and migration drift after a file revert.** `schema.prisma` and the `add_orders` migration folder were reverted while the Neon database still contained the `Order` tables, leaving migration history out of sync with reality. I recreated the migration and marked it applied with `prisma migrate resolve --applied 20261026145101_add_orders`; `migrate status` was then clean, with no data touched.
- **Turbopack build cache staleness.** After files were moved around, Turbopack kept reusing outdated build output, so a change appeared not to take effect. Deleting `.next` and rebuilding resolved it. A clean build is now the first check when a change seems missing in the browser.

## What I'd Do Differently / Next Steps

- Use a separate Neon branch (or database) for production instead of sharing one instance with local development; migration mistakes would stay contained.
- Add automated tests for the parts where a silent failure is expensive: webhook signature verification and idempotency, checkout reading prices only from the database, and order ownership on `GET /api/orders/[id]` — plus a CI check on pull requests.
- Write a short runbook for rotating Stripe and Auth secrets (per-environment webhook secrets, where to update them, and the redeploy step) so rotation is routine rather than rediscovered.
