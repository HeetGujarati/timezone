---
title: "Les décalages UTC qui ne sont pas des heures entières"
description: "L'Inde, le Népal, Terre-Neuve et les îles Chatham vivent à la demi-heure ou au quart d'heure. Voici la liste complète, et ce qui casse dans les logiciels."
summary: "Environ un cinquième de l'humanité vit sur un décalage qui n'est pas un nombre entier d'heures par rapport à UTC. Un logiciel qui suppose le contraire ne se trompe pas un peu pour ces gens : il se trompe de 30 ou 45 minutes, ce qui est pire."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 5
keywords: ['fuseaux horaires demi-heure', 'décalage utc 45 minutes', 'décalage fuseau horaire inde', 'fuseau horaire népal']
related: ['half-hour-offsets-explained', 'time-zones-in-code', 'how-time-zones-work']
---

Le modèle mental des vingt-quatre fuseaux d'une heure est faux d'une manière coûteuse : il produit du code qui se trompe avec assurance de 30 ou 45 minutes pour bien plus d'un milliard de personnes. Une erreur d'une heure entière ressemble au moins à une erreur. Une erreur de 45 minutes ressemble à une coquille, et part en production.

## La liste complète

**Décalages à :30**

| Décalage  | Où                                                            |
| --------- | ------------------------------------------------------------- |
| UTC-09:30 | Îles Marquises                                                |
| UTC-03:30 | Terre-Neuve-et-Labrador                                       |
| UTC+03:30 | Iran                                                          |
| UTC+04:30 | Afghanistan                                                   |
| UTC+05:30 | Inde, Sri Lanka                                               |
| UTC+06:30 | Birmanie, îles Cocos                                          |
| UTC+09:30 | Australie centrale — Territoire du Nord, Australie-Méridionale |
| UTC+10:30 | Île Lord Howe (heure normale)                                 |

**Décalages à :45**

| Décalage  | Où                                                            |
| --------- | ------------------------------------------------------------- |
| UTC+05:45 | Népal                                                         |
| UTC+08:45 | Sud-est de l'Australie-Occidentale (Eucla, officieusement)     |
| UTC+12:45 | Îles Chatham (heure normale)                                  |

L'Inde à elle seule représente 1,4 milliard de personnes. Ajoutez l'Iran, l'Afghanistan, la Birmanie, le Sri Lanka et le Népal et vous dépassez le cinquième de la planète, avant même de compter l'Australie ou le Canada.

## L'autre sorte de décalage inhabituel

Les décalages qui ne sont pas des heures entières sont la bizarrerie connue. Deux autres comptent tout autant.

**L'amplitude est de 26 heures, pas de 24.** Kiritimati, aux Kiribati, est à UTC+14 ; les îles Baker et Howland sont à UTC-12. Cela fait 26 heures, ce qui signifie qu'il existe des moments où trois dates différentes du calendrier sont en usage en même temps quelque part sur terre. Tout code supposant qu'une fenêtre de deux jours couvre tous les fuseaux se trompe deux fois par jour.

**L'heure d'été ne vaut pas toujours une heure.** L'île Lord Howe, petite île australienne d'environ 380 habitants permanents, décale de 30 minutes : UTC+10:30 en hiver, UTC+11:00 en été. C'est le seul endroit au monde à le faire, et le meilleur cas de test pour une bibliothèque de dates — toute implémentation qui fige un décalage de 60 minutes s'y trompe et nulle part ailleurs, ce qui veut dire qu'elle passera tous les autres tests que vous écrirez.

## Ce qui casse

**Arrondir à l'heure la plus proche.** L'échec le plus courant. Un code qui calcule un décalage en heures entières tronque silencieusement l'Inde à +5, soit 30 minutes d'erreur pour chaque utilisateur du pays.

**Stocker des décalages en entiers.** Une colonne de schéma déclarée comme un nombre d'heures ne peut pas représenter Katmandou. On s'en aperçoit généralement une fois les données dedans.

**Interfaces en grille bâties sur des colonnes horaires.** Tout agenda ou planificateur qui découpe la journée en 24 cellules égales et suppose que l'heure locale de chaque fuseau tombe sur une frontière de cellule placera mal les fuseaux à la demi-heure et au quart d'heure. La bande du planificateur de réunions de ce site prend des instants pour colonnes plutôt que des heures locales : une ligne +05:45 affiche donc 09:45 dans la colonne où une ligne UTC affiche 04:00 — c'est la vérité, plutôt qu'un mensonge plus net.

**Arithmétique des durées à travers un changement de 30 minutes.** Supposer qu'une transition d'heure d'été vaut exactement 3 600 000 millisecondes donne une réponse fausse sur l'île Lord Howe, et là seulement.

## Bien faire

Le correctif est celui qui corrige presque tous les bogues de fuseau horaire : **ne calculez jamais un décalage vous-même.** Demandez à la plateforme.

Tout environnement d'exécution moderne embarque la base de l'IANA et vous donnera le décalage d'un fuseau à un instant donné, en minutes et correctement, y compris pour Katmandou et Lord Howe. En JavaScript, c'est `Intl.DateTimeFormat` avec `timeZoneName: 'longOffset'`, ou une comparaison de la lecture d'horloge du fuseau avec UTC — l'approche du moteur de ce site, parce qu'elle reste exacte même pour les décalages de temps moyen local à la seconde près dans les données d'avant 1900.

Tenez-vous ensuite à trois règles :

1. **Les décalages sont des minutes**, jamais des heures. Si une variable s'appelle `offsetHours`, c'est déjà un bogue.
2. **Testez sur Katmandou et Lord Howe.** Elles brisent les deux hypothèses que tout le reste vous laisse garder.
3. **N'arrondissez jamais un fuseau horaire.** Si un affichage doit être approximatif, dites-le ; ne déplacez pas en silence l'horloge d'un utilisateur de 30 minutes pour simplifier une mise en page.

## Un exemple traité : ce que 45 minutes font à une grille

Prenez un planificateur de réunions qui découpe la journée en 24 colonnes, une par heure, et ombre les heures ouvrées de chaque participant. L'implémentation naïve calcule chaque ligne en décalant la ligne de base du décalage du fuseau, exprimé en heures.

Pour Londres face à New York, cela marche : la ligne de New York est la ligne de Londres déplacée de cinq cellules vers la droite. Pour Londres face à Katmandou, cela ne marche pas. Katmandou est en avance de 5 heures 45, soit 5,75 cellules, et les trois quarts de cellule n'existent pas. L'implémentation arrondit — d'ordinaire à 6 — et voilà toute cette ligne en avance de 15 minutes.

L'erreur est assez petite pour survivre à une relecture et assez grande pour compter : une réunion de 9 h que la grille annonce à 9 h pour Katmandou y est en réalité à 8 h 45, et la personne qui rejoint arrive avec quinze minutes de retard sur sa propre journée.

Le correctif consiste à cesser de traiter les colonnes comme des heures. Faites de chaque colonne un _instant_, et demandez à la plateforme ce qu'affiche l'horloge locale de chaque fuseau à cet instant. Une ligne +05:45 affiche alors 09:45 là où une ligne UTC affiche 04:00 — visiblement décalée par rapport à la grille, ce qui est le rendu honnête. Le planificateur de réunions de ce site fait exactement cela, et le bord irrégulier de la ligne de Katmandou est une qualité.

## Les décalages historiques sont plus étranges encore

Avant la normalisation, les décalages étaient le temps solaire moyen local, précis à la seconde. La base de l'IANA les consigne.

Les Pays-Bas ont vécu à UTC+00:19:32,13 de 1909 à 1937. Le Liberia était à UTC-00:44:30 jusqu'en 1972. Demandez à un environnement d'exécution le décalage d'`Europe/Amsterdam` à une date de 1920 et il vous donnera la valeur exacte, secondes comprises.

C'est pourquoi la fonction de décalage sous ce site calcule en secondes et n'arrondit aux minutes qu'à l'affichage. Un moteur qui stockerait des minutes perdrait sans bruit 32 secondes d'histoire néerlandaise — ce que personne ne remarquerait, et qui serait faux tout de même.
