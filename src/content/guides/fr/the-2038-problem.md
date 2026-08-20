---
title: 'Le problème de 2038, expliqué correctement'
description: 'À 03:14:07 UTC le 19 janvier 2038, le temps Unix signé sur 32 bits déborde. Voici ce qui casse réellement, et ce qui est déjà corrigé.'
summary: 'Les systèmes qui stockent le temps comme un compte de secondes signé sur 32 bits arrivent à court de place en janvier 2038 et repartent en décembre 1901. La plupart des plateformes modernes ont corrigé cela depuis des années ; l’exposition se trouve aujourd’hui dans l’embarqué, le patrimonial et les données sérialisées.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 6
keywords: ['problème 2038', 'bogue de l’an 2038', 'débordement timestamp unix', 'y2038']
related: ['time-zones-in-code', 'iso-8601-explained', 'what-utc-really-is']
---

À 03:14:07 UTC le 19 janvier 2038, le nombre de secondes écoulées depuis le 1er janvier 1970 atteint 2 147 483 647. C’est la plus grande valeur que peut contenir un entier signé de 32 bits. Une seconde plus tard, il bascule à −2 147 483 648, que ces systèmes lisent comme le 13 décembre 1901.

C’est un vrai problème doté d’une date ferme, ce qui le rend inhabituel parmi les problèmes logiciels.

## Pourquoi 32 bits

Le temps Unix a été conçu au début des années 1970, quand un entier de 32 bits était la taille de mot naturelle et que 68 ans de marge semblaient généreux. Le type `time_t` sur ces systèmes était un entier signé de 32 bits, et ce choix s’est propagé dans C, dans tous les langages qui ont enveloppé C, dans des formats de fichier, dans des protocoles réseau et dans des schémas de base de données.

C’est le signe qui donne au débordement son symptôme caractéristique. Un compte non signé de 32 bits tiendrait jusqu’en 2106 ; un compte signé partage sa plage autour de 1970, si bien que le débordement atterrit en 1901 plutôt qu’à zéro.

## Ce qui s’est déjà produit

Le problème de 2038 tombe en production depuis des années, parce que les logiciels calculent couramment des dates futures.

- Les calculs de prêts immobiliers sur trente ans ont commencé à franchir la frontière dès 2008.
- Des dates d’expiration de certificats, des durées de vie de cache et des tâches planifiées l’ont heurté à répétition.
- En 2006, un bogue dans le délai de base de données par défaut d’AOLserver — fixé à un milliard de secondes, ce qui allait très bien jusqu’à ce que non — a mis le logiciel à terre quand l’expiration calculée a débordé.

Le motif : la panne arrive bien avant la date, dans le code qui regarde le plus loin devant.

## Ce qui est déjà corrigé

La situation est nettement meilleure que la panique ne le laisse croire.

- **Systèmes 64 bits** : `time_t` fait 64 bits sur pratiquement toute plateforme 64 bits. Cela s’épuise dans environ 292 milliards d’années.
- **Linux en 32 bits** : le noyau 5.6 (mars 2020) a introduit `time_t` sur 64 bits pour les architectures 32 bits, et les grandes distributions ont livré l’espace utilisateur correspondant.
- **JavaScript** : utilise un flottant double précision pour les millisecondes, valable sur environ 275 000 ans de part et d’autre de 1970. Il n’a jamais eu ce problème.
- **Java** : `Instant` utilise un compte de secondes sur 64 bits plus des nanosecondes.
- **Python** : les entiers sont de précision arbitraire ; la contrainte vient de la bibliothèque C de la plateforme.
- **PostgreSQL, MySQL 8.0.28 et suivants, SQL Server** : stockage des horodatages sur 64 bits.

## Où l’exposition demeure

**Les systèmes embarqués.** Automates industriels, dispositifs médicaux, électronique de véhicule, compteurs et capteurs, souvent conçus pour 20 ou 30 ans de service, souvent sans voie de mise à jour, souvent déjà déployés. C’est là que se concentre le vrai risque, et il n’est recensé nulle part.

**Le type `TIMESTAMP` de MySQL avant 8.0.28.** C’est un compte de secondes sur 32 bits, dont le maximum documenté est 2038-01-19 03:14:07. `DATETIME` n’a jamais été concerné. Une quantité considérable de données de production réside dans le type de colonne touché.

**Les données sérialisées et les formats de fichier.** Tout ce qui a écrit un champ temporel de 32 bits reste un champ de 32 bits, si récent que soit le lecteur. Vieux formats d’archive, protocoles binaires et structures sur disque transportent la contrainte vers l’avant.

**Les compilations 32 bits encore en service.** Certains routeurs, décodeurs et appareils à longue durée de vie font tourner un espace utilisateur 32 bits sur un noyau non corrigé.

## Que faire

**Auditez les types de stockage.** Cherchez les colonnes `int(11)` contenant des horodatages, les `TIMESTAMP` MySQL sur d’anciennes versions et tout format binaire doté d’un champ temporel de 32 bits. C’est là que les données survivent au code.

**Testez avec des dates postérieures à 2038.** Fixez un jeu d’essai à 2040 et lancez votre suite. La plupart des bogues de 2038 se reproduisent trivialement dès que quelqu’un essaie.

**Préférez des entiers 64 bits ou des chaînes ISO 8601.** Un `BIGINT` de millisecondes ou une colonne `TIMESTAMPTZ` n’a pas d’horizon qui vaille qu’on y pense. Une chaîne ISO 8601 n’en a aucun, au prix de la taille et de la vitesse de comparaison.

**Ne stockez plus jamais une date sur quoi que ce soit de 32 bits.** L’économie de place est dérisoire sur du matériel moderne et l’horizon tombe désormais à l’intérieur de la durée de vie d’un logiciel ordinaire.

## Les autres horizons

2038 est le plus proche, pas le seul.

- **2036** : le champ d’ère 32 bits de NTP boucle le 7 février. NTPv4 le gère, mais les déploiements varient.
- **2106** : les comptes de secondes non signés sur 32 bits bouclent.
- **2262** : les comptes de _nanosecondes_ sur 64 bits débordent — c’est le cas de `time.Time` en Go dans sa représentation en nanosecondes, et du `datetime64[ns]` par défaut de pandas.

Ce dernier est plus proche qu’il n’y paraît pour quiconque écrit du code de traitement de données, et c’est la même erreur à une autre échelle : une unité assez fine pour être utile, dans une largeur qui semblait généreuse à l’époque.

## Comment vérifier vos propres systèmes

Quatre vérifications, par effort croissant.

**Vérifiez les types de colonnes de votre base.** En PostgreSQL, `SELECT column_name, data_type FROM information_schema.columns WHERE data_type LIKE '%timestamp%'` vous dit ce que vous avez ; `timestamp with time zone` fait 64 bits et ne craint rien. En MySQL, cherchez les colonnes `TIMESTAMP` sur des serveurs antérieurs à 8.0.28 : ce sont les exposées, et `DATETIME` ne l’a jamais été.

**Avancez une horloge.** Dans un conteneur jetable, réglez la date système sur 2040 et lancez votre suite de tests. C’est rustique et cela trouve étonnamment beaucoup de choses, car la plupart des bogues de 2038 ne sont pas subtils une fois la frontière franchie.

**Cherchez les types temporels 32 bits.** En C et C++, tout `int` ou `long` explicite contenant une valeur temporelle sur une cible 32 bits. Dans les schémas de sérialisation, tout champ temporel de 4 octets. Dans le code applicatif, tout endroit où un horodatage est converti en entier 32 bits pour le stockage ou la transmission.

**Testez le futur lointain dans les fixtures, pas seulement le futur proche.** Un test qui utilise « maintenant plus un jour » passera jusqu’en 2038 puis échouera un mardi. Un test qui utilise une date explicite en 2040 échoue aujourd’hui, tant qu’il y a quelqu’un pour le corriger.

## Ce qu’il ne faut pas faire

Ne « réglez » pas cela en passant à des entiers non signés de 32 bits. Cela achète 68 ans, fait perdre la capacité de représenter toute date antérieure à 1970, et renvoie la même conversation à qui maintiendra le système en 2106. L’écart entre 4 et 8 octets ne vaut pas une seconde migration.

Ne supposez pas qu’un langage moderne vous protège. Le code applicatif peut être parfaitement sûr alors que les données qu’il lit ont été écrites par quelque chose qui ne l’était pas : les formats de fichier et les protocoles de communication transportent la contrainte à travers chaque réécriture.
