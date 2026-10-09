# backend/AGENTS.md — OffGrid Backend

## 1. Rôle de ce fichier

Ce fichier définit les règles spécifiques pour travailler dans le dossier `backend/` du projet OffGrid.

OffGrid est un SaaS de dimensionnement de systèmes solaires autonomes / sites isolés.

Le backend est responsable de :

- l’API REST ;
- l’authentification ;
- la protection des routes professionnelles ;
- l’accès aux données ;
- la validation des entrées ;
- les calculs métier ;
- les exports temporaires ;
- la préparation future du rapport PDF.

Avant toute tâche backend importante, lire aussi les fichiers à la racine :

```txt
../PROJECT_OVERVIEW.md
../SURFTECH_PROCESS.md
../CALCULATION_RULES.md
../ROADMAP.md
../CODEX_WORKFLOW.md
../AGENTS.md
```

---

## 2. Stack backend

Stack principale :

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Better Auth
- Zod

Le backend doit rester typé, lisible et structuré.

---

## 3. Langue et pédagogie

Répondre en français par défaut.

Le développeur est junior.  
Quand une modification backend est proposée, expliquer simplement :

- pourquoi on modifie ce fichier ;
- ce que fait la route ou le service ;
- comment les données circulent ;
- quel risque on évite ;
- comment vérifier que ça marche.

Éviter les gros blocs techniques non expliqués.

---

## 4. Méthode de travail backend

Ne pas coder directement sur une tâche complexe.

Avant de modifier :

1. lire les fichiers concernés ;
2. expliquer le comportement actuel ;
3. lister les fichiers probablement concernés ;
4. proposer un plan simple ;
5. signaler les risques ;
6. attendre validation.

Après modification :

1. lister les fichiers modifiés ;
2. expliquer les changements ;
3. donner les commandes à lancer ;
4. indiquer les tests ajoutés ou à ajouter ;
5. proposer un message de commit.

---

## 5. Principe de périmètre

Travailler sur une seule tâche backend à la fois.

Ne pas mélanger :

- changement Prisma ;
- changement auth ;
- changement route ;
- changement calcul ;
- changement export ;
- refactor ;
- ajout de fonctionnalité.

Si une tâche touche plusieurs parties, proposer un découpage.

Exemple recommandé :

```txt
1. ajouter ou corriger le service backend
2. ajouter ou corriger la route
3. ajouter les tests
4. seulement ensuite adapter le frontend
```

---

## 6. Orientation SaaS backend

OffGrid est un SaaS.

Le backend ne doit jamais être codé comme une application mono-utilisateur.

Règles obligatoires :

- un utilisateur professionnel possède ses projets ;
- les routes professionnelles doivent vérifier la session ;
- un utilisateur ne doit pas accéder aux projets d’un autre utilisateur ;
- les clients, sites, appareils projet et calculs doivent être rattachés au bon projet ;
- les liens publics client doivent être limités au projet lié au token ;
- les données ne doivent jamais être mélangées entre projets ou utilisateurs.

Règle simple :

```txt
route pro → session obligatoire → vérifier propriétaire du projet
```

Exception :

```txt
route intake publique → token obligatoire → accès limité au projet du token
```

---

## 7. Authentification Better Auth

Better Auth est sensible.

Ne pas modifier l’authentification sans objectif clair.

Avant toute modification liée à l’auth :

1. expliquer le fonctionnement actuel ;
2. identifier les routes impactées ;
3. expliquer les risques ;
4. proposer une correction minimale ;
5. attendre validation.

Ne pas :

- casser les sessions existantes ;
- exposer des données utilisateur ;
- contourner les middlewares de protection ;
- créer une route professionnelle non protégée ;
- loguer des tokens ou informations sensibles.

---

## 8. Routes professionnelles protégées

Les routes professionnelles doivent être protégées.

Exemples de routes concernées :

- projets ;
- client ;
- site ;
- appareils projet ;
- calculs projet ;
- exports ;
- futurs rapports PDF ;
- futures données PVGIS ;
- futurs dimensionnements.

### Règle d’accès

Pour toute route qui reçoit un `projectId`, vérifier que :

```txt
le projet existe
ET
le projet appartient à l’utilisateur connecté
```

Ne pas se contenter de chercher le projet par ID.

Préférer une recherche qui combine :

```txt
projectId + userId
```

ou une fonction utilitaire claire qui vérifie l’accès.

---

## 9. Routes publiques client par token

Les routes intake client sont publiques mais limitées par token.

Elles doivent permettre au client de renseigner ses besoins sans compte professionnel.

Règles :

- token obligatoire ;
- projet retrouvé uniquement via le token ;
- accès limité aux données nécessaires au parcours client ;
- pas d’accès aux routes professionnelles ;
- pas d’exposition d’informations inutiles ;
- gestion claire des tokens invalides ;
- gestion claire des projets déjà soumis ou verrouillés si cette règle existe.

Ne pas transformer une route publique client en accès général au projet.

---

## 10. Prisma

Prisma est la couche d’accès à la base de données.

Avant de modifier le schéma Prisma :

1. expliquer pourquoi le changement est nécessaire ;
2. proposer la modification ;
3. expliquer l’impact sur les données existantes ;
4. indiquer la migration nécessaire ;
5. attendre validation.

Ne pas :

- supprimer un champ sans validation ;
- renommer une relation sans expliquer l’impact ;
- modifier des modèles sensibles sans raison ;
- créer une migration destructive sans accord ;
- changer le modèle de propriété des projets sans réflexion SaaS.

### Commandes utiles à vérifier

Avant d’utiliser une commande, vérifier qu’elle est cohérente avec le projet.

Exemples possibles :

```txt
npx prisma validate
npx prisma generate
npx prisma migrate status
npx prisma migrate dev
```

Ne pas lancer de migration destructive sans validation.

---

## 11. Zod

Zod doit valider les entrées backend.

Le frontend peut aussi valider les formulaires, mais la validation backend reste obligatoire.

Règles :

- valider les body ;
- valider les params ;
- valider les query params ;
- garder les schémas lisibles ;
- éviter les validations dupliquées inutilement ;
- retourner des erreurs compréhensibles.

Pour les calculs, valider notamment :

- quantité ;
- puissance ;
- facteur de foisonnement ;
- plages horaires ;
- coordonnées GPS ;
- tension ;
- autonomie ;
- données batteries futures.

---

## 12. Organisation du code

Respecter l’organisation existante du projet.

Avant d’ajouter un nouveau fichier, regarder les conventions existantes.

Règle générale souhaitée :

```txt
routes/controllers → validation → services métier → Prisma
```

Éviter de mettre trop de logique métier directement dans les routes.

Les calculs doivent être isolés dans des services ou fonctions testables.

---

## 13. Calculs métier

Avant toute modification liée aux calculs, lire :

```txt
../CALCULATION_RULES.md
../SURFTECH_PROCESS.md
```

Les calculs actuels concernent principalement :

- consommation journalière ;
- détail par appareil ;
- profil horaire 24 h ;
- puissance de pointe ;
- plages horaires ;
- foisonnement.

Règles principales :

- utiliser les appareils du projet ;
- utiliser `ProjectAppliance` ;
- utiliser les snapshots projet ;
- ne pas recalculer depuis le catalogue actuel ;
- gérer les plages qui traversent minuit ;
- fusionner les chevauchements quand nécessaire ;
- ne pas appliquer deux fois le foisonnement ;
- distinguer W, Wh, kW et kWh ;
- éviter les arrondis trop tôt ;
- ajouter ou adapter les tests si une règle change.

Ne pas inventer de formule métier.

Si une formule n’est pas claire, demander validation.

---

## 14. Appareils projet et snapshots

Quand un appareil est ajouté à un projet, certaines valeurs du catalogue sont copiées en snapshot.

Les calculs doivent utiliser ces valeurs snapshotées.

Pourquoi :

```txt
un projet ancien doit garder les mêmes résultats
même si le catalogue change plus tard
```

Ne pas remplacer cette logique par un recalcul depuis le catalogue.

---

## 15. Catalogue appareils/catégories

Le catalogue sert de base pour ajouter des appareils à un projet.

Mais une fois l’appareil ajouté au projet, les calculs utilisent l’appareil projet.

Règle :

```txt
catalogue = source au moment de l’ajout
ProjectAppliance = source pour les calculs
```

Ne pas mélanger les deux rôles.

---

## 17. Rapport PDF final

La sortie finale cible d’OffGrid est un rapport PDF.

Le backend devra à terme fournir les données nécessaires au PDF :

- projet ;
- client ;
- site ;
- hypothèses ;
- consommation ;
- détail par appareil ;
- profil horaire ;
- puissance de pointe ;
- données solaires ;
- batteries ;
- SOC/DoD ;
- PV/régulateurs ;
- onduleur/chargeur ;
- groupe ;
- câbles/protections ;
- matériel/prix.

Règle importante :

```txt
le PDF affiche les résultats
il ne refait pas les calculs
```

Préparer une structure de données claire avant de générer un PDF complet.

---

## 18. PVGIS futur

PVGIS doit être appelé côté backend.

Ne pas appeler PVGIS directement depuis le frontend.

Architecture recommandée plus tard :

```txt
services/pvgis/pvgis.client.ts
services/pvgis/pvgis.mapper.ts
services/pvgis/pvgis.types.ts
```

Règle :

```txt
PVGIS fournit les données solaires
OffGrid applique les règles métier
```

Prévoir une gestion d’erreur claire :

- coordonnées manquantes ;
- réponse PVGIS invalide ;
- API indisponible ;
- timeout ;
- données insuffisantes.

---

## 19. Batteries et dimensionnements futurs

Les futurs calculs batteries, SOC/DoD, PV/régulateurs, onduleur, groupe et protections doivent être ajoutés progressivement.

Ne pas coder une grosse fonction unique qui fait tout.

Préférer :

```txt
1 service par bloc métier
1 fonction claire par calcul
des types explicites
des tests ciblés
```

Ordre recommandé :

```txt
consommation
→ PVGIS
→ batteries
→ simulation SOC/DoD
→ PV/régulateurs
→ onduleur/groupe
→ protections
→ matériel/prix
→ PDF
```

---

## 20. Erreurs backend

Les erreurs doivent être explicites.

Exemples :

- projet introuvable ;
- accès non autorisé ;
- token intake invalide ;
- projet déjà soumis ;
- données invalides ;
- appareil projet introuvable ;
- données de calcul insuffisantes ;
- PVGIS indisponible.

Ne pas retourner une erreur générique si une erreur claire est possible.

Ne pas exposer de détails sensibles dans les erreurs publiques.

---

## 21. Tests backend

Les tests sont importants, surtout pour les calculs.

Tests prioritaires :

- calcul consommation simple ;
- quantité supérieure à 1 ;
- facteur de foisonnement par défaut ;
- facteur personnalisé ;
- plage traversant minuit ;
- plages qui se chevauchent ;
- profil horaire 24 h ;
- total horaire = total journalier ;
- puissance de pointe ;
- projet sans appareil ;
- accès projet par mauvais utilisateur ;
- token intake invalide.

Avant d’ajouter un test, regarder l’organisation existante.

---

## 22. Commandes backend

Ne pas supposer que toutes les commandes existent.

Avant de proposer une commande, vérifier `package.json`.

Commandes possibles selon le projet :

```txt
npm run dev
npm run build
npm run lint
npm run test
npx prisma validate
npx prisma generate
npx prisma migrate status
```

Après une tâche, indiquer clairement :

- commandes lancées ;
- commandes à lancer ;
- tests passés ;
- tests non lancés.

---

## 23. Sécurité

Ne jamais exposer :

- secrets ;
- clés API ;
- tokens ;
- mots de passe ;
- variables d’environnement sensibles ;
- données d’un autre utilisateur.

Ne pas logger d’informations sensibles.

Les logs peuvent aider au debug, mais ils doivent rester propres.

---

## 24. Variables d’environnement

Ne pas hardcoder :

- URL frontend ;
- URL backend ;
- clés API ;
- secrets Better Auth ;
- informations base de données ;
- futures clés externes.

Utiliser les variables d’environnement existantes.

Si une nouvelle variable est nécessaire :

1. expliquer pourquoi ;
2. proposer son nom ;
3. indiquer où l’ajouter ;
4. ne pas fournir de secret réel.

---

## 25. Performance et simplicité

Ne pas optimiser trop tôt.

Mais éviter les erreurs évidentes :

- requêtes inutiles répétées ;
- récupération de données trop large ;
- absence de filtre utilisateur ;
- calculs dupliqués ;
- logique copiée-collée.

Préférer un code simple et correct.

---

## 26. Définition de terminé backend

Une tâche backend est terminée quand :

- le comportement demandé est implémenté ;
- les routes sensibles sont protégées ;
- l’accès projet/utilisateur est respecté ;
- les entrées sont validées ;
- les erreurs principales sont gérées ;
- les calculs respectent `CALCULATION_RULES.md` si concerné ;
- les tests utiles sont ajoutés ou proposés ;
- les commandes de vérification sont données ;
- les fichiers modifiés sont listés ;
- un message de commit est proposé.

---

## 27. Ce qu’il ne faut pas faire

Ne pas :

- casser Better Auth ;
- créer une route pro non protégée ;
- oublier le filtre utilisateur/projet ;
- modifier Prisma sans validation ;
- inventer une formule métier ;
- recalculer depuis le catalogue au lieu des snapshots ;
- faire du PDF un calculateur séparé ;
- ajouter les fonctionnalités SaaS avancées trop tôt ;
- faire un gros refactor non demandé ;
- mélanger plusieurs tâches dans un seul diff.

---

## 28. Règle finale backend

Le backend est le cœur métier d’OffGrid.

Priorité :

```txt
sécurité SaaS
→ justesse métier
→ validation
→ tests
→ lisibilité
→ évolutivité
```

Toujours travailler petit, clair et vérifiable.
