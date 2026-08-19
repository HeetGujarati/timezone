---
title: "Comment fonctionnent vraiment les fuseaux horaires"
description: "Les fuseaux horaires sont un artefact politique posé sur un problème géographique. Voici le mécanisme, et pourquoi le logiciel se trompe."
summary: "Un fuseau horaire n’est pas une tranche du globe : c’est un ensemble de règles nommé, portant sur ce qu’une horloge d’un lieu donné a affiché, affiche et doit afficher. Cette distinction est tout le sujet."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 1
keywords:
  ['comment fonctionnent les fuseaux horaires', 'fuseaux horaires expliqués', 'qu’est-ce qu’un fuseau horaire', 'base de données iana']
related: ['what-utc-really-is', 'why-est-is-ambiguous', 'time-zones-in-code']
---

Demandez à peu près à n’importe qui ce qu’est un fuseau horaire et on vous décrira une bande verticale sur une carte : le monde découpé en vingt-quatre tranches égales, espacées d’une heure, régies par la longitude. Ce modèle est net, mémorable, et faux d’une manière qui finira par vous coûter une réunion.

Un fuseau horaire est un **ensemble de règles nommé**, tenu par un gouvernement, sur ce qu’affichent les horloges d’un territoire donné. Ces règles peuvent changer. Elles changent pour des raisons politiques, économiques, et parfois avec quinze jours de préavis. La longitude est le point de départ de l’idée ; ce n’est pas son aboutissement.

## D’où vient l’idée

Avant les années 1880, chaque ville tenait sa propre heure, réglée sur le midi local — l’instant où le soleil franchit le méridien du lieu. Bristol avait dix minutes de retard sur Londres, et personne n’y voyait d’inconvénient, parce que rien ne voyageait assez vite pour que dix minutes comptent.

Le chemin de fer a changé cela. Un horaire annonçant un départ à 10 h 15 ne vaut rien si 10 h 15 signifie autre chose à chaque extrémité de la ligne, et dès les années 1840 les compagnies ferroviaires britanniques avaient purement et simplement imposé l’heure de Londres à tout leur réseau. Les États-Unis ont suivi en 1883, les compagnies de chemin de fer découpant le pays en quatre fuseaux de leur propre autorité. La Conférence internationale du méridien, en 1884, a fait de Greenwich le méridien d’origine et donné au monde une référence commune.

L’essentiel de cette histoire, c’est que les fuseaux horaires ont été inventés pour résoudre un problème de coordination, par les organisations qui avaient ce problème. Ils n’ont jamais décrit où se trouve le soleil.

## Ce que contient réellement un fuseau

Le registre qui fait autorité est la **base de données des fuseaux horaires de l’IANA**, aussi appelée tzdata ou base d’Olson. C’est un fichier texte, mis à jour plusieurs fois par an, et tous les systèmes d’exploitation, navigateurs et langages de programmation que vous utilisez en lisent une version.

Pour chaque fuseau, elle consigne :

- un identifiant, comme `America/New_York` ou `Asia/Kathmandu`
- le décalage par rapport à UTC en vigueur pendant chaque période de l’histoire de ce fuseau
- les règles indiquant quand ce décalage change, s’il change
- un sigle pour chaque période, lorsqu’il en existe un

Les identifiants suivent la convention `Zone/Lieu`, et le lieu est une ville représentative plutôt qu’un pays — car les pays se divisent, fusionnent et modifient leurs règles indépendamment de leurs frontières. `America/Argentina/Buenos_Aires` existe parce que les provinces argentines ont autrefois tenu des heures différentes.

Notez ce qu’un fuseau n’est pas : ce n’est pas un décalage. `America/New_York` n’est pas « UTC-5 ». C’est un fuseau dont le décalage vaut UTC-5 une partie de l’année et UTC-4 le reste, qui est resté à UTC-5 toute l’année pendant la Seconde Guerre mondiale, et qui suivait d’autres règles avant 1966. Stocker « UTC-5 » et l’appeler New York est de loin le bogue de fuseau horaire le plus répandu dans le logiciel.

## Les règles changent, et pas graduellement

En 2016, la Turquie a abandonné l’heure d’été avec environ trois semaines de préavis et est restée à UTC+3 en permanence. En 2018, la Corée du Nord a déplacé ses horloges de 30 minutes pour se réaligner sur le Sud. En 2022, l’Iran a supprimé l’heure d’été ; la même année, le Mexique l’a abandonnée pour l’essentiel du pays. L’Égypte l’a rétablie en 2023 après l’avoir supprimée en 2014.

Chacun de ces épisodes a donné lieu à une publication de tzdata, et chacun a cassé tous les systèmes dotés d’une table de décalages écrite en dur. C’est pourquoi le moteur derrière chaque page de ce site lit les décalages dans la copie de tzdata de l’environnement d’exécution plutôt que dans quoi que ce soit stocké ici. Une recompilation reprend les nouvelles règles ; il n’y a rien à modifier.

## Pourquoi les décalages ne sont pas tous des heures entières

Environ un cinquième de la population mondiale vit avec un décalage qui n’est pas un nombre entier d’heures par rapport à UTC. L’Inde est à UTC+05:30, choisi comme fuseau de compromis unique pour un pays assez large pour en justifier deux. Le Népal est à UTC+05:45, ces quarante-cinq minutes servant en partie à affirmer son indépendance vis-à-vis de l’heure indienne. Les îles Chatham sont à UTC+12:45. Terre-Neuve, à UTC-03:30.

Un logiciel qui suppose des décalages en heures entières ne se contente pas d’arrondir : il produit des réponses fausses de 30 ou 45 minutes pour des centaines de millions de personnes — précisément l’ordre de grandeur d’erreur qu’on découvre pendant l’appel, et pas avant.

## Les deux jours par an où l’heure locale n’est pas une fonction

L’heure d’été crée deux discontinuités annuelles, et c’est pour cela que « convertir cette heure locale » est plus difficile qu’il n’y paraît.

**Avancer supprime une heure.** À New York, le jour du changement, 01:59:59 est immédiatement suivi de 03:00:00. L’heure locale 02:30 n’existe pas. Si quelqu’un la saisit, il n’y a aucun instant correct à renvoyer — seulement des politiques sur ce qu’on renvoie à la place.

**Reculer répète une heure.** 01:30 survient deux fois, une fois en heure d’été et une heure plus tard en heure normale. Une heure locale seule est réellement ambiguë ; il faut savoir de quelle occurrence il s’agissait, et presque aucune interface ne le demande.

Tous les outils de ce site tranchent explicitement les deux cas et vous disent ce qu’ils ont fait. En choisir un en silence, c’est ainsi qu’une entrée d’agenda se retrouve décalée d’une heure sans que personne s’en aperçoive avant l’appel.

## Ce que cela veut dire en pratique

Trois règles découlent du mécanisme, et elles couvrent l’essentiel de ce qui déraille :

1. **Stockez des instants, pas des heures locales.** Un horodatage UTC est sans ambiguïté. Une heure locale, c’est un horodatage plus un fuseau plus une politique pour les deux jours délicats.
2. **Stockez l’identifiant du fuseau, pas le décalage.** `Europe/London` survit à un changement de règles ; `UTC+0` non, et il est faux la moitié de l’année de toute façon.
3. **Convertissez au moment de l’affichage, avec la tzdata de l’environnement.** Pas au moment du stockage, et jamais depuis une table que vous entretenez vous-même.

Si ce site répète « au dernier build » à propos des décalages, et calcule les heures courantes dans votre navigateur, c’est exactement pour la même raison. Ces règles ne nous appartiennent pas, et nous n’avons pas à les figer.
