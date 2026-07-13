<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Instructions for AI coding agents working on this project. Read this entire file before making any changes or generating code.

## 1. Project Overview

**Coffee Shop Inventory Management System** — a stock management system for a coffee shop's raw materials. Tracks what comes in, what goes out, current stock levels, and low-stock alerts.

This is a **showcase/learning project** to demonstrate a fullstack Next.js App Router build, focused on **Server Actions only — no API Routes**. No UI has been designed yet — the agent is responsible for building all UI according to the Design System in section 9.

## 2. Tech Stack

Next.js 15 (App Router) + TypeScript strict · PostgreSQL/SQLite + Prisma · NextAuth.js v5 (Credentials) · Zod · React Hook Form + `@hookform/resolvers/zod` · shadcn/ui + Tailwind · Recharts · bcryptjs · In-app notifications (no WebSocket/Email/Cron)

## 3. Setup & Commands

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
npm run build
npm run type-check
npm run lint
```

Run `type-check` and `lint` successfully before every commit.

## 4. Project Structure

```
src/
├── app/(auth)/login/  (main)/{dashboard,products/[id],stock-in,stock-out,
│      history,notifications,admin/{categories,units,reason-types,users,audit-logs}}
├── actions/            # Server Actions, one file per domain
├── lib/{prisma,auth,session,utils/,validations/}.ts
├── components/{ui,layout,products,stock-movement,dashboard,notifications,admin}/
└── middleware.ts
```

`admin/` has its own `layout.tsx` that checks role · full page-by-page spec lives in `docs/pages-spec.md`

## 5. Core Architectural Rules (never violate)

1. Never create API Routes for the client to call — all logic goes through Server Actions in `actions/` only.
2. Every Server Action must validate input with Zod before touching the database (there is no API layer filtering input for you).
3. Never edit or delete a `StockMovement` record once it's saved — if something's wrong, create a new "adjustment" entry instead.
4. Master Data and User records use **soft delete only** (`isActive: false`) — never hard delete.
5. Before deactivating a Category/Unit/ReasonType, check whether any other active record still references it.
6. Every Server Action must re-check the caller's role server-side, even if the UI already hides the button — use `requireAdmin()`.
7. Stock in/out must update `currentStock` and insert the `StockMovement` together inside `prisma.$transaction()`.
8. Stock-out must re-check available quantity server-side — never trust a client-side check alone.

## 6. Data Model Conventions

**Snapshot vs Reference** in `StockMovement`:
- `quantity`, `unitSnapshot`, `costSnapshot` → snapshot only, never derive from the Product's current values.
- Product/category/reason/user names → store both the FK (normal display) and a snapshot (fallback if the source record is later deactivated).
- `productId`, `reasonTypeId`, `userId` → always kept as references.


## 7. Role & Permission Rules

| Role | Permissions |
|---|---|
| ADMIN | Manage Master Data, see cost/stock value, manage Users, view Audit Log, receive notifications |
| STAFF | Record stock in/out, view products + full history, but **cannot see cost data**, cannot edit Master Data |

**Field-level permission:** when Staff query product/movement data, never `select` the `cost`/`costSnapshot` fields from the DB at all — don't just hide them in the UI.

**Defense in depth, 3 layers (all required):** `middleware.ts` checks login → `admin/layout.tsx` checks role → **the Server Action itself re-checks before touching the DB.**

## 8. Clean Code: Component Decomposition

Never put everything in a single `page.tsx`:
- Any JSX block with a clear, self-contained purpose (a summary card, a table row, a form, a filter bar) → extract into its own component under `components/<domain>/`.
- Components reused across pages (`LowStockBadge`, `ConfirmDialog`, `DataTable`) → live in `components/ui/` or `components/shared/`.
- Complex forms (e.g. `StockMovementForm`) → take props to control behavior (`type="IN"|"OUT"`) instead of duplicating the form.
- **Rule of thumb:** a file over ~150 lines, or JSX nested more than 3-4 levels deep, is a signal to split it up.

## 9. Clean Code: Utility Function Reuse

Never copy-paste the same logic in multiple places:
- Logic used in more than one place (currency/date formatting, low-stock checks) → extract into a pure function under `lib/utils/` (split by category, e.g. `currency.ts`, `date.ts`, `stock.ts`).
- Repeated permission-check logic → belongs in `lib/session.ts` only.
- Zod schemas shared by both client and Server Action → write once in `lib/validations/`, import on both sides.
- **Rule of thumb:** the second time you write the same logic, stop and extract a function — don't let it reach a third copy.

## 10. Coding Conventions

- TypeScript strict mode always on; never use `any`.
- Server Actions return a consistent shape: `{ success, message?, data? }` for use with `useActionState`.
- Name action/validation files by domain (`actions/product.ts` pairs with `lib/validations/product.schema.ts`).
- Queries must always specify `select` with only the fields actually used — never call `findMany()` with no selection.
- Read-only pages should be Server Components that fetch data directly — no need to go through a Server Action.
- Every mutation must call `revalidatePath()` for every page it affects.

## 11. Notification Logic

- A notification is created only when `stockOutAction` causes `currentStock` to drop below `reorderPoint`.
- Only fire when stock has *just* crossed below the threshold — don't re-notify if it was already below it.
- Notifications go to every User with role = ADMIN only.
- Always snapshot `stockAtAlert`/`reorderPointAtAlert` on the record.
- No WebSocket/polling needed — loading the unread count via a Server Component on navigation is enough.

## 12. UI Design System — "Warehouse Console" (Compact)

Dark, industrial, dense, built for scanning data fast — not a consumer landing page.

```css
--bg-base:#1A1D1B; --bg-surface:#242824; --bg-surface-hover:#2C302B; --border:#383D38;
--text-primary:#E8E6DF; --text-secondary:#9C9A91; --accent:#C9822E;
--status-ok:#4E9A5C; --status-warning:#B84C3E; --status-info:#4C7EA8;
```

- Fonts: **Inter** for headings/body, **IBM Plex Mono** for numbers/SKUs/timestamps in tables.
- Density: tight cell padding (`py-1.5 px-3`), `rounded-sm`/`rounded-none`, hairline borders between rows.
- Signature: a thin (2-3px) status stripe on the left edge of table rows (green = normal, red = low stock) — use consistently across every table in the app.
- Badges: dot + faint border for stock status; solid, square-cornered fill for IN/OUT type.
- Avoid: cream + terracotta palettes, decorative gradients, unnecessary animation — must be responsive down to tablet width and have a visible focus state.
These are registered via the `@theme` directive in `globals.css` (Tailwind v4), e.g. `--color-bg-base: #1A1D1B;` — Tailwind auto-generates utilities like `bg-bg-base`, `text-status-warning`. Never reference these values via arbitrary `[...]` syntax.

## 13. Things to Avoid

- API Routes for client use, WebSocket/SSE/real-time infrastructure
- Hard-deleting any data, editing/deleting saved `StockMovement`/`AuditLog` records
- `findMany()`/`findUnique()` without a `select`
- Inline role checks duplicated across files (use `lib/session.ts`)
- Duplicated JSX/logic instead of following sections 8-9
- Default AI design patterns (cream+terracotta, black+neon, broadsheet) — use Warehouse Console only
- Adding dependencies outside the stack listed in section 2 without good reason
- Tailwind arbitrary values (e.g. `bg-[#1A1D1B]`, `text-[15px]`) — only use tokens registered in `@theme` (see section 12); if a needed token doesn't exist yet, add it to `@theme` first rather than reaching for an arbitrary value