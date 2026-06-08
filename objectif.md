Bien sûr ! Voici une explication claire, étape par étape, de ce que je vais faire.

---

## Ce qu'on va construire et pourquoi

En ce moment, quand un professionnel crée un projet, il doit saisir manuellement les appareils du client. L'objectif est de lui permettre de générer un lien unique qu'il envoie au client. Le client ouvre ce lien, sélectionne ses appareils, et soumet le formulaire. Le projet passe alors automatiquement en statut `CLIENT_FILLED`.

---

## Les 3 problèmes à résoudre avant de commencer

**Problème 1 — `timeSlotSchema.ts` est manquant.**
Dans le fichier `src/schemas/project/addApplianceSchema.ts`, il y a une ligne `import { timeSlotSchema } from "../appliances/timeSlotSchema.js"` — mais ce fichier n'existe pas. Le serveur plante au démarrage. Je dois le créer. Un "time slot" c'est une plage horaire, par exemple `{ startHour: 8, endHour: 20 }` pour dire qu'un appareil est utilisé de 8h à 20h.

**Problème 2 — `client.routes.ts` est manquant.**
Dans `src/routes/index.ts`, on importe `clientRouter` depuis `"./client.routes.js"` — mais ce fichier n'existe pas non plus. Je dois créer un fichier minimal qui exporte simplement un router vide, histoire que le serveur puisse démarrer.

**Problème 3 — Le modèle `ClientIntake` existe en base mais n'a aucune route ni controller.**
La bonne nouvelle : le modèle Prisma est déjà là (avec `accessToken`, `expiresAt`, `submittedAt`). Il suffit d'écrire le code qui l'utilise.

---

## Les fichiers à créer (nouveaux)

**1. `src/schemas/appliances/timeSlotSchema.ts`**
Un simple schéma Zod qui définit la forme d'une plage horaire : `{ startHour: number, endHour: number }`.

**2. `src/routes/client.routes.ts`**
Un router Express vide qui corrige l'import cassé dans `index.ts`.

**3. `src/schemas/intake/intakeSchema.ts`**
Les règles de validation pour les deux routes publiques : le paramètre `:token` (qui doit être un UUID valide) et le corps de la soumission (la liste des appareils avec quantités et plages horaires).

**4. `src/controllers/intake.controllers.ts`**
Le cœur du travail : 4 fonctions qui contiennent la logique métier —
- `generateIntake` : crée le lien (ou retourne le lien existant si déjà créé)
- `revokeIntake` : supprime le lien et remet le projet en DRAFT
- `getIntakeByToken` : retourne le formulaire public (info projet + catalogue d'appareils)
- `submitIntake` : traite la soumission du client

**5. `src/routes/intake.routes.ts`**
Les routes publiques (sans authentification) : `GET /:token` et `POST /:token/submit`.

---

## Les fichiers à modifier (existants)

**`src/routes/project.routes.ts`**
Ajouter 2 lignes pour les routes protégées (réservées au pro connecté) : `POST /:id/intake` et `DELETE /:id/intake`.

**`src/routes/index.ts`**
Ajouter 2 lignes : importer le router intake et le monter sur `/intake` **sans** le middleware d'authentification (parce que le client n'est pas connecté).

---

## Comment chaque controller fonctionne

**`generateIntake`** (professionnel connecté)
1. Vérifie que le projet lui appartient bien
2. Si un intake existe déjà pour ce projet, le retourne tel quel (pas d'erreur, pas de doublon)
3. Sinon, crée un `ClientIntake` en base — Prisma génère automatiquement un UUID pour le token
4. Met le projet en `CLIENT_PENDING`
5. Retourne le token et l'URL

**`revokeIntake`** (professionnel connecté)
1. Vérifie que le projet lui appartient
2. Supprime le `ClientIntake` (cascade possible)
3. Remet le projet en `DRAFT`
4. Retourne 204 No Content

**`getIntakeByToken`** (public)
1. Cherche l'intake par son token
2. Vérifie qu'il n'est pas expiré (sinon 410)
3. Retourne les infos du projet + tout le catalogue d'appareils

**`submitIntake`** (public)
1. Vérifie le token, l'expiration, et que ce n'est pas déjà soumis
2. Pour chaque appareil dans la liste, récupère ses données techniques actuelles (puissance, tension…)
3. Crée tous les `ProjectAppliance` avec un "snapshot" des données techniques — exactement comme `addApplianceToProject` le fait déjà dans `project.controllers.ts`
4. Marque l'intake comme soumis et passe le projet en `CLIENT_FILLED`
5. Tout ça dans une transaction (soit tout réussit, soit rien)

---

Est-ce que cette explication est claire ? Une fois que tu as compris et que tu valides, je lance l'implémentation.