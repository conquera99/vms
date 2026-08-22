# App Router Migration Plan (Next.js 16)

Plan to migrate this repo from the Pages Router to the App Router. Incremental strategy: `pages/` and `app/` coexist during migration (both supported in Next 16); when a route moves to `app/`, its `pages/` counterpart is deleted in the same commit to avoid route conflicts.

---

## 1. Current state inventory

**Pages (38 files)**
- Public: `/` (client, axios + Swiper), `/gallery`, `/gallery/album/[slug]`, `/campaign/[slug]`, `/post/[slug]`, `/paritta`
- Auth: `/signin` (SSR: session redirect + csrfToken), `/profile`
- Admin (≈30, all client components): list pages (`/admin/<resource>`) + edit pages (`/admin/<resource>/detail?id=...`) for 14 resources. Auth/permission gating is client-side inside `components/navigation` (`useSession` + redirect + `access` prop check).

**API routes (45 files)**
- `/api/auth/[...nextauth]` — next-auth **v4**, credentials provider, JWT strategy, custom `session`/`jwt` callbacks enriching the token with `id`, `username`, `permissions`. Secret from `process.env.SECRET`.
- 42 admin CRUD routes — pattern: `getSession({ req })` 403-guard → Prisma → `res.json()`. Six of them (`campaign`, `buy-item`, `member`, `deceased`, `post`, `gallery/image` `save.ts`) parse multipart uploads with **formidable** + `config.api.bodyParser: false`, then upload to Cloudinary.
- 4 public read routes (`/api/post`, `/api/campaign`, `/api/campaign/participant`, `/api/gallery/{album,images}`).

**`_app.tsx`** — `SessionProvider`, `SWRConfig` (global fetcher), antd `StyleProvider`/`ConfigProvider` (custom theme) /`AntdApp`, `NextNProgress`, Vercel `Analytics`, GA pageview via `router.events`.

**`_document.tsx`** — antd cssinjs SSR style extraction, PWA meta/icons/splash links, GA gtag scripts, `lang="id"`.

**Data fetching** — public `[slug]` pages use `getStaticPaths` (`fallback: 'blocking'`, hardcoded seed paths) + `getStaticProps` (redirect if no slug). Admin pages fetch via axios + SWR against `/api/*`. Homepage fetches via axios.

**Router API usage** — 18 files `useRouter`, 16 `router.query` (mostly `detail?id=`), 1 `router.push`, 1 `router.events` (GA). No `middleware.ts`.

---

## 2. Key decisions

| Topic | Decision | Rationale |
|---|---|---|
| Migration style | Incremental, route-by-route | Both routers coexist in Next 16; ship working states per phase |
| Auth | **Upgrade to next-auth v5 (Auth.js)** | v4's App Router support is a compat layer; v5 is the native model (`auth()`, route handlers, middleware). Credentials + JWT strategy (this repo's setup) is fully supported. Fallback if v5 beta blocks us: keep v4, use `getServerSession(authOptions)` in route handlers |
| API layer | Convert to **route handlers**, keep REST + axios/SWR | Server Actions would rewrite all 30 admin pages' submit logic — out of scope. Client code keeps working unchanged |
| Admin edit pages | Keep `?id=` query params (`useSearchParams`) | `detail?id=x` pattern used everywhere incl. links; moving to `/[id]` segments changes all links — optional later cleanup |
| Uploads | Replace formidable with native `request.formData()` | Route handlers support FormData natively; drops a dependency |
| Progress bar | Replace `nextjs-progressbar` | It relies on `router.events`, which doesn't exist in App Router. Use `next-nprogress-bar` (App Router compatible) or drop for `loading.tsx` skeletons |
| antd SSR | `@ant-design/nextjs-registry` (`AntdRegistry`) in root layout | Official replacement for the `_document` cssinjs extraction; prevents FOUC |

---

## 3. Phases

### Phase 0 — Scaffold `app/` (no route changes yet) — ✅ DONE

1. ~~`npm install next-auth@beta @ant-design/nextjs-registry next-nprogress-bar`~~ — installed `@ant-design/nextjs-registry` + `next-nprogress-bar`. **`next-auth@beta` deferred to Phase 1**: installing it now would remove v4's `getSession`, which the 42 not-yet-migrated admin API routes still use
2. ✅ Created `src/app/layout.tsx` (root layout): `<html lang="id">`, full `metadata`/`viewport` exports (PWA icons, appleWebApp, twitter/og, msapplication), splash/mask-icon/font links + GA via `next/script`, `AntdRegistry hashPriority="low"` wrapping `Providers`
3. ✅ Created `src/app/providers.tsx` (`'use client'`): `SessionProvider` + `SWRConfig` + antd `ConfigProvider`/`AntdApp` + `AppProgressBar` + `Analytics`. No nested `StyleProvider` — `AntdRegistry` provides it
4. ✅ Created `src/app/not-found.tsx`; extracted the antd theme to `src/styles/antd-theme.ts` (imported by both `_app.tsx` and `providers.tsx` — single source of truth during coexistence)
5. **Verified:** `tsc` clean, lint 0 errors (font warning is a Pages-Router-rule false positive, annotated in code), build passes, and runtime smoke test: `/` still served by Pages Router unchanged; unmatched routes render the new app `not-found` with PWA metadata correctly hoisted

### Phase 1 — Auth (blocking prerequisite) — ✅ DONE (next-auth 5.0.0-beta.32)

1. ✅ `src/auth.config.ts` — edge-safe base config (no prisma): pages, callbacks, `trustHost: true`, v4 cookie names (scheme-based `__Secure-` prefix), secret resolved as `SECRET ?? NEXTAUTH_SECRET ?? AUTH_SECRET` (v4 read NEXTAUTH_SECRET implicitly; v5 only reads AUTH_SECRET — the local `.env` uses NEXTAUTH_SECRET)
2. ✅ `src/auth.ts` — full `NextAuth()` config with the credentials provider (same sysadm/db logic, prisma-backed), custom sign-in errors via `CredentialsSignin` subclasses (`user_tidak_terdaftar`, `password_tidak_sesuai` — codes land in the redirect URL like v4's thrown messages)
3. ✅ `src/app/api/auth/[...nextauth]/route.ts` exports `handlers`; deleted `pages/api/auth/[...nextauth].ts`
4. ✅ `src/proxy.ts` (not `middleware.ts` — Next 16 deprecated the middleware convention) protects `/admin/:path*` + `/profile` and bounces authed users off `/signin`
5. ✅ **Pulled forward from Phase 2:** all 44 pages API routes converted from `getSession({ req })` to a compat helper `src/utils/api-session.ts` that decodes the session cookie via v5 `decode()` — required because installing v5 removes `getSession`; the helper dies with Phase 2
6. ✅ `src/app/signin/page.tsx` (server, metadata) + `sign-in-form.tsx` (client, Suspense-wrapped `useSearchParams`, no csrfToken plumbing); deleted `pages/signin.tsx`
7. ✅ Augmented `User` interface in `src/types/next-auth.d.ts` (Session/JWT augmentation already existed)
8. **Verified at runtime:** sysadm sign-in → session cookie → `/api/auth/session` carries id/username/permissions; admin API 200 with cookie / 403 without; `/admin` → `/signin` redirect; `/signin` → `/` when authed; wrong password → `?error=CredentialsSignin&code=user_tidak_terdaftar`

### Phase 2 — Admin API routes → route handlers (before admin pages) — ✅ DONE

All 44 `pages/api/admin/**` routes converted to `app/api/admin/**/route.ts` (GET for list/detail, POST for save/remove — matching the existing axios client contract, which stays unchanged):

- `getApiSession(req)` → `await auth()`; same 403 JSON responses
- `req.query` → `searchParams.get()`; `req.body` → `await request.json()`
- The 6 formidable upload routes → native `request.formData()` + new `uploadBuffer()` helper in `utils/cloudinary.ts` (streams `Buffer.from(file.arrayBuffer())` via `upload_stream`); **formidable + @types/formidable removed from dependencies**
- `res.revalidate('/gallery/album/[slug]' | '/post/[slug]')` → `revalidatePath()` (album save, post save)
- `src/utils/api-session.ts` compat helper deleted (zero users left after conversion)
- `auth` path alias added to tsconfig
- **Verified at runtime:** sign-in → dashboard counts, list/detail, full create→update→remove cycle (incl. `$queryRaw` code generation), FormData member save, and 403 without cookie

### Phase 3 — Admin pages

All are client components — mostly mechanical (≈30 files, same list/detail pattern):

1. `src/app/admin/layout.tsx` — server component rendering `Navigation` (client) so every admin page keeps its chrome; the permission gate stays inside Navigation
2. Every page: add `'use client'`; `useRouter` (next/router) → `useRouter` + `useSearchParams` + `usePathname` (next/navigation)
   - `router.query.id` → `useSearchParams().get('id')` — pages reading search params must be wrapped in `<Suspense>` (Next 16 requirement)
   - `router.push('/admin/item')` → `router.push('/admin/item')` (same API)
3. `Link` and `Image` imports unchanged
4. `pages/admin/post/detail.tsx`: `dynamic(..., { ssr: false })` is **only legal inside a client component** — since the page becomes `'use client'`, it works as-is (Slate editor stays client-only)
5. Delete each `pages/admin/**` file as its `app/` counterpart lands. Commit per resource group (item, member, campaign, …) to keep PRs reviewable
6. **Verify per group:** list renders, create/edit/save/remove round-trips, permission gating, breadcrumb/links

### Phase 4 — Public pages

| Pages Router | App Router | Notes |
|---|---|---|
| `pages/index.tsx` | `app/page.tsx` | Keep as client component (Swiper + axios) — lowest-risk port; optionally server-componentize later |
| `pages/gallery/index.tsx` | `app/gallery/page.tsx` | Client component (SWR) |
| `pages/campaign/[slug].tsx` | `app/campaign/[slug]/page.tsx` | Server component: `generateStaticParams` (port hardcoded paths, `dynamicParams = true` replaces `fallback: 'blocking'`), Prisma call inline, `getStaticProps` redirect → `redirect()`. **`params` is a Promise in Next 16: `const { slug } = await params`** |
| `pages/post/[slug].tsx` | `app/post/[slug]/page.tsx` | Same as above + `export const revalidate = 3600` if ISR desired |
| `pages/gallery/album/[slug].tsx` | `app/gallery/album/[slug]/page.tsx` | Same pattern |
| `pages/paritta.tsx` | `app/paritta/page.tsx` | Static client page |
| `pages/profile/index.tsx` | `app/profile/page.tsx` | Client component (`useSession`) |
| `components/general/page-head.tsx` | delete | Each page exports `generateMetadata()`; `PageHead` props map 1:1 (title/desc/image). Viewport meta → `export const viewport` |

Interactive subtrees (Swiper carousel, audio player on paritta, infinite scroll) extract into `'use client'` child components; the page shell stays a server component.

**Verify:** all public routes render, static generation works (`○`/`●` in build output), metadata in `<head>`, GA pageviews fire.

### Phase 5 — Cleanup & delete Pages Router

1. Port the 4 public API routes (`post`, `campaign`, `campaign/participant`, `gallery/album|images`) to route handlers; note `gallery/album.tsx`/`images.tsx` are `.tsx` API files — become `.ts`
2. Delete `pages/` entirely, `pages/_app.tsx`, `_document.tsx`
3. Remove dead deps: `nextjs-progressbar`, `formidable`, `@types/formidable`
4. GA pageview: `router.events` is gone — small client component using `usePathname()` + `useEffect` calling `pageview()`
5. Full sweep: `grep -r "next/router"` → 0 hits; `grep -r "getSession\|getServerSession"` → 0 hits
6. **Verify:** `tsc --noEmit`, `npm run build`, `npm run lint`, full manual pass: sign-in → admin CRUD → public pages → PWA install banner → uploads (Cloudinary) → analytics

---

## 4. Codebase-specific gotchas

- **`params`/`searchParams` are Promises** in Next 16 — must `await` in server components; `useSearchParams()` in client components needs a `<Suspense>` boundary
- **antd is client-only** — any page using antd components must be (or import) a client component. `AntdRegistry` in the root layout replaces the `_document` cssinjs extraction
- **The `ConfigProvider.config({ holderRender })` call** in `_app.tsx` (for static message/toast holders) moves into the client providers component
- **`next/dynamic` with `ssr: false`** only works in client components — all admin pages will be client components, so this is fine
- **Route conflicts:** `/app` wins over `/pages` for the same path — always delete the old page file in the same change
- **`getSession({ req })` (from `next-auth/react`) does not work in App Router server code** — everything server-side goes through v5's `auth()`
- **API `config` exports** (`bodyParser: false`) don't exist in route handlers — just remove them
- **SWR global fetcher config** must live in a client provider (SWRConfig can't be a server component)
- **PWA**: manifest/splash `<link>`s → `metadata.manifest` + `metadata.appleWebApp` icons; the service worker file in `public/` and its registration component need no changes

## 5. Rollback

Each phase lands as separate commits (or PRs) on `migrate-to-app`. Because the old router keeps working until Phase 5, any phase can be reverted independently by deleting the `app/` routes it added and restoring the deleted `pages/` files from git.

## 6. Rough effort

| Phase | Scope | Estimate |
|---|---|---|
| 0 | Scaffold layout/providers | 0.5 day |
| 1 | Auth v5 + middleware | 0.5–1 day |
| 2 | 42 admin route handlers | 1 day (mechanical) |
| 3 | ~30 admin pages | 1–1.5 days (mechanical, repetitive) |
| 4 | 8 public pages + metadata | 1 day |
| 5 | Cleanup, public APIs, sweep | 0.5 day |

Total ≈ 4.5–5.5 focused days. Phases 2 and 3 are highly repetitive and safe to batch-convert per resource group.
