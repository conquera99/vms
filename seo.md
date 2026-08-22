# SEO Audit — vsg.nunukan.net (VSG iApp)

Date: 2026-08-22 · Scope: public pages (`/`, `/post/[slug]`, `/campaign/[slug]`, `/paritta`, `/gallery`, `/gallery/album/[slug]`, `/signin`, `/profile`) · Method: codebase review + live-site checks (robots.txt, sitemap.xml, homepage HTML).

---

## Executive Summary

**Overall: weak-to-moderate.** The technical foundation is decent (Next.js App Router, server-rendered detail pages with `generateMetadata`, `lang="id"`, HTTPS, next/image, `metadataBase` set), but the site is close to invisible to search engines for three structural reasons:

1. **The homepage ships to crawlers with no content.** Posts and campaign banners are fetched client-side (`axios` in `useEffect`), so the initial HTML contains skeletons only — no post titles, no internal links into `/post/*`. Verified live: fetching `https://vsg.nunukan.net/` returns the shell with an empty "Post Terbaru" section.
2. **No sitemap and a placeholder robots.txt.** `https://vsg.nunukan.net/sitemap.xml` returns 404; the live robots.txt is a Cloudflare "content signals" file with no `User-agent`/`Disallow`/`Sitemap` directives (crawl is allowed by default, but nothing is declared).
3. **No structured data and inconsistent metadata** — titles mix "VSG"/"VMS"/bare names, most pages have no description, and there is no canonical, no default OG image, and zero JSON-LD.

The site is a local religious institution — the highest-value SEO outcome is **local + brand searches** ("vihara nunukan", "paritta", "VSG") and **social sharing** of posts/campaigns (WhatsApp/Facebook, the dominant channels for an Indonesian congregation).

---

## 1. Indexability & Crawling

| # | Finding | Severity | Evidence |
|---|---------|----------|----------|
| 1.1 | **Home page content is client-side only.** Campaigns and posts load via `axios` after hydration; SSR HTML contains only skeleton loaders. Crawlers that don't execute JS (and most social link-preview bots — WhatsApp, Facebook, Telegram) see an empty feed. Internal links to posts exist nowhere in server HTML except the footer menu. | **Critical** | `src/app/page.tsx:51-60` (`useEffect` + axios), `src/app/gallery/view.tsx:27` (SWR) |
| 1.2 | **No `sitemap.xml`.** Dynamic routes (`/post/[slug]`, `/campaign/[slug]`, `/gallery/album/[slug]`) rely entirely on crawl discovery — and with 1.1 there are barely any entry links. | **Critical** | no `src/app/sitemap.ts`, live `/sitemap.xml` → 404 |
| 1.3 | **`robots.txt` is a Cloudflare content-signals placeholder** with no `Sitemap:` directive. Not harmful, but declares nothing. | Medium | live `https://vsg.nunukan.net/robots.txt` |
| 1.4 | **Low-value pages are indexable**: `/signin`, `/profile`, `/admin/*` (admin has no `layout.tsx` with robots metadata; pages are auth-gated client-side but URLs still return the app shell with 200). | Medium | no `robots` in any metadata export |
| 1.5 | Infinite scroll pagination (`/api/post?p=`) is invisible to crawlers — no paginated or "load more" fallback URLs. | Medium | `src/app/api/post/route.ts` |
| 1.6 | No canonical URLs anywhere; query params or trailing-slash variants can produce duplicate URLs. | Medium | no `alternates.canonical` in any page |

**Fixes:**
- Render the first page of posts + campaigns **server-side** on `/` (fetch from Prisma directly in a server component; keep infinite scroll for subsequent pages). Do the same for the gallery album list.
- Add `src/app/sitemap.ts` (posts, campaigns, albums from Prisma + static routes) and `src/app/robots.ts` (allow all, `Sitemap: https://vsg.nunukan.net/sitemap.xml`, `Disallow: /admin`, `/api`, `/signin`, `/profile`).
- Add `robots: { index: false }` metadata to signin/profile and an `src/app/admin/layout.tsx` with `robots: { index: false, follow: false }`.
- Add `alternates.canonical` per page.

## 2. Metadata

Current state (from `src/app/layout.tsx:14` and per-page exports):

| Page | Title served | Description | Notes |
|---|---|---|---|
| `/` | `VSG` | "app for vihara sasana graha nunukan" (root default) | Weak, English, lowercase; home has no own metadata (`'use client'` page) |
| `/post/[slug]` | `{absolute: data.title}` | post summary | Good — but absolute bypasses brand template; no canonical, no `article` OG type, no published time |
| `/campaign/[slug]` | `{absolute: data.title}` | campaign desc | Same as above |
| `/paritta` | `Paritta` | root default | No description; biggest missed brand query ("paritta", "paritta suci") |
| `/gallery` | `VMS: Galeri` | root default | **"VMS" is the wrong brand** (site is VSG) |
| `/gallery/album/[slug]` | album title | — | Has `generateMetadata` |
| `/signin` | `Sign In` | root default | Should be `noindex` |
| `/profile` | `VMS: Profile` | root default | Wrong brand + `noindex` |

Problems:
- **2.1 Brand inconsistency**: titles alternate between `VSG`, `VMS:`, and bare names. The root template `%s | VSG` (`layout.tsx:16`) is never used because every page opts out with `{ absolute: ... }`. **High**
- **2.2 Root description is weak and in English** while all content is Indonesian. **High**
- **2.3 No default OG image**: root `openGraph` has no `images`, so shares of `/` and `/paritta` render with no preview image (posts fall back to a 192px favicon — tiny). **High**
- **2.4 No `og:locale` (`id_ID`), `article` OG type / `published_time` on posts, and Twitter cards stay `summary` even when a large image exists.** Medium
- **2.5 `metadataBase` is set** (`https://vsg.nunukan.net`) — good; relative OG images resolve correctly. ✅

**Fixes:** write a real Indonesian description (e.g. "Situs resmi Vihara Sasana Graha Nunukan — jadwal kebaktian, paritta suci, galeri kegiatan, dan kabar vihara."); use the `%s | VSG` template everywhere (drop `absolute` except home); add a 1200×630 default OG image; add `openGraph.locale: 'id_ID'`, `type: 'article'` + dates on posts, `twitter: card: 'summary_large_image'`.

## 3. Structured Data (JSON-LD)

**None exists anywhere.** For this site the valuable types are:

| Type | Where | Why |
|---|---|---|
| `PlaceOfWorship` / `LocalBusiness` + address, geo, sameAs (socials) | root layout | Local SEO — "vihara nunukan", map knowledge panel |
| `WebSite` (+ potential SearchAction) | root layout | Brand sitelinks |
| `Article` (headline, image, datePublished, author) | `/post/[slug]` | Rich results; also feeds Bing/Facebook prefetch |
| `BreadcrumbList` | posts, albums | Breadcrumb display in SERP |
| `ImageGallery` | `/gallery/album/[slug]` | Image rich results |
| `MusicPlaylist` / `AudioObject` list | `/paritta` | Audio rich results for the 16 paritta tracks |

Severity: **Medium-High** (local entity + audio content are exactly what structured data is for).

## 4. Content, Headings & Links

- **4.1 Multiple `<h1>`s on public pages**: `Navigation` renders `<h1>VSG</h1>` (`navigation/index.tsx:323`) and `Footer` renders another `<h1>VSG</h1>` (`footer.tsx:79`) — every page with a footer has two brand h1s. Change to `<span>`/`<div>`; leave one real h1 per page (post title already has one). Medium
- **4.2 Post body serializer maps `heading-one` → `<h1>`** (`post/[slug]/page.tsx:122`), so long articles accumulate many h1s. Map to `<h2>`/`<h3>`. Medium
- **4.3 Serializer bug**: `node.udnerline` (typo) — the underline format never renders (`post/[slug]/page.tsx:105`). Content bug found during audit. Low (SEO) / worth fixing
- **4.4 Serializer links have no `rel`/`target`** and empty `href="#"` WhatsApp link in footer (`footer.tsx:51`) — a dead link on every page. Low
- **4.5 Empty/broken `alt` risk**: `BlurImage` is called with `alt={data.title}` on posts (good) and `src={data.image ?? ''}` — an empty `src` on posts without images renders a broken image element; add a fallback. Low
- **4.6 Content depth**: posts are short summaries + rich text; fine. The Paritta page is the strongest unique asset (16 named tracks, static in HTML ✅) — deserves a proper intro paragraph with target keywords ("Paritta Suci", "namakara", "mangala sutta" etc.), which also helps the audio rich results.

## 5. Performance & Technical (affects ranking + link-preview bots)

- **5.1 Fonts**: Raleway loaded via CSS `@import` inside `globals.css:1` (render-blocking chain) and **Roboto via `<link>` in `layout.tsx:116` with `display=optional` — Roboto is not used by the design**; two families shipped, one wasted. Move to `next/font/google` (self-hosted, preloaded, zero CLS) and delete the Roboto link. Medium
- **5.2 Images**: `next/image` with `remotePatterns: res.cloudinary.com` ✅, correct `sizes` on post cards ✅, `loading="eager"` on `BlurImage` (detail pages) is fine. Post-body images inside `dangerouslySetInnerHTML` are raw `<img>` — acceptable, but ensure admins upload reasonably sized files (Cloudinary transforms exist).
- **5.3 PWA/theme color mismatch**: `viewport.themeColor` is `#000000` (`layout.tsx:57`), manifest `theme_color` is `#6366F1` (indigo, `public/manifest.json`), brand color is `#7ea7cb`. Cosmetic inconsistency; unify (redesign will change these anyway — coordinate with `redesign.md` Phase 1). Low
- **5.4** `productionBrowserSourceMaps: true` — larger transfer; no SEO effect. Note only.
- **5.5** Google Analytics (gtag) present ✅; add **Google Search Console** verification + submit the sitemap once it exists (action outside the codebase).
- **5.6** Service worker precaches paritta audio for offline use ✅ (engagement, indirectly good).

## 6. Local SEO (out-of-code, high ROI for a temple)

- Create/claim **Google Business Profile** for "Vihara Sasana Graha" (address: Jl. Cut Nyak Dien RT. 15, Kel. Nunukan Tengah, Kab. Nunukan, Kalimantan Utara) — this is what actually wins "vihara nunukan" searches.
- Keep NAP (name-address-phone) identical between GBP, footer, and the `PlaceOfWorship` JSON-LD. Footer currently shows an email but **no phone number**.
- Fill the dead WhatsApp link (`footer.tsx:51`) with the real number — likely the congregation's primary contact channel.

---

## Prioritized Action Plan

| Priority | Task | Effort | Status |
|---|---|---|---|
| **P0** | Server-render home page posts + campaigns (and gallery album list) | M | ✅ Done — `src/app/page.tsx` + `src/app/view.tsx`, `src/app/gallery/page.tsx` + `view.tsx` (ISR, `revalidate = 300`) |
| **P0** | Add `src/app/sitemap.ts` + `src/app/robots.ts` (with `Sitemap:` directive) | S | ✅ Done |
| **P0** | Fix title strategy: use `%s \| VSG` template, correct `VMS:` → `VSG`, real Indonesian root description | S | ✅ Done — `SITE_DESCRIPTION` in `utils/constant.ts`, all pages use the template |
| **P1** | `noindex` for `/signin`, `/profile`, `/admin/*`; disallow in robots.txt | S | ✅ Done — page metadata + `src/app/admin/layout.tsx` |
| **P1** | Canonical URLs (`alternates.canonical`) on all public pages | S | ✅ Done |
| **P1** | JSON-LD: `PlaceOfWorship` + `WebSite` (root), `Article` + `BreadcrumbList` (posts), `ImageGallery` (albums), `MusicPlaylist` (paritta) | M | ✅ Done |
| **P1** | Default 1200×630 OG image; `og:locale id_ID`; `summary_large_image` where images exist; `article` type + dates on posts | S | ✅ Done — `public/og-default.png` generated |
| **P2** | Heading hygiene: single h1 per page, serializer `heading-one`→h2 | S | ✅ Done |
| **P2** | Fonts via `next/font`, remove unused Roboto | S | ✅ Done — Raleway via `next/font`, CSS `@import` removed |
| **P2** | Unify theme colors (layout viewport vs manifest vs brand) — fold into redesign Phase 1 | S | ✅ Done — unified to `#7ea7cb` (update again when redesign lands) |
| **P2** | Local SEO: Google Business Profile, phone in footer, working WhatsApp link | S | ⬜ Manual (needs the temple's real phone/WhatsApp number) |
| **P2** | Fix `udnerline` serializer typo; `data.image ?? ''` fallback; dead-link sweep | S | ✅ Done (typo + image fallback); ⬜ WhatsApp `href="#"` needs real number |
| **P2** | Register Search Console / Bing Webmaster, submit sitemap | S | ⬜ Manual (site owner) |

*Effort: S < half day, M = 1–2 days.*

---

## What's Already Good ✅

- `lang="id"` on `<html>`; Indonesian content consistently.
- `metadataBase` set; detail pages (post, campaign, album) all have `generateMetadata` with per-item title/description/images — WhatsApp/Facebook previews of article links already work.
- Server-rendered client components (Paritta track list, post bodies are in HTML; only *data-driven* lists are empty pre-JS).
- `next/image` + Cloudinary `remotePatterns`, sized responsive images, lazy loading where appropriate.
- Clean URLs with slugs; `notFound()` for missing records (proper 404s); HTTPS; `poweredByHeader: false`.
- `generateStaticParams` pre-renders known slugs (extend this in the sitemap work).
