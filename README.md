# The Look

A full-stack ecommerce demo for men's, women's and kids' clothing, shoes and accessories, built with Next.js 16 to practice full-stack development.

**Live demo:** https://thelook.rysopanha.com

> **Demo project.** This is not a real store. Products, brands, prices and contact details are placeholders for learning purposes. Checkout runs on the **ABA PayWay sandbox**, so no real payments are taken.

<!-- Add a screenshot or short GIF here, e.g. ![Home page](./docs/home.png) -->

## Features

- **Product catalog** with category browsing (men, women, kids; shoes, pants, accessories)
- **Product detail pages** with one page per product, addressed by a short slug (for example `men-shirts-12`)
- **Shopping cart** built with React Context and a custom hook (in-memory, lives for the session)
- **Favorites** saved in the browser
- **Authentication** using JWT (HS256): a short-lived access token and a long-lived refresh token, both in httpOnly cookies
- **Silent session refresh:** when the access token expires, `proxy.ts` renews it from the refresh token, so the user is not sent back to the login page
- **Route protection** with a lightweight `proxy.ts`, with verification logic kept in separate service files
- **Checkout with ABA KHQR** (PayWay sandbox): delivery details, a pending order, a QR code, live payment status and a printable receipt
- **Dynamic payment page** at `/shopping-cart/checkout/pay/<orderId>`, which reads the order id from the URL
- **Account area** with saved delivery details and order history
- **SEO** with per-page metadata, Open Graph tags, `robots.txt`, `sitemap.xml` and Product structured data (JSON-LD)

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Cache Components), React 19 |
| Language | TypeScript |
| Database | MongoDB with Mongoose |
| Validation | Zod |
| Auth | bcrypt, jose (JWT) |
| Payments | ABA PayWay QR API (sandbox), KHQR |
| Styling | Tailwind CSS |
| Hosting | Vercel |

## How authentication works

1. **Register:** the username, email and password are combined, hashed with SHA-256, and the digest is then hashed with bcrypt. Only that hash is stored, and there is no separate password field.
2. **Login:** the same digest is rebuilt from the submitted credentials and checked with `bcrypt.compare`.
3. **Two tokens:** on success, the server signs two JWTs with `jose` and sends each as an httpOnly cookie (`SameSite=Lax`, and `Secure` in production), so client-side scripts can't read them.

   | Token | Lifetime | Contains | Secret |
   |---|---|---|---|
   | Access token | 15 minutes | user id, username, email | `JWT_SECRET` |
   | Refresh token | 30 days | user id only | `REFRESH_TOKEN_SECRET` |

4. **Protection and silent refresh:** `proxy.ts` runs on `/account/*` and `/shopping-cart/checkout`.
   - A valid access token lets the request through.
   - If the access token is missing or expired but the refresh token is valid, the proxy looks the user up, signs a new access token, and passes it to the page in the same request.
   - If neither token is valid, `/account/*` redirects to `/login`. The checkout page does not redirect from the proxy. The page asks the server who is signed in and shows a sign-in prompt, because a browser can cache a redirect that was issued while prefetching a link, and that caused a login loop.
5. **Logout:** both cookies are deleted.

Refresh tokens are stateless: they are not stored in the database and are not rotated, so a single token can't be revoked before it expires.

## Checkout and payment flow

Payments use ABA PayWay's QR API in **sandbox mode**. The browser is never trusted with money: the server works out the price from the database and asks PayWay whether the payment really happened.

1. **Cart** (`/shopping-cart`) lists the items and links to checkout.
2. **Checkout** (`/shopping-cart/checkout`) checks who is signed in (`GET /api/order`) and shows the delivery details and the total. The details are saved in the browser and checked again by the server.
3. **Pay with ABA KHQR** sends the cart to `POST /api/payway/qr`. The server:
   - recalculates the total from the database prices,
   - reuses an open QR if the same cart already has one,
   - creates a `pending` order,
   - asks PayWay for a QR code (valid for 10 minutes) and saves it on the order.
4. **Payment page** (`/shopping-cart/checkout/pay/<orderId>`) is a dynamic route. It takes the order id from the URL and shows the QR code with a countdown.
5. **Status polling:** the page asks `GET /api/payway/status?orderId=...` every 4 seconds. The server loads the order (only for its signed-in owner) and, at most once every 3 seconds, asks PayWay's Check Transaction API. If PayWay says the payment is approved and the amount matches the order, the order becomes `paid`. If the QR stays unpaid for 30 seconds after it ends, the order becomes `expired`.
6. **Receipt:** when the order is `paid`, the page clears the cart and shows a receipt that can be printed or saved.

```
Checkout page ── POST /api/payway/qr ──► create pending order + QR code (PayWay)
      │
      ▼  router.push
Payment page /pay/<orderId> ── every 4 s ──► GET /api/payway/status
                                               │ load the order from the database
                                               │ ask PayWay Check Transaction (at most every 3 s)
                                               ▼ update the order: paid / failed / expired
Page shows: QR code  ->  receipt, or "expired", or "failed"
```

Order statuses: `pending`, `paid`, `expired`, `failed`.

**Current limits**

- **Sandbox only.** The project never takes real money.
- **A real scan is still untested.** The QR code is created through the sandbox QR API. Completing a payment by scanning it with a real banking app is not tested yet, because it needs test support from the bank.
- **Polling, not callbacks.** PayWay can notify the server when someone pays, but that needs the bank to whitelist the domain. A callback route exists in the code but is not enabled.
- **A switch for the old flow.** With `NEXT_PUBLIC_PAYWAY_ENABLED=true` the checkout button creates the QR payment. Without it, the original demo "Place order" button is used.

## SEO implementation

- Site-wide defaults and a title template in `app/layout.tsx`
- `generateMetadata` on the product page for unique titles, descriptions and share images
- Product JSON-LD with name, brand, image and price
- `app/robots.ts` and `app/sitemap.ts` generated from the database. The robots file asks crawlers to stay out of the cart and checkout (both under `/shopping-cart`), account, login, register, favorites and API routes.
- Descriptive alt text and a single `<h1>` per page
- Lighthouse SEO score: 100
- **Google indexing:** the site is verified in Google Search Console and its sitemap is submitted (172 pages were discovered when it was first submitted in October 2026). The site now appears in Google search results. A fairly specific search is needed to find it, but typing the full URL is no longer required.

## Project structure

```
app/
  (root)/                    Public pages: home, categories, favorites, cart
    [slug]/                  Product detail page, addressed by slug
    shopping-cart/
      checkout/              Checkout page
        pay/[orderId]/       QR payment page, addressed by order id
  (account)/account/         Profile, orders and logout (protected)
  (auth)/                    Login and register
  api/                       login, logout, new-account, order, payway/{qr,status,callback}
  robots.ts, sitemap.ts
Backend/
  lib/                       Database, JWT, PayWay client, shared personal-info rules
  models/                    Mongoose models (product, user, order)
  services/                  Login, orders, and PayWay create / confirm / status logic
Frontend/
  components/                UI components
  hooks/                     Cart context and other hooks
  lib/                       Browser helpers (personal-info checks, money format, receipt printing)
proxy.ts                     Token check and silent refresh
```

## Getting started

**Requirements:** Node.js 20 or later and a MongoDB database (local or Atlas).

```bash
git clone https://github.com/Rysopanha-Lim-developer/The-Look-fullstack.git
cd The-Look-fullstack
npm install
```

Create a `.env.local` file in the project root (never commit it):

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret
REFRESH_TOKEN_SECRET=a_different_long_random_secret

# Optional: token lifetimes (defaults shown)
# JWT_EXPIRES_IN=15min
# REFRESH_TOKEN_EXPIRES_IN=30d

# Optional: ABA KHQR checkout (PayWay sandbox account)
SANDBOX_MERCHANT_ID=your_sandbox_merchant_id
SANDBOX_PUBLIC_KEY=your_sandbox_public_key
NEXT_PUBLIC_PAYWAY_ENABLED=true
```

Without the PayWay variables, leave `NEXT_PUBLIC_PAYWAY_ENABLED` out and checkout falls back to the demo "Place order" button. `PAYWAY_ENV` and `SANDBOX_URL` are optional and default to the sandbox. `NEXT_PUBLIC_*` values are read when the app is built, so rebuild after changing them.

Then start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

To create a production build:

```bash
npm run build
npm start
```

## What I learned

- Building and securing cookie-based JWT authentication, with short-lived access tokens and refresh tokens renewed in `proxy.ts`
- Structuring a Next.js 16 App Router project with server and client components
- Technical SEO in Next.js: the Metadata API, structured data, sitemaps and robots
- Integrating a payment API: signing requests with HMAC-SHA512, and confirming payments on the server instead of trusting the browser
- Polling with a chained `setTimeout`, and limiting how often the server calls an outside service
- Sharing one set of validation rules between the browser, the server and the payment provider's limits
- Debugging a login loop caused by a redirect that the browser cached while prefetching a link
- Deploying and debugging builds on Vercel

## Roadmap

- [ ] Rate limiting with a custom token bucket
- [x] Refresh tokens
- [ ] Unique product descriptions and descriptive URL slugs (products have no description field yet, and slugs are short codes)
- [x] Checkout flow with ABA PayWay (sandbox)
- [ ] Complete a sandbox payment by scanning the QR code with a sandbox banking app

## Author

Built by Rysopanha Lim as a learning project.