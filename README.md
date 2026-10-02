# The Look

A full-stack ecommerce demo for men's, women's and kids' clothing, shoes and accessories, built with Next.js 16 to practice full-stack development.

**Live demo:** https://thelook.rysopanha.com

> **Demo project.** This is not a real store. Products, brands, prices and contact details are placeholders for learning purposes. No real payments are taken.

<!-- Add a screenshot or short GIF here, e.g. ![Home page](./docs/home.png) -->

## Features

- **Product catalog** with category browsing (men, women, kids; shoes, pants, accessories)
- **Product detail pages** with one page per product, addressed by slug
- **Shopping cart** built with React Context and a custom hook (in-memory, lives for the session)
- **Favorites** saved in the browser
- **Authentication** using JWT (HS256) delivered in an httpOnly cookie
- **Route protection** with a lightweight `proxy.ts`, with verification logic kept in separate service files
- **SEO** with per-page metadata, Open Graph tags, `robots.txt`, `sitemap.xml` and Product structured data (JSON-LD)

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Cache Components), React 19 |
| Language | TypeScript |
| Database | MongoDB with Mongoose |
| Validation | Zod |
| Auth | bcrypt, jose (JWT) |
| Styling | Tailwind CSS |
| Hosting | Vercel |

## How authentication works

1. **Register:** the username, email and password are combined, hashed with SHA-256, and the digest is then hashed with bcrypt. Only that hash is stored, and there is no separate password field.
2. **Login:** the same digest is rebuilt from the submitted credentials and checked with `bcrypt.compare`.
3. **Session:** on success, the server signs a JWT containing only the user id and email using `jose`, and sends it as an httpOnly cookie so client-side scripts can't read it.
4. **Protection:** `proxy.ts` checks the token before requests reach protected routes.

## SEO implementation

- Site-wide defaults and a title template in `app/layout.tsx`
- `generateMetadata` on the product page for unique titles, descriptions and share images
- Product JSON-LD with name, brand, image and price
- `app/robots.ts` and `app/sitemap.ts` generated from the database
- Descriptive alt text and a single `<h1>` per page
- Lighthouse SEO score: 100

## Project structure

```
app/                 Routes, layout, robots.ts, sitemap.ts
  [slug]/            Product detail page
Backend/
  lib/               Database connection
  models/            Mongoose models
Frontend/
  components/        UI components
  hooks/             Cart context and other hooks
proxy.ts             Request checks (kept light)
```

## Getting started

**Requirements:** Node.js 20 or later and a MongoDB database (local or Atlas).

```bash
git clone https://github.com/Rysopanha-Lim-developer/The-Look-fullstack.git
cd The-Look-fullstack
npm install
```

Create a `.env.local` file in the project root:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_secret
```

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

- Building and securing cookie-based JWT authentication
- Structuring a Next.js 16 App Router project with server and client components
- Technical SEO in Next.js: the Metadata API, structured data, sitemaps and robots
- Deploying and debugging builds on Vercel

## Roadmap

- [ ] Rate limiting with a custom token bucket
- [ ] Refresh tokens
- [ ] Unique product descriptions and descriptive URL slugs
- [ ] Checkout flow

## Author

Built by Rysopanha Lim as a learning project.