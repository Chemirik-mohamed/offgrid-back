# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexte du projet
API backend du projet OffGrid — application de dimensionnement de systèmes d'énergie solaire/autonome.
Ce backend expose une API REST consommée par `offgrid-front` (sur `http://localhost:5174`).

## Stack technique

- **Runtime** : Node.js + TypeScript (ESM modules)
- **Dev** : `tsx` en watch mode
- **Framework HTTP** : Express v5
- **Base de données** : PostgreSQL via driver `pg`
- **ORM** : Prisma v7 (schéma splitté par domaine, client généré dans `src/generated/prisma/`)
- **Authentification** : Better Auth (`better-auth`)
- **Validation** : Zod v4
- **Qualité** : Biome (lint + format — remplace ESLint/Prettier)

## Commandes importantes

```bash
npm run dev          # démarrage en watch mode (tsx)
npm run build        # compilation TypeScript
npm run seed         # seed de la base de données (tsx prisma/seed.ts)
npm run reset        # prisma migrate reset (réinitialise la BDD)
npx prisma generate  # regénérer le client Prisma
npx prisma migrate dev --name <nom>  # nouvelle migration
npx prisma studio    # interface visuelle base de données
```

## Architecture

### Flux d'une requête

```
Client → app.ts → routes/index.ts → [authMiddleware?] → controller → prisma → BDD
                                                                    ↓
                                                           errorMiddleware (global)
```

### Structure des routes (`/api`)

| Préfixe | Authenfication | Fichier |
|---|---|---|
| `/api/auth/*` | — (géré par Better Auth directement) | `src/lib/auth.ts` |
| `/api/appliance` | Non (public) | `appliance.routes.ts` |
| `/api/categories` | Non (public) | `category.routes.ts` |
| `/api/project` | Oui (`authMiddleware`) | `project.routes.ts` |
| `/api/client` | Oui (`authMiddleware`) | `client.routes.ts` |

**Important** : Better Auth intercepte `/api/auth/{*splat}` **avant** `express.json()` via `toNodeHandler`. Toutes les autres routes passent après.

### Authentification

`authMiddleware` appelle `auth.api.getSession()` et injecte `req.user` (typé via `src/types/express.d.ts` depuis le type Better Auth). Toute route protégée a accès à `req.user.id`.

### Gestion des erreurs

`errorMiddleware` (`src/middlewares/error.middleware.ts`) gère centralement :
- `P2002` (unique constraint) → 409 avec message métier selon le champ concerné
- `P2025` (not found) → 404
- `PrismaClientValidationError` → 400

Les controllers passent toutes les erreurs non gérées via `next(error)`.

### Domaine métier — modèles clés

- **Project** : appartient à un `User`, peut avoir un `Client`, un `ProjectSite` (1-1), et plusieurs `ProjectAppliance`. Nom unique par utilisateur (`@@unique([userId, name])`).
- **ProjectAppliance** : table de jonction `Project ↔ Appliance`. Contient les données utilisateur (`quantity`, `timeSlots`, `currentType`) **et un snapshot figé** des caractéristiques techniques de l'appareil au moment de l'ajout (`voltageVSnapshot`, `unitPowerWSnapshot`, etc.). Ce snapshot est utilisé pour les calculs et ne change pas si le catalogue évolue.
- **ProjectSite** : données géographiques et techniques du site (coordonnées, tension DC bus, autonomie, sources d'énergie).
- **ClientIntake** : token d'accès unique pour qu'un client remplisse ses informations (flux `CLIENT_PENDING → CLIENT_FILLED`).
- **Appliance** : catalogue géré par seed. Les champs techniques (`unitPowerW`, `startupPowerW`, etc.) ne doivent pas être modifiés manuellement.

### Structure Prisma

Le schéma est découpé par domaine dans `prisma/schema/` :
- `schema.prisma` — datasource + generator (output → `src/generated/prisma`)
- `auth.prisma` — User, Session, Account, Verification (géré par Better Auth)
- `client.prisma` — Client, ClientIntake
- `project.prisma` — Project, ProjectSite (+ enums ProjectStatus, AccessType, lightningRisk)
- `appliance.prisma` — Appliance, ProjectAppliance, Category (+ enum CurrentType)

### `timeSlots` — format JSON

`ProjectAppliance.timeSlots` est un champ `Json` validé par `timeSlotSchema` (`src/schemas/appliances/timeSlotSchema.ts`). Chaque slot a : `label` (enum : `morning | noon | evening | night | continuous`), `from` et `to` (format ISO time `HH:MM`).

## Conventions

- Tous les modules sont en **ESM** (`import/export`, pas de `require`)
- La validation des entrées se fait **toujours via Zod** avant tout traitement
- Les types TypeScript métier sont **inférés depuis les schémas Zod** (`z.infer<typeof schema>`) — jamais écrits à la main
- Zod v4 : utiliser `z.treeifyError(error)` pour formater les erreurs (pas `error.format()`)
- Le linter/formatter est **Biome** — ne pas configurer ESLint ou Prettier

## Règles importantes

- Ne jamais écrire de migration Prisma à la main — toujours passer par `prisma migrate dev`
- Ne pas modifier les fichiers `prisma/schema/` sans raison explicite
- Toute route Express doit valider son body/params avec Zod avant de toucher la base de données
- Ne pas introduire de nouvelles dépendances sans demande explicite
- Le client Prisma est dans `src/generated/prisma/` — ne pas importer depuis `@prisma/client` directement
