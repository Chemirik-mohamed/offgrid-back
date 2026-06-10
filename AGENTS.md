# AGENTS.md

This file provides durable instructions for Codex when working in this repository.
According to the official Codex documentation, the default recognized filename is `AGENTS.md`, and instructions closer to the current working directory take priority.

## Project Context

Backend API for the OffGrid project, an application for sizing solar/off-grid energy systems.
This backend exposes a REST API consumed by `offgrid-front` on `http://localhost:5174`.

## Technical Stack

- **Runtime**: Node.js + TypeScript (ESM modules)
- **Dev**: `tsx` in watch mode
- **HTTP framework**: Express v5
- **Database**: PostgreSQL via the `pg` driver
- **ORM**: Prisma v7 (schema split by domain, client generated in `src/generated/prisma/`)
- **Authentication**: Better Auth (`better-auth`)
- **Validation**: Zod v4
- **Quality**: Biome (lint + format, replaces ESLint/Prettier)

## Important Commands

```bash
npm run dev          # start in watch mode (tsx)
npm run build        # compile TypeScript
npx biome check src  # lint + format check on source code
npm run seed         # seed the database (tsx prisma/seed.ts)
npm run reset        # prisma migrate reset (resets the database)
npx prisma generate  # regenerate the Prisma client
npx prisma migrate dev --name <name>  # create a new migration
npx prisma studio    # visual database UI
```

Prefer `npm run build` after TypeScript changes. Use `npx biome check src` to verify style and simple errors. Do not run `npm run reset` without an explicit request because it resets the database.

## Architecture

### Request Flow

```
Client → src/app.ts → src/routes/index.ts → [authMiddleware?] → controller → prisma → database
                                                                                 ↓
                                                        src/middlewares/error.middleware.ts
```

### Route Structure (`/api`)

| Prefix | Authentication | File |
|---|---|---|
| `/api/auth/*` | — (handled directly by Better Auth) | `src/lib/auth.ts` |
| `/api/appliance` | No (public) | `src/routes/appliance.routes.ts` |
| `/api/categories` | No (public) | `src/routes/category.routes.ts` |
| `/api/project` | Yes (`authMiddleware`) | `src/routes/project.routes.ts` |
| `/api/client` | Yes (`authMiddleware`) | `src/routes/client.routes.ts` |
| `/api/intake` | No (public token) | `src/routes/intake.routes.ts` |

**Important**: Better Auth intercepts `/api/auth/{*splat}` **before** `express.json()` through `toNodeHandler`. All other routes are registered after that.

### Authentication

`authMiddleware` calls `auth.api.getSession()` and injects `req.user` (typed through `src/types/express.d.ts` from the Better Auth type). Every protected route can access `req.user.id`.

The `intake` routes are public but secured by a `ClientIntake.accessToken` token. They must always verify the token, expiration, and `submittedAt` before returning data.

### Error Handling

`errorMiddleware` (`src/middlewares/error.middleware.ts`) centrally handles:
- `P2002` (unique constraint) → 409 with a business message based on the affected field
- `P2025` (not found) → 404
- `PrismaClientValidationError` → 400

Controllers pass all unhandled errors to `next(error)`.

### Business Domain — Key Models

- **Project**: belongs to a `User`, can have a `Client`, a `ProjectSite` (1-1), and multiple `ProjectAppliance` records. Project names are unique per user (`@@unique([userId, name])`).
- **ProjectAppliance**: join table between `Project ↔ Appliance`. Contains user data (`quantity`, `timeSlots`, `currentType`) **and a frozen snapshot** of the appliance technical characteristics at the time it is added (`voltageVSnapshot`, `unitPowerWSnapshot`, etc.). This snapshot is used for calculations and does not change if the catalog evolves.
- **ProjectSite**: geographic and technical site data (coordinates, DC bus voltage, autonomy, energy sources).
- **ClientIntake**: unique access token allowing a client to fill in their information (`CLIENT_PENDING → CLIENT_FILLED` flow).
- **Appliance**: catalog managed by seed data. Technical fields (`unitPowerW`, `startupPowerW`, etc.) must not be edited manually.

### Prisma Structure

The schema is split by domain in `prisma/schema/`:
- `prisma/schema/schema.prisma` — datasource + generator (output → `src/generated/prisma`)
- `prisma/schema/auth.prisma` — User, Session, Account, Verification (managed by Better Auth)
- `prisma/schema/client.prisma` — Client, ClientIntake
- `prisma/schema/project.prisma` — Project, ProjectSite (+ ProjectStatus, AccessType, lightningRisk enums)
- `prisma/schema/appliance.prisma` — Appliance, ProjectAppliance, Category (+ CurrentType enum)

### `timeSlots` — JSON Format

`ProjectAppliance.timeSlots` is a `Json` field validated by `timeSlotSchema` (`src/schemas/timeSlotSchema.ts`). Each slot has: `label` (enum: `morning | noon | evening | night | continuous`), `from`, and `to` (ISO time format `HH:MM`).

## Conventions

- All modules use **ESM** (`import/export`, no `require`)
- Input validation is **always done with Zod** before any processing
- Business TypeScript types are **inferred from Zod schemas** (`z.infer<typeof schema>`) and never written manually
- Zod v4: use `z.treeifyError(error)` to format errors, not `error.format()`
- The linter/formatter is **Biome**; do not configure ESLint or Prettier
- Source code lives in `src/`. The `dist/` folder contains generated build output and must not be edited by hand.
- Keep controllers simple: validate params/body/query, call Prisma, return a response, then pass unhandled errors to `next(error)`.

## Collaborative Workflow

- Before implementing a feature, bug fix, or non-trivial code change, first discuss the approach with the user and wait for explicit validation.
- Explain the proposed implementation in simple terms so the user can learn from the process.
- Clearly list the files that are likely to be read or modified before starting the implementation.
- Clarify who will do what: what Codex will implement, what the user may want to code themselves, and what should be delegated to Codex.
- If the user wants to implement part of the feature themselves, guide them step by step instead of taking over.
- Keep the workflow visible: describe the next actions, why they are needed, and what each action is expected to change.
- For small, obvious, and explicitly delegated tasks, Codex may proceed directly, but should still summarize what changed afterward.
- Do not use this workflow rule to weaken the existing safety, validation, security, or code quality rules in this file.

## Validation Before Finishing

- After TypeScript changes, run `npm run build`.
- To check lint and formatting, run `npx biome check src`.
- The project does not currently have a `test` script in `package.json`; do not invent a test command.
- If a command cannot be run, explain why and mention the remaining risk.

## Important Rules

- Never write Prisma migrations by hand; always use `prisma migrate dev`
- Do not modify files in `prisma/schema/` without an explicit reason
- Every Express route must validate its body/params with Zod before touching the database
- Do not introduce new dependencies without an explicit request
- The Prisma client is in `src/generated/prisma/`; do not import directly from `@prisma/client`
- Never display or copy values from `.env` or other secret files.
- Respect existing worktree changes: do not revert them without an explicit request.
