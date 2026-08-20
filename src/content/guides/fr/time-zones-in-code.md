---
title: 'Les fuseaux horaires dans le code, guide pratique'
description: "Stockez UTC, gardez l'identifiant de fuseau, convertissez à l'affichage, ne construisez jamais de table de décalages. Les règles et leur justification."
summary: "Presque tout bogue de fuseau horaire remonte à l'une de quatre erreurs. Voici quoi faire à la place, en JavaScript, Python, Java, Go et SQL, avec le raisonnement et pas seulement la règle."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 9
keywords:
  [
    'fuseaux horaires dans le code',
    'bonnes pratiques date et heure',
    'stocker des horodatages',
    'utc en base de données',
  ]
related: ['what-utc-really-is', 'iso-8601-explained', 'the-2038-problem']
---

Presque tout bogue de fuseau horaire en production remonte à l'une de quatre erreurs : stocker une heure locale, stocker un décalage au lieu d'un fuseau, convertir dans la mauvaise couche, ou construire une table de décalages à la main. Tout ce qui suit découle de leur évitement.

## Règle 1 : stockez les instants en UTC

Un instant est un point sur la ligne du temps. Une heure locale est une lecture d'horloge, qui exige un fuseau et une politique de levée d'ambiguïté avant de signifier quoi que ce soit.

```sql
-- Bien : un instant
created_at TIMESTAMPTZ NOT NULL

-- Mal : une lecture d'horloge sans fuseau
created_at TIMESTAMP NOT NULL
```

Le `TIMESTAMPTZ` de PostgreSQL ne stocke pas de fuseau : il normalise en UTC à l'écriture et convertit à la lecture. C'est exactement ce que vous voulez pour « quand est-ce arrivé ».

## Règle 2 : stockez l'identifiant de fuseau, pas le décalage

Si vous devez savoir _où_ — pour un événement récurrent, une préférence d'utilisateur, les horaires d'un commerce —, stockez `Europe/London`, pas `+01:00`.

Un décalage est un fait relatif à un seul instant. Un fuseau est un jeu de règles qui survit à un gouvernement changeant d'avis. La Grande-Bretagne est à `+00:00` en janvier et à `+01:00` en juillet ; stocker l'un ou l'autre en l'appelant « le fuseau de l'utilisateur » est faux la moitié de l'année.

```sql
event_start_local  TIMESTAMP   NOT NULL,  -- l'heure d'horloge choisie
event_time_zone    TEXT        NOT NULL,  -- 'Europe/London'
event_start_utc    TIMESTAMPTZ NOT NULL   -- instant résolu, recalculé si les règles changent
```

Pour un événement récurrent, l'heure locale et le fuseau font foi ; l'instant UTC est un index dérivé. Si tzdata change — et cela arrive plusieurs fois par an —, la colonne dérivée est régénérée et le 9 h de l'utilisateur reste 9 h.

## Règle 3 : convertissez en périphérie

La logique métier travaille en instants. La conversion en heure locale lisible intervient au dernier moment possible, dans la couche qui sait qui lit.

Le corollaire importe davantage : **ne laissez jamais le fuseau du serveur transpirer dans le comportement.** Fixez `TZ=UTC` dans votre environnement de déploiement et traitez comme un défaut tout chemin de code dont le résultat dépend des réglages régionaux du serveur. C'est la classe de panne qui n'apparaît qu'au déploiement dans une deuxième région.

## Règle 4 : ne construisez jamais de table de décalages

Tout environnement d'exécution embarque la base de l'IANA. Servez-vous-en.

**JavaScript**

```js
// Formater dans un fuseau
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

// Obtenir un décalage sans bibliothèque : comparer l'horloge du fuseau à UTC
function offsetMinutes(timeZone, instant) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return (asUtc - Math.floor(instant / 1000) * 1000) / 60000;
}
```

Fixez `hourCycle: 'h23'` explicitement. Certaines versions d'ICU rapportent minuit comme l'heure 24 sous `en-US`, ce qui décale la date d'un jour et constitue un bogue réellement pénible à trouver.

**Python**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo  # bibliothèque standard depuis 3.9

now = datetime.now(timezone.utc)
local = now.astimezone(ZoneInfo("Asia/Kathmandu"))
```

N'utilisez jamais `datetime.utcnow()`. Elle renvoie une date naïve qui _ressemble_ à de l'UTC mais ne porte aucun fuseau, et la mélanger à des dates conscientes lève une exception au pire moment. `datetime.now(timezone.utc)` est l'appel correct.

**Java**

```java
Instant now = Instant.now();
ZonedDateTime local = now.atZone(ZoneId.of("Asia/Kathmandu"));
```

`java.time` est bien conçu : `Instant` pour les points sur la ligne du temps, `LocalDateTime` pour les lectures d'horloge sans fuseau, `ZonedDateTime` pour les deux à la fois. Le système de types impose la distinction sur laquelle ce guide n'arrête pas d'insister.

**Go**

```go
loc, _ := time.LoadLocation("Asia/Kathmandu")
local := time.Now().In(loc)
```

`LoadLocation` lit la tzdata du système. Dans un conteneur vierge il n'y en a pas : importez `_ "time/tzdata"` pour l'embarquer dans le binaire, sinon toute recherche de fuseau retombe silencieusement sur UTC.

## Les deux jours de l'année

L'avance supprime une heure ; le retour en arrière en répète une. Choisissez une politique, appliquez-la sans exception, et dites à l'utilisateur ce que vous avez fait :

- **Heure locale inexistante** (2 h 30 à la date de printemps aux États-Unis) : avancer de la taille du trou, si bien que 2 h 30 devient 3 h 30.
- **Heure locale ambiguë** (1 h 30 à la date d'automne aux États-Unis) : prendre la première occurrence, la plus tôt.

Ce sont les politiques employées par ce site, et elles correspondent à la valeur par défaut `disambiguation: 'compatible'` de `Temporal` en ECMAScript — un alignement qui vaut la peine pour que votre comportement s'accorde à la plateforme.

Le trou ne fait pas toujours une heure. L'île Lord Howe décale de 30 minutes : lisez la taille dans la transition plutôt que de la supposer.

## Tester

Quatre cas attrapent l'essentiel :

1. **Un fuseau à la demi-heure** — `Asia/Kolkata` (+05:30). Attrape les hypothèses d'heures entières.
2. **Un fuseau à 45 minutes** — `Asia/Kathmandu` (+05:45). Attrape les hypothèses de demi-heure.
3. **Un fuseau de l'hémisphère sud** — `Australia/Sydney`. Attrape le « l'été, c'est juin ».
4. **L'île Lord Howe** — `Australia/Lord_Howe`. Attrape le décalage de 60 minutes figé dans le code, et rien d'autre ne le fera.

Ajoutez une date d'avance et une date de retour pour chaque fuseau où vos utilisateurs se trouvent réellement, et figez la version de tzdata dans l'intégration continue afin qu'une mise à jour de la base ne fasse pas échouer une compilation pour la mauvaise raison.

## Les événements récurrents sont un autre problème

Un événement ponctuel est un instant. Un événement récurrent est une règle, et les deux exigent un stockage différent.

« Tous les mardis à 9 h en Europe/London » n'est pas « toutes les 604800 secondes à partir de cet instant ». Les deux divergent dès que la Grande-Bretagne change ses horloges : la règle maintient la réunion à 9 h locales, tandis que l'intervalle la fait dériver à 8 h ou 10 h.

Stockez la règle — heure locale, identifiant de fuseau, motif de répétition — et matérialisez les instants à partir d'elle. Quand tzdata change, régénérez les instants matérialisés ; ne les migrez pas. La règle est ce à quoi l'utilisateur a consenti.

Les cas gênants découlent des deux discontinuités annuelles. Une réunion à 2 h 30 tous les jours découvrira qu'un jour de printemps cette heure n'existe pas et qu'un jour d'automne elle a lieu deux fois. Choisissez une politique, appliquez-la sans exception, et sachez que différents systèmes de calendrier en ont choisi de différentes — d'où le fait qu'un même événement récurrent puisse apparaître à une heure d'écart dans deux agendas exactement deux jours par an.

## Une note sur `Temporal`

L'interface `Temporal` d'ECMAScript remplace `Date` par des types qui distinguent instants, heures d'horloge et dates-heures avec fuseau, à la manière de `java.time`. `Temporal.ZonedDateTime` porte un identifiant de fuseau ; `Temporal.Instant` est un point sur la ligne du temps ; `Temporal.PlainDateTime` est une lecture d'horloge sans fuseau, et le système de types vous empêche de les confondre.

Son option `disambiguation` expose exactement la politique des deux jours par an sur laquelle ce guide revient sans cesse : `'compatible'` (par défaut — avancer à travers les trous, prendre la plus tôt d'une paire ambiguë), `'earlier'`, `'later'` et `'reject'`. La dernière mérite considération partout où se tromper d'une heure en silence est pire qu'une erreur.
