# VMS (Vihara Management System)

Next.js 16 app (App Router) for managing a Buddhist temple — members, items, campaigns, gallery, posts. MySQL via Prisma, NextAuth v4 credentials, Tailwind CSS v4, Ant Design v6.

## Commands

```bash
npm run dev          # dev server on localhost:3000
npm run build        # production build
npm run lint         # eslint (flat config, next core-web-vitals + prettier)
npm run generate     # prisma generate
npm run migrate      # prisma migrate dev --skip-seed
npm run push         # prisma db push (no migration file)
npm run studio       # prisma studio
npm run reset        # prisma migrate reset --skip-seed
```

`npm run postinstall` runs `prisma generate` automatically on `npm install`.

## Project structure

```
src/
  app/                # Next.js App Router
    (public)/         # Public pages (home, gallery, post, campaign, paritta, profile)
    (admin)/          # Admin pages (protected by Navigation component)
    (auth)/           # Auth pages (signin)
    api/              # API routes
      admin/          # CRUD: each entity has route.ts files
      auth/[...nextauth]/
      campaign/
      gallery/
      post/
    layout.tsx        # Root layout (providers, metadata, styles)
    providers.tsx     # Client-side providers (Session, SWR, Ant Design)
    globals.css       # Global style imports
    style-registry.tsx # Ant Design SSR style extraction
  components/
    display/          # read-only presentational components (post, empty, forbidden)
    entry/            # form/input components
    general/          # shared: container, antd-icon, infinite-scroll-trigger
    navigation/       # Navigation shell + Footer (client component)
  db/
    schema.prisma     # Prisma schema (MySQL, relationMode = "prisma")
    index.ts          # singleton PrismaClient (global in dev)
    seed.ts           # permissions seed
    migrations/
  hooks/              # useListData, useOnScreen
  interfaces/         # shared TS interfaces (general, navigation)
  lib/
    auth.ts           # Shared NextAuth options
  types/              # ambient .d.ts declarations (cloudinary, slate, etc.)
  utils/              # cloudinary, constant, fetcher, ga, helper, toast
  styles/             # globals.css, antd-overrides.css, swiper.css
```

## Path aliases

`tsconfig.json` sets `baseUrl: "./src"` with these aliases:

| Alias | Maps to |
|-------|---------|
| `components/*` | `src/components/*` |
| `hooks/*` | `src/hooks/*` |
| `utils/*` | `src/utils/*` |
| `interfaces/*` | `src/interfaces/*` |
| `styles/*` | `src/styles/*` |
| `contexts/*` | `src/contexts/*` |
| `db` | `src/db` |

All imports use these bare aliases (e.g. `import { prisma } from 'db'`, `import { toast } from 'utils/toast'`).

## Code style

- **Editor**: tabs, 4-space indent, LF line endings (`.editorconfig`)
- **Prettier**: single quotes, 4-space tab width, 100 print width, trailing commas (`prettier.config.cjs`)
- **ESLint**: flat config, `eslint-config-next/core-web-vitals` + prettier, no `@next/next/no-img-element` rule
- `reactStrictMode` is **off** in `next.config.js`

## Database

- MySQL, Prisma `relationMode = "prisma"` (emulated relations, no foreign keys at DB level)
- Schema: `src/db/schema.prisma`
- Migrations: `src/db/migrations/`
- All tables use mapped names (e.g. `User` -> `users`, `Posts` -> `posts`)
- Fields use table-prefixed `@map` names (e.g. `post_id`, `user_name`)
- PrismaClient singleton in `src/db/index.ts` — dev mode attaches to `globalThis` to survive HMR

## API conventions

- All admin API routes use `getServerSession(authOptions)` — return `forbiddenResponse` (code 403) if unauthenticated
- Standard response shape: `{ code: number, message: string, data?: any }` (see `utils/constant.ts`)
- `successResponse` = `{ code: 0, message: 'success' }`
- Pagination: query params `p` (page, default 1) and `s` (size, default `DEFAULT_LIMIT = 10`)
- File upload endpoints use `formidable` with manual body parsing
- Cloudinary handles image uploads/deletions (`utils/cloudinary.ts`)
- After mutating data, admin routes use `revalidatePath()` from `next/cache` for ISR

## Auth

- NextAuth v4 with `CredentialsProvider`
- System admin: username `sysadm`, password = current date `MMDD` (dayjs)
- Regular users: bcrypt-hashed passwords in `users` table
- Permissions stored in `user_permissions`, injected into JWT/session as `Record<string, boolean>`
- Shared `authOptions` in `src/lib/auth.ts` for use with `getServerSession()`
- `Navigation` component guards admin routes — redirects to `/` if unauthenticated
- Custom pages: `/signin` for login, `/` for unauthorized redirect

## Ant Design v6

- Theme configured in `src/app/providers.tsx` via `ConfigProvider` with custom tokens (primary color `#7ea7cb`)
- `@ant-design/cssinjs` `StyleProvider` with `hashPriority="low"` wraps the app
- SSR style extraction via `src/app/style-registry.tsx` using `useServerInsertedHTML`
- Custom icon components at `src/components/general/antd-icon.tsx` (re-exports from `@ant-design/icons`)
- Custom Ant Design CSS overrides in `src/styles/antd-overrides.css`

## Tailwind CSS v4

- Uses the new v4 CSS import syntax: `@import 'tailwindcss'` in `globals.css` — there is **no** `tailwind.config.js`
- PostCSS chain: `postcss-preset-env` -> `@tailwindcss/postcss` -> `autoprefixer` -> `purgecss`
- PurgeCSS safelists: `html`, `body`, `swiper`, `swiper-wrapper`

## PWA

- Service worker at `public/vsg-worker.js`, registered with `scope: '/'`
- Dev mode unregisters the service worker and clears caches
- `manifest.json` at `public/manifest.json`

## Environment

Required env vars (see `.env.template`):

```
DATABASE_URL          # MySQL connection string
NEXTAUTH_URL          # http://localhost:3000 (dev)
NEXTAUTH_SECRET       # Generate at https://generate-secret.now.sh/32
CLOUDINARY_USER_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_GOOGLE_ANALYTICS
```

## Gotchas

- The tsconfig excludes `**/*.spect.ts` — likely a typo; ensure test files don't accidentally match this pattern
- No test framework is configured — there is no test runner, test scripts, or test directory
- Prisma `relationMode = "prisma"` means relations are emulated in the client, not enforced at the DB level
- Image uploads use `formidable` with manual body parsing in App Router route handlers
- The `Navigation` component is the app shell — all pages wrap content in `<Navigation>` and pass `active` + optional `isAdmin`/`access` props
- `reactStrictMode` is disabled — double-render issues in dev won't surface
- The app UI is in Indonesian (Bahasa Indonesia) — all user-facing text uses Indonesian language
- Swiper CSS is loaded at `src/styles/swiper.css` for carousel components
- Admin detail pages use path segments (e.g., `/admin/member/[id]`) instead of query params
- ISR pages use `generateStaticParams` instead of `getStaticPaths`
- Server components can directly access Prisma for data fetching
- Client components use `"use client"` directive and can use hooks, SWR, axios
