---
title: "À propos de Meridiem"
description: "Pourquoi ce site existe, comment il calcule ce qu’il affiche, et ce qu’il s’interdit délibérément de faire."
order: 1
updatedAt: '2026-01-15'
---

Meridiem est un ensemble d’outils de fuseaux horaires bâti sur un principe : ne jamais affirmer une donnée horaire qui n’ait été calculée depuis la base IANA au moment même où elle était nécessaire.

## Pourquoi il existe

La plupart des outils de fuseaux horaires reposent sur une table de décalages enregistrée. Cette table est juste jusqu’à ce qu’un gouvernement change d’avis — ce qui arrive plusieurs fois par an — et devient alors fausse en silence, d’une manière qui ressemble à une erreur d’agenda humaine plutôt qu’à un bogue logiciel.

Chaque décalage, chaque date de changement et chaque conversion de ce site provient de la copie de la base IANA fournie par l’environnement d’exécution, via l’interface `Intl`. Il n’y a aucune table de décalages dans ce code. Quand la base est mise à jour, une nouvelle compilation la reprend et le site redevient juste sans qu’une ligne change.

## Comment il est construit

- Chaque page est prégénérée. Il n’y a ni serveur, ni base de données, ni interface de programmation.
- Les heures courantes absolues sont calculées dans votre navigateur, jamais dans la page. Une page prégénérée ne peut honnêtement prétendre savoir quelle heure il est maintenant, donc elle n’essaie pas.
- Les faits durables — décalages, dates de changement, plages de recouvrement — sont calculés à la compilation et donnés à cette date-là.
- Le site est reconstruit chaque mois, ainsi que les 1er mars, 1er avril, 1er octobre et 1er novembre, pour que les mises à jour de la base arrivent avant les dates qu’elles concernent.

## Ce qu’on y trouve

Dix outils, 80 pages de villes, 1 448 conversions entre paires de villes, 240 conversions de sigles et douze guides. Chaque page générée porte des données calculées pour cette paire précise : le tableau horaire, les dates de changement d’heure des deux villes, et les heures que les deux lieux partagent réellement.

## Ce qu’il s’interdit

- **Aucun pistage.** Pas d’analytique, pas de cookies, pas de script tiers.
- **Aucun compte.** Les comptes à rebours et les plans de réunion vivent dans l’URL : partager un lien, c’est toute la fonctionnalité.
- **Aucune donnée inventée.** Là où une zone n’a pas de sigle dans les données IANA, c’est le décalage qui s’affiche, et non une supposition d’allure plausible. Là où aucun avis n’existe, aucune note n’est revendiquée.
- **Aucun appel réseau à l’exécution.** Le lever et le coucher du soleil sont calculés à partir de la latitude et de la longitude avec l’algorithme solaire de la NOAA, pas récupérés ailleurs.

## Corrections

Si quelque chose ici est faux, cela compte : toute la valeur d’un ouvrage de référence tient à sa justesse. Les coordonnées figurent sur la [page de contact](/fr/contact/).
