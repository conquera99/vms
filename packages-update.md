# Package Updates — Required Changes Analysis

Analysis of the dependency upgrades in `package.json` (diff vs. last commit), with required code/config changes.

## Summary of version changes

| Package | From | To | Impact |
|---|---|---|---|
| `prisma` / `@prisma/client` | 6.19.3 | **7.9.1 (major)** | 🔴 Breaking — see below |
| `typescript` | 5.9.3 | **6.0.3 (major)** | 🟡 Verify build |
| `swiper` | 12.1.4 | **14.1.0 (2 majors)** | 🟡 Verify carousel |
| `slate-hyperscript` | 0.100.0 | 0.125.0 | 🟡 Minor risk |
| `next` / `eslint-config-next` | 16.2.6 | 16.3.2 | 🟢 Minor |
| `antd` | 6.4.2 | 6.6.1 | 🟢 Minor |
| `slate` / `slate-react` | 0.124.x | 0.126.x | 🟢 Minor |
| others (axios, dayjs, eslint tooling, types, etc.) | — | — | 🟢 Patch/minor |

Also removed: `"vms": "file:"` self-dependency (was unnecessary — good).

---

## 🔴 Prisma 6 → 7 (the big one)

Official guide: https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7

### 1. Generator must be switched & `output` is now required

`src/db/schema.prisma` currently uses:

```prisma
generator client {
    provider = "prisma-client-js"
}
```

`prisma-client-js` is deprecated and will be removed. Switch to the new `prisma-client` generator, which **requires an explicit `output`** (no longer generated into `node_modules`):

```prisma
generator client {
    provider = "prisma-client"
    output    = "../generated/client"   // relative to src/db/schema.prisma
}
```

### 2. Change imports from `@prisma/client` to the generated path

With the new generator, imports come from the generated output directory:

- `src/db/index.ts` — `import { PrismaClient } from '@prisma/client'`
- `src/db/seed.ts` — `import { PrismaClient } from '@prisma/client'`

Change both to e.g. `import { PrismaClient } from '../generated/client/client'` (or add a `db/*` tsconfig path alias to keep imports clean). Also add the generated folder to `.gitignore` (or commit it, per team preference).

### 3. Driver adapter is now required

Prisma 7 has no built-in query engine; every database needs a driver adapter. The datasource is MySQL, so install and use the MariaDB adapter:

```bash
npm install @prisma/adapter-mariadb
```

Then update `src/db/index.ts`:

```ts
import { PrismaMariadbAdapter } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/client/client';

const adapter = new PrismaMariadbAdapter({ host, port, user, password, database, connectionLimit: 5 });
// or construct from DATABASE_URL

export const prisma = global.prisma ?? new PrismaClient({ adapter, log: ['query'] });
```

Apply the same change in `src/db/seed.ts`. Note: connection-pool defaults now come from the underlying driver (`mariadb`), which may differ from v6 — review pool size for your production DB.

### 4. Datasource `url` in schema is deprecated

`src/db/schema.prisma` has `url = env("DATABASE_URL")` in the datasource block. This is deprecated in v7 — the URL belongs in `prisma.config.ts`, which this repo already configures correctly (`datasource.url`). Remove the `url` line from the schema and keep:

```prisma
datasource db {
    provider     = "mysql"
    relationMode = "prisma"
}
```

`relationMode = "prisma"` (emulated FKs) is still supported — no change needed there.

### 5. Removed CLI flags & behavior — update npm scripts

`package.json` scripts use removed flags:

```json
"migrate": "prisma migrate dev --skip-seed",   // ❌ --skip-seed removed
"reset": "prisma migrate reset --skip-seed",   // ❌ --skip-seed removed
```

Change to:

```json
"migrate": "prisma migrate dev",
"reset": "prisma migrate reset"
```

Auto-seeding after `migrate dev`/`migrate reset` was removed entirely, so `--skip-seed` is unnecessary anyway (run `prisma db seed` explicitly if needed). Also note `migrate dev` / `db push` no longer auto-run `prisma generate` — the existing `postinstall: prisma generate` covers installs, but add `prisma generate` to your workflow after schema edits.

### 6. Other v7 removals to check

- **`$use` middleware removed** — migrate to query extensions if used anywhere (not found in current code ✅).
- **Metrics removed** — not used ✅.
- **Prisma ships as ESM** — Next.js handles the transpilation, but if any plain Node script (e.g. seed run via `ts-node`/`node`) fails on import, it may need ESM-compatible runner (e.g. `tsx`).
- **Node.js ≥ 20.19 required** — current environment is Node 24 ✅.
- **Mapped enums** reverted to v6 behavior — no enums in schema ✅.

### 7. `errorFormat` option

`src/db/index.ts` passes `errorFormat: 'pretty' | 'minimal'`. Verify this option still applies with the new generator (it's not listed among removed APIs, but test that client instantiation doesn't warn).

---

## 🟡 TypeScript 5.9 → 6.0

Major version. The current `tsconfig.json` (target es6, `moduleResolution: bundler`, `strict`) uses no removed flags, so it should mostly pass — but:

1. Run `npx tsc --noEmit` and the Next build to catch new diagnostics (TS 6 turns some former deprecation warnings into errors).
2. `@typescript-eslint/*` 8.67 officially supports TS <6.0 ranges — if the linter warns about unsupported TypeScript version, bump `typescript-eslint` when a TS6-compatible release lands, or pin TS 5.9.x temporarily.

## 🟡 Swiper 12 → 14 (two major versions)

Usage is minimal (`src/pages/index.tsx`: `swiper/react`, `swiper/modules` Navigation, `swiper/css` imports) — these APIs are stable across v13/v14, but v13+ removed legacy module exports and changed some CSS internals. **Manually test the homepage carousel** (navigation arrows, styling).

## 🟡 slate-hyperscript 0.100 → 0.125

Large jump within 0.x (no semver guarantees). No imports of `slate-hyperscript` found in `src/` — if it's only used for tests, consider removing it or upgrading alongside `slate` 0.126 (already done). `slate`/`slate-react` 0.124 → 0.126 are minor and compatible.

## 🟢 Low-risk updates

- **next 16.2.6 → 16.3.2** (patch-level minor): no action.
- **next-auth 4.24.15**: patch. Note: `@next-auth/prisma-adapter` is still installed but `PrismaAdapter` is not used anywhere (credentials provider only via `src/pages/api/auth/[...nextauth].ts`) — it can be removed, which also avoids any Prisma 7 type incompatibility in that package.
- antd, axios, dayjs, cloudinary, react-icons, swr, tailwindcss, postcss, prettier, eslint plugins: minor/patch — no action expected.

---

## Recommended action checklist — ✅ IMPLEMENTED

1. [x] `npm install @prisma/adapter-mariadb` — done (also removed unused `@next-auth/prisma-adapter` and `slate-hyperscript`)
2. [x] Update `src/db/schema.prisma`: generator → `prisma-client` with `output = "../generated/client"` (→ `src/generated/client`); dropped `url` from datasource
3. [x] Update `src/db/index.ts` and `src/db/seed.ts`: import from `../generated/client/client`, instantiate with `new PrismaMariaDb(process.env.DATABASE_URL)` adapter (note: the exported class is `PrismaMariaDb`, and it accepts a plain connection string)
4. [x] Added `/src/generated` to `.gitignore` and `src/generated/**` to ESLint ignores
5. [x] Fixed `migrate`/`reset` npm scripts (removed `--skip-seed`)
6. [x] `npx prisma generate` + `prisma validate` pass; `migrate status` reports database up to date (29 migrations)
7. [x] `npx tsc --noEmit` passes — **required tsconfig change**: TS 6 deprecates `baseUrl` (TS5101), so `baseUrl` was removed, existing `paths` were made relative (`./src/...`), and a `"db": ["./src/db"]` entry was added (the codebase's bare `from 'db'` imports previously resolved only via `baseUrl`)
8. [x] `npm run build` succeeds — SSG pages prerendered from live DB queries through the new client
9. [x] Runtime smoke test: `npx tsx --env-file=.env src/db/seed.ts` ran the permission upserts successfully through the MariaDB adapter
10. [ ] Manual test of homepage Swiper carousel in the browser (not covered by build/lint)

> Note: `prisma db seed` is not wired up in `prisma.config.ts` (`migrations.seed`). The old scripts used `--skip-seed`, so behavior is unchanged — run the seed manually with `npx tsx --env-file=.env src/db/seed.ts`.

## Sources

- [Prisma ORM 7 Upgrade Guide](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7)
- [Prisma 7.0.0 Release Notes](https://www.gitclear.com/open_repos/prisma/prisma/release/7.0.0)
- [Prisma 7 Upgrade: The Driver Adapter Path](https://medium.com/@stawils/prisma-7-upgrade-the-driver-adapter-path-that-isnt-in-the-spotlight-8b9b78ccecf3)
- [What's New in Prisma 7 and How to Upgrade](https://aysh.me/blogs/prisma-7)
