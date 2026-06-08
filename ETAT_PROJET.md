# État du projet — OffGrid Back

> Journal de bord vivant. Mis à jour à la fin de chaque session productive.
> Pour les conventions stables du projet, voir `CLAUDE.md`.

**Dernière mise à jour :** 2026-06-06

---

## 🟢 En cours

_À renseigner : où tu en es actuellement côté back._

---

## 🔜 Prochaine étape

- Connecter `ClientIntake` à des endpoints (accès via token pour le formulaire client externe).
- Endpoints de calcul de dimensionnement (logique métier des onglets A1/A2/B/C/D/E/F/G du front).

---

## ✅ Récemment terminé

### 2026-06-06 — Endpoints ProjectAppliance, ProjectSite, Client + refactor appliance

**Nouveaux endpoints :**
- `PATCH /project/site/:id` — mise à jour du site d'un projet (adresse, coordonnées, système DC, sources d'énergie…).
- `PATCH /project/:id/appliance/:applianceId` — mise à jour d'un `ProjectAppliance` (quantité, timeSlots, currentType, diversityFactorOverride).
- `DELETE /project/:id/appliance/:applianceId` — suppression d'un appareil d'un projet.
- `PATCH /client/:id` — mise à jour des infos d'un client (protégé, vérifie que le client appartient à un projet de l'utilisateur courant).

**Refactor schéma Appliance :**
- Migration `20260501173212_refactor_appliance_schema` : ajout des champs `currentType`, `voltageV`, `defaultDiversityFactor` sur le modèle `Appliance`.
- `createAppliance` accepte désormais tous ces champs.
- `GET /appliance` supporte les query params `?category=<slug>` et `?q=<search>`.

**Infrastructure :**
- `AGENTS.md` remplacé par `CLAUDE.md` (nouveau fichier d'instructions pour Claude Code).
- Collection Bruno migrée dans `bruno-off-grid/`.

### 2026-05-02 — Mise en place de la structure projet
- Création de `AGENTS.md`, `ETAT_PROJET.md`, `.claude/commands/` (`reprendre`, `handoff`, `review`), `docs/decisions/`.
- Alignement de la structure avec `offgrid-front` pour cohérence cross-projets.

### Base technique en place
- Express + TypeScript + Prisma sur PostgreSQL.
- Schéma Prisma splitté en multi-fichiers dans `prisma/schema/`.
- Middleware d'erreur global (`error.middleware.ts`).
- Zod comme source de vérité pour toute validation API.

### Modèles Prisma en place
- `User`, `Category`, `Appliance`, `ProjectAppliance`, `Project`, `ProjectSite`, `Client`, `ClientIntake`.

### API — endpoints implémentés

| Méthode | Route | Auth | Description |
|---|---|---|---|
| GET | `/appliance` | Non | Liste avec filtres `?category` et `?q` |
| POST | `/appliance` | Non | Création d'un appareil catalogue |
| GET | `/categories` | Non | Liste des catégories |
| GET | `/project` | Oui | Liste des projets de l'utilisateur |
| GET | `/project/:id` | Oui | Détail projet + appareils |
| POST | `/project` | Oui | Création projet (+ site + client optionnel) |
| PATCH | `/project/:id` | Oui | Mise à jour projet |
| DELETE | `/project/:id` | Oui | Suppression projet |
| POST | `/project/:id/appliance` | Oui | Ajout appareil à un projet (snapshot) |
| PATCH | `/project/:id/appliance/:applianceId` | Oui | Mise à jour d'un ProjectAppliance |
| DELETE | `/project/:id/appliance/:applianceId` | Oui | Suppression d'un ProjectAppliance |
| PATCH | `/project/site/:id` | Oui | Mise à jour du site d'un projet |
| PATCH | `/client/:id` | Oui | Mise à jour d'un client |

### Logique métier implémentée
- **Snapshot catalogue** : `ProjectAppliance` fige les données techniques de `Appliance` à l'ajout, pour ne pas impacter les calculs en cas de modif catalogue.
- **TimeSlots** : validation Zod via `timeSlotSchema.ts`, stockage JSON dans `ProjectAppliance.timeSlots`.
- **Auth** : `better-auth` (email/password), `authMiddleware` protège toutes les routes `/project/*` et `/client/*`.

---

## 🧱 Décisions d'architecture

| Date | Décision | Référence |
|---|---|---|
| _à formaliser_ | Zod = source de vérité (bodies, params, query, parsing) | Futur ADR `0001-zod-source-de-verite.md` |
| _à formaliser_ | Snapshot catalogue dans `ProjectAppliance` (immuabilité par design) | Futur ADR `0002-snapshot-catalogue.md` (décision métier importante !) |
| _à formaliser_ | Schéma Prisma splitté en multi-fichiers par domaine | Futur ADR `0003-prisma-multi-fichiers.md` |
| _à formaliser_ | Middleware d'erreur global (pas de try/catch dans les controllers) | Futur ADR `0004-middleware-erreur-global.md` |
| _à formaliser_ | better-auth pour l'authentification | Cohérence avec offgrid-front |
| _à formaliser_ | TimeSlots stockés en JSON (pas en table dédiée) | Compromis flexibilité vs typage |

> ℹ️ Les ADR détaillés vivent dans `docs/decisions/`. Cette table sert d'index rapide.

---

## ⚠️ Points en suspens

- **`ClientIntake`** : modèle créé mais pas encore connecté à un endpoint (token d'accès au formulaire client externe).
- **Endpoints de calcul** : pas encore implémentés (logique métier des onglets A1/A2/B/C/D/E/F/G du front).
- **Stratégie de pagination** : aucun endpoint listing n'a de pagination — à anticiper avant que les volumes deviennent problématiques.
- **Tests** : pas mentionnés — stratégie à définir (unit ? integration ? e2e ?).
