---
title: 'ISO 8601, ou comment écrire une date sans ambiguïté'
description: '03/04/2026 désigne deux dates différentes selon qui le lit. ISO 8601 règle cela, et ses règles méritent d’être connues avec précision.'
summary: 'ISO 8601 existe parce que 03/04/2026 est mars en Amérique et avril partout ailleurs. Écrire 2026-04-03 supprime l’ambiguïté, se trie correctement comme du texte, et c’est ce que toute interface devrait accepter.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 7
keywords: ['iso 8601', 'format de date normalisé', 'format d’horodatage', 'rfc 3339']
related: ['what-utc-really-is', 'time-zones-in-code', 'the-2038-problem']
---

`03/04/2026`, c’est le 3 avril dans la plus grande partie du monde et le 4 mars aux États-Unis. Rien dans la chaîne ne permet de trancher, et les deux lectures sont parfaitement raisonnables. Chaque année, cette ambiguïté produit des échéances manquées, des doubles réservations et au moins une panne mémorable.

ISO 8601 est la norme internationale qui la supprime.

## Le format de base

```
2026-04-03T14:30:00Z
```

De gauche à droite, de la plus grande unité à la plus petite :

- `2026-04-03` — année, mois, jour, chacun complété par un zéro, toujours dans cet ordre
- `T` — le séparateur entre date et heure, obligatoire dans la forme stricte
- `14:30:00` — heures, minutes, secondes sur une horloge de 24 heures
- `Z` — le désignateur de fuseau. `Z` signifie UTC exactement

C’est l’ordre qui compte. Parce que les composantes vont du plus significatif au moins significatif, **une chaîne ISO 8601 se trie correctement en texte brut**. `2026-04-03` précède `2026-04-10` dans une simple comparaison de chaînes, ce qu’aucun autre format courant ne réussit. Cette seule propriété justifie la norme.

## Désignateurs de fuseau

Trois formes sont valides, et elles ne veulent pas dire la même chose :

| Forme                       | Signification                                                                 |
| --------------------------- | ----------------------------------------------------------------------------- |
| `2026-04-03T14:30:00Z`      | 14:30 UTC. Sans ambiguïté                                                     |
| `2026-04-03T14:30:00+05:45` | 14:30 heure locale dans un fuseau en avance de 5 h 45 sur UTC. Sans ambiguïté |
| `2026-04-03T14:30:00`       | 14:30 dans un fuseau non précisé. **Pas un horodatage**                       |

C’est la troisième forme qui pose problème. C’est une _date-heure locale_ : une lecture d’horloge sans aucun moyen de la placer sur une ligne du temps. La faire franchir une frontière de système en espérant que l’autre côté suppose le même fuseau que vous, c’est un bogue qui attend un déploiement dans une autre région.

Notez aussi ce qu’un décalage n’est pas : `+05:45` vous donne le décalage du Népal, pas le fait que l’horodatage vienne du Népal. Les décalages ne sont pas des fuseaux — plusieurs fuseaux partagent le même décalage, et le décalage d’un fuseau change. Transportez l’identifiant à part s’il vous faut savoir où.

## RFC 3339, le profil que vous voulez sans doute

ISO 8601 est vaste. Elle autorise les dates de semaine (`2026-W14-5`), les dates ordinales (`2026-093`), des unités fractionnaires et une forme tronquée qui omet le siècle. La plus grande partie n’est pas ce que vous voulez dans une interface.

RFC 3339 est un profil resserré pour les protocoles de l’internet. Elle exige la date complète, exige un désignateur de fuseau, et accepte comme séparateur soit `T` soit une espace. Quand quelqu’un dit « format ISO » à propos d’une API, il veut presque toujours dire RFC 3339.

**Une règle utile :** acceptez tout ce qu’un bon analyseur digère ; n’émettez que du RFC 3339 strict avec un `Z`.

## Durées et intervalles

Moins employés, et bons à connaître quand on les rencontre.

Les **durées** commencent par `P` pour période, et `T` sépare la partie date de la partie heure :

- `P3Y6M4D` — trois ans, six mois, quatre jours
- `PT1H30M` — une heure trente minutes
- `P1DT12H` — un jour douze heures

Le `T` n’est pas facultatif : `P1M` est un mois, `PT1M` est une minute. C’est le bogue classique des durées ISO 8601.

Les **intervalles** joignent deux points par une barre oblique : `2026-04-03T14:00Z/2026-04-03T16:00Z`, ou un point et une durée : `2026-04-03T14:00Z/PT2H`.

Les données structurées `HowTo` de ce site emploient la syntaxe des durées — `PT2M` pour une tâche de deux minutes — parce que schema.org impose des durées ISO 8601.

## Les dates de semaine, et le piège qu’elles cachent

`2026-W14-5` est le vendredi de la quatorzième semaine ISO de 2026. Les semaines ISO commencent le lundi, et la semaine 1 est celle qui contient le premier jeudi de janvier.

La conséquence sur laquelle on trébuche : **l’année de semaine ISO n’est pas toujours l’année civile.** Le 1er janvier 2027 tombe dans la semaine ISO 53 de 2026. Du code de formatage qui associe un numéro de semaine ISO à une année civile produit une date fausse quelques jours par an — et dans la plupart des langages les spécificateurs de format se ressemblent presque (`YYYY` contre `GGGG`, ou `%Y` contre `%G`).

## Règles pratiques

1. **Stockez en UTC, émettez avec `Z`.** `2026-04-03T14:30:00Z` a exactement un sens partout.
2. **N’émettez jamais une date-heure locale nue à travers une frontière.** Si vous ne pouvez pas attacher un fuseau, vous n’avez pas d’horodatage.
3. **Complétez tout par des zéros.** `2026-4-3` n’est pas de l’ISO 8601 valide, même si la plupart des analyseurs l’acceptent.
4. **Utilisez les séparateurs `-` et `:`.** La forme compacte (`20260403T143000Z`) est légale mais hostile, et certains analyseurs la refusent.
5. **Conservez l’identifiant de fuseau à part** quand vous devez savoir _où_, et pas seulement _quel décalage_. `Europe/London` survit à un changement de règles ; `+01:00` non.

## Pièges à l’analyse

Même avec une norme, c’est à l’analyse que les choses tournent mal.

**Le constructeur `Date` de JavaScript est incohérent pour les entrées non ISO.** `new Date('2026-04-03')` est interprété comme minuit UTC. `new Date('2026-04-03T00:00:00')` — sans désignateur de fuseau — est interprété comme minuit _local_. Les deux diffèrent de votre décalage, donc le même code produit des jours différents selon l’endroit où il tourne. Mettez toujours un désignateur de fuseau.

**Les années à deux chiffres sont ambiguës et devraient être refusées.** ISO 8601 autorise une forme tronquée ; presque rien ne devrait l’accepter. `26-04-03` peut être 1926 ou 2026, et la fenêtre glissante qui tranche est une décision de politique cachée dans un analyseur.

**La précision des fractions de seconde varie.** `14:30:00.5`, `14:30:00.500` et `14:30:00.500000` sont tous valides et tous le même instant. Un analyseur qui compare des chaînes plutôt que des instants ne sera pas d’accord.

**La virgule est légale.** ISO 8601 autorise `14:30:00,5` — virgule décimale — et la préfère même. La plupart des analyseurs la refusent. Si vous consommez des données d’un système européen, préparez-vous.

**Minuit s’écrit de deux façons.** `24:00:00` d’un jour est le même instant que `00:00:00` du lendemain, et les deux sont de l’ISO 8601 valide. Émettez la seconde forme ; acceptez les deux.

## Une note sur le tri

La triabilité d’ISO 8601 ne vaut que pour des chaînes ayant la même représentation de fuseau. `2026-04-03T14:00:00Z` et `2026-04-03T10:00:00-05:00` sont le même instant, mais en tant que chaînes la seconde se trie avant.

Si vous triez des horodatages comme du texte — dans un journal, dans un nom de fichier, dans une colonne de base typée texte — normalisez-les d’abord tous en UTC avec un `Z`. Sinon, l’ordre est une propriété du formatage et non du temps.
