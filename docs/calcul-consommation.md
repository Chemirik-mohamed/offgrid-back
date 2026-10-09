# Comment l'API calcule la consommation d'un projet

Ce document explique, en langage simple, **comment l'application calcule la consommation
électrique d'un projet solaire**. Il s'adresse à une personne qui ne code pas : pas besoin de
connaître la programmation pour le comprendre.

Le but est de répondre à ces questions :

- De quelles informations part-on ?
- Sous quelle forme l'API reçoit-elle ces informations ?
- Quels calculs sont faits, et pourquoi ?
- Qu'est-ce que l'API renvoie au front (l'écran que voit l'utilisateur) ?

Le code qui fait tout cela se trouve dans le fichier
`src/services/projectConsumption.service.ts`.

---

## 1. L'idée générale en une phrase

> On prend la liste des appareils d'un projet (avec leur puissance, leur quantité et leurs
> heures d'utilisation), et on en déduit **combien d'énergie le projet consomme chaque jour**
> ainsi que **la puissance demandée heure par heure**.

C'est cette consommation qui sert ensuite à dimensionner l'installation solaire (panneaux,
batteries, onduleur).

---

## 2. Les ingrédients : de quelles données part-on ?

Quand on ajoute un appareil à un projet (par exemple « 3 ampoules », « 1 frigo »), l'API
enregistre pour cet appareil les informations suivantes :

| Donnée | Signification | Exemple |
|---|---|---|
| `quantity` | Le nombre d'appareils identiques | `3` (trois ampoules) |
| `timeSlots` | Les plages horaires d'utilisation dans la journée | « 18:00 → 23:00 » |
| `unitPowerWSnapshot` | La puissance d'**un seul** appareil, en watts (W) | `15` W |
| `startupPowerWSnapshot` | La puissance de **démarrage** d'un appareil, en watts | `45` W |
| `defaultDiversityFactorSnapshot` | Le facteur de **foisonnement** par défaut | `0.8` |
| `diversityFactorOverride` | Un foisonnement personnalisé qui remplace celui par défaut (optionnel) | `0.6` ou vide |

### Pourquoi le mot « Snapshot » (photo) ?

Les valeurs de puissance sont **photographiées au moment où l'appareil est ajouté au projet**.
Si plus tard quelqu'un modifie la fiche de l'appareil dans le catalogue, **le projet n'est pas
affecté** : il garde les valeurs qu'il avait au départ. C'est une sécurité pour que les anciens
projets restent stables.

### Le facteur de foisonnement, c'est quoi ?

Tous les appareils ne fonctionnent jamais à pleine puissance en même temps. Le **foisonnement**
est un coefficient (entre 0 et 1) qui traduit cette réalité. Par exemple, un foisonnement de
`0.8` signifie « on considère que seulement 80 % de la puissance maximale est réellement
demandée en même temps ».

- S'il existe un foisonnement personnalisé (`diversityFactorOverride`), c'est lui qu'on utilise.
- Sinon, on utilise le foisonnement par défaut (`defaultDiversityFactorSnapshot`).

---

## 3. Les plages horaires : comment l'API les comprend

### Le format reçu

Une plage horaire arrive sous cette forme (format JSON) :

```json
{
  "label": "evening",
  "from": "18:00",
  "to": "23:00"
}
```

- `label` : un nom de période parmi `morning` (matin), `noon` (midi), `evening` (soir),
  `night` (nuit) ou `continuous` (en continu, 24h/24).
- `from` : l'heure de début, au format `HH:MM`.
- `to` : l'heure de fin, au format `HH:MM`.

Un appareil peut avoir **plusieurs plages horaires** (par exemple le matin **et** le soir).

### Transformation en minutes

Pour calculer facilement, l'API convertit les heures en **minutes depuis minuit**. Une journée
complète fait donc **1 440 minutes** (24 heures × 60 minutes).

- `08:00` devient `480` (8 × 60).
- `18:30` devient `1110` (18 × 60 + 30).

### Les trois cas de figure

1. **Utilisation continue** (`label = "continuous"`) → la plage couvre toute la journée,
   de `0` à `1440`.

2. **Plage classique** (l'heure de fin est après l'heure de début), par exemple `08:00 → 12:00`
   → une seule période, de `480` à `720`.

3. **Plage qui passe minuit** (l'heure de fin est avant l'heure de début), par exemple
   `22:00 → 02:00` → l'API la coupe en **deux morceaux** :
   - de `22:00` jusqu'à minuit (`1320` → `1440`),
   - de minuit jusqu'à `02:00` (`0` → `120`).

> ⚠️ Si l'heure de début et l'heure de fin sont identiques (et que ce n'est pas « continu »),
> c'est considéré comme une erreur de saisie.

### La fusion des plages (pour ne rien compter deux fois)

Si un appareil a deux plages qui se chevauchent — par exemple `08:00 → 12:00` et
`10:00 → 14:00` — l'API les **fusionne** en une seule période `08:00 → 14:00`.

Sans cette fusion, on compterait deux fois la tranche `10:00 → 12:00`, et la consommation serait
fausse (gonflée). La fusion garantit qu'**une même minute n'est jamais comptée deux fois**.

---

## 4. Les deux types de puissance, et pourquoi

L'application distingue deux notions de puissance, qui ne servent pas au même calcul :

### a) La puissance pour l'énergie (sans foisonnement)

```
Puissance énergie = quantité × puissance unitaire
```

Exemple : 3 ampoules de 15 W → `3 × 15 = 45 W`.

Cette puissance utilise la **puissance nominale** de l'appareil, **à pleine charge** et **sans
foisonnement**. Elle sert à calculer **l'énergie consommée** (les kWh), c'est-à-dire ce qu'il
faudra produire et stocker sur la journée.

### b) La puissance de pointe (avec foisonnement)

```
Puissance de pointe = quantité × puissance de démarrage × foisonnement
```

Exemple : 3 ampoules avec une puissance de démarrage de 45 W et un foisonnement de 0,8 →
`3 × 45 × 0,8 = 108 W`.

Cette puissance utilise la **puissance de démarrage** (souvent plus élevée, par exemple pour un
moteur de frigo qui démarre) et applique le **foisonnement**. Elle sert à dimensionner
**l'onduleur**, c'est-à-dire à savoir quelle puissance maximale l'installation doit pouvoir
fournir d'un coup.

> En résumé :
> **l'énergie** (kWh) répond à « combien faut-il produire sur la journée ? »
> **la pointe** (W) répond à « quelle est la puissance maximale à fournir à un instant donné ? »

---

## 5. Le calcul de la consommation d'un appareil sur la journée

Pour chaque appareil, l'API calcule son énergie quotidienne ainsi :

```
Énergie quotidienne (Wh) = puissance énergie (W) × nombre total d'heures d'utilisation
```

Le **nombre total d'heures** est obtenu à partir des plages horaires fusionnées (étape 3),
converties en heures.

**Exemple complet :** 3 ampoules de 15 W, allumées de 18:00 à 23:00 (soit 5 heures).

1. Puissance énergie = `3 × 15 = 45 W`
2. Durée = 5 heures
3. Énergie = `45 × 5 = 225 Wh` par jour, soit `0,225 kWh`.

---

## 6. Le profil heure par heure (les 24 heures de la journée)

En plus du total quotidien, l'API construit un **profil sur 24 heures** : pour chaque heure de
la journée (de 0h à 23h), elle indique ce qui est consommé.

### Comment ça marche

L'API part de 24 « cases » vides (une par heure). Puis, pour **chaque appareil** :

1. Elle regarde ses plages horaires fusionnées.
2. Pour chaque heure de la journée, elle calcule **combien de minutes l'appareil est actif
   pendant cette heure** (le « chevauchement »).
3. Si l'appareil est actif au moins une partie de l'heure :
   - elle ajoute l'**énergie** correspondante à cette heure (au prorata des minutes actives),
   - elle ajoute la **puissance de pointe** à cette heure.

**Exemple :** une ampoule allumée de `18:30` à `20:00`.

- À l'heure `18` (de 18:00 à 19:00), elle n'est active que 30 minutes → on compte la moitié de
  l'énergie d'une heure.
- À l'heure `19` (de 19:00 à 20:00), elle est active les 60 minutes → on compte l'énergie d'une
  heure complète.
- Aux autres heures, rien.

### Le détail des valeurs renvoyées pour chaque heure

| Champ | Signification |
|---|---|
| `hour` | Le numéro de l'heure, de `0` à `23` |
| `energyWh` | L'énergie consommée pendant cette heure, en wattheures |
| `averagePowerW` | La puissance moyenne sur l'heure, en watts |
| `demandPowerW` | La puissance de pointe demandée pendant cette heure, en watts |

> 💡 **Pourquoi `averagePowerW` est égal à `energyWh` ?**
> Sur une durée d'**une heure**, l'énergie en wattheures (Wh) est numériquement égale à la
> puissance moyenne en watts (W). Consommer 30 Wh en une heure = une puissance moyenne de 30 W
> sur cette heure. C'est pourquoi les deux chiffres sont identiques.

> 📌 **Une nuance importante sur `demandPowerW` :** la puissance de pointe est ajoutée
> **entièrement** dès que l'appareil est actif au moins une minute dans l'heure (elle n'est pas
> proratisée). C'est volontaire : pour le dimensionnement, ce qui compte est la puissance
> maximale qui peut être appelée pendant cette heure, même brièvement.

---

## 7. Le résultat final renvoyé au front

### Où le front demande-t-il ce calcul ?

Le front interroge cette adresse (l'utilisateur doit être connecté) :

```http
GET /api/project/:id/consumption
```

où `:id` est l'identifiant du projet.

### À quoi ressemble la réponse

L'API renvoie un objet `data` contenant quatre informations :

```json
{
  "data": {
    "totalDailyWh": 225,
    "totalDailyKWh": 0.225,
    "hourlyProfile": [
      { "hour": 0,  "energyWh": 0,   "averagePowerW": 0,   "demandPowerW": 0 },
      { "hour": 18, "energyWh": 45,  "averagePowerW": 45,  "demandPowerW": 108 },
      { "hour": 19, "energyWh": 45,  "averagePowerW": 45,  "demandPowerW": 108 }
    ],
    "appliances": [
      {
        "projectApplianceId": "…",
        "applianceId": "…",
        "applianceName": "Ampoule LED",
        "applianceSlug": "ampoule-led",
        "quantity": 3,
        "unitPowerW": 15,
        "totalHours": 5,
        "diversityFactor": 0.8,
        "dailyWh": 225,
        "dailyKWh": 0.225
      }
    ]
  }
}
```

### Le sens de chaque bloc

| Champ | Ce que ça représente |
|---|---|
| `totalDailyWh` | L'énergie totale consommée par jour, en wattheures (tous appareils additionnés) |
| `totalDailyKWh` | La même chose en kilowattheures (÷ 1000), plus lisible |
| `hourlyProfile` | Le tableau des **24 heures** (voir section 6) : utile pour tracer une courbe de consommation sur la journée |
| `appliances` | Le **détail appareil par appareil** : nom, quantité, heures d'utilisation, foisonnement, énergie quotidienne |

Le front peut donc afficher :

- un chiffre global (« ce projet consomme 0,225 kWh/jour »),
- un graphique heure par heure (à partir de `hourlyProfile`),
- un tableau détaillé par appareil (à partir de `appliances`).

---

## 8. Le déroulé complet, du début à la fin

1. L'utilisateur ajoute des appareils à son projet (quantité + plages horaires).
2. L'API enregistre, pour chaque appareil, une **photo** de ses puissances et de son foisonnement.
3. Quand le front demande la consommation (`GET /api/project/:id/consumption`) :
   1. l'API récupère tous les appareils du projet ;
   2. pour chacun, elle transforme les plages horaires en minutes, puis les fusionne ;
   3. elle calcule l'**énergie quotidienne** de chaque appareil ;
   4. elle construit le **profil heure par heure** (énergie + puissance de pointe) ;
   5. elle additionne tout pour obtenir le **total quotidien**.
4. L'API renvoie le tout au front, qui l'affiche.

---

## 9. Glossaire rapide

- **W (watt)** : unité de **puissance** (la « force » électrique appelée à un instant donné).
- **Wh (wattheure)** : unité d'**énergie** (puissance × durée). 1 appareil de 100 W pendant
  1 heure = 100 Wh.
- **kWh (kilowattheure)** : 1 000 Wh. C'est l'unité qu'on voit sur les factures d'électricité.
- **Foisonnement** : coefficient (0 à 1) qui tient compte du fait que tous les appareils ne
  fonctionnent pas à fond en même temps.
- **Puissance de pointe / de démarrage** : la puissance maximale momentanée, plus élevée que la
  puissance normale, notamment au démarrage de certains appareils.
- **Snapshot (photo)** : copie figée d'une valeur au moment où l'appareil est ajouté au projet.
