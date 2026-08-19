---
title: "Pourquoi l'Inde vit une demi-heure à côté d'UTC"
description: "Les décalages d'une demi-heure ou de 45 minutes ne sont pas des accidents géographiques : ce sont des compromis, des affirmations d'indépendance."
summary: "L'Inde vit à UTC+05:30 parce qu'elle a coupé la poire en deux entre deux fuseaux proposés. Le Népal vit à UTC+05:45 en partie pour ne pas être l'Inde. Chaque décalage inhabituel a une histoire, et la plupart sont politiques."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 12
keywords: ['pourquoi inde demi-heure', 'népal 45 minutes', 'fuseau horaire demi-heure', 'histoire de l heure normale de l inde']
related: ['offsets-that-are-not-whole-hours', 'how-time-zones-work', 'the-international-date-line']
---

La question évidente à propos de l'heure normale de l'Inde est de savoir pourquoi elle n'est à un nombre entier d'heures de rien. La réponse tient en ceci : les fuseaux horaires sont décidés par les gouvernements, et les gouvernements n'optimisent pas le confort de votre bibliothèque de dates.

## L'Inde : un pays, deux fuseaux naturels, un compromis

L'Inde s'étend sur environ 29 degrés de longitude — du Gujarat à l'ouest à l'Arunachal Pradesh à l'est. De quoi couvrir près de deux heures de temps solaire. Selon la logique ordinaire des fuseaux, l'Inde devrait en avoir deux.

Sous domination britannique, elle en avait de fait. L'heure de Bombay et celle de Calcutta étaient distinctes, séparées d'environ 39 minutes, et celle de Madras s'intercalait entre les deux comme norme ferroviaire. Lorsque l'Inde a unifié son heure après l'indépendance en 1947, elle a choisi un fuseau unique à UTC+05:30 — 82,5° est, le méridien passant près de Mirzapur, presque exactement entre les deux anciennes normes.

Le motif était l'unité nationale et la simplicité administrative, et le prix en est réel. En été, le soleil se lève en Arunachal Pradesh vers 4 h et se couche vers 16 h, tandis que les bureaux suivent des horaires calés sur Delhi. L'industrie du thé de l'Assam pratique depuis plus d'un siècle une « heure du bagan » officieuse, en avance d'une heure, précisément parce que l'horloge nationale ne convient pas. Des propositions de second fuseau indien reviennent tous les quelques années et sont rejetées chaque fois pour les mêmes raisons.

## Le Népal : quarante-cinq minutes de souveraineté

Le Népal est à UTC+05:45. Quinze minutes devant l'Inde, et le seul fuseau au monde à ce décalage.

La justification géographique est le Gaurishankar, une montagne à l'est de Katmandou servant de référence méridienne nationale. La justification politique est que le Népal n'est pas l'Inde, et quinze minutes sont une manière peu coûteuse et durable de le dire. Le Népal est passé de UTC+05:30 à UTC+05:45 en 1986.

Les deux récits sont vrais, et les habitants vous serviront l'un ou l'autre selon la façon dont la question est posée. Ce qui compte en pratique, c'est que le décalage est exact et permanent — le Népal n'applique pas l'heure d'été — et que quantité de logiciels se trompent en l'arrondissant à +05:30 ou +06:00.

## Îles Chatham : 45 minutes et heure d'été

Les îles Chatham, à environ 800 kilomètres à l'est de la Nouvelle-Zélande, sont à UTC+12:45 en hiver et UTC+13:45 en été. Environ 600 personnes y vivent.

Le décalage suit à peu près le soleil : les îles sont assez loin à l'est de la Nouvelle-Zélande continentale pour justifier ces 45 minutes supplémentaires. L'heure d'été est héritée de la Nouvelle-Zélande, ce qui fait de ces îles l'un des deux seuls endroits sur terre à cumuler un décalage au quart d'heure et un changement saisonnier.

## Île Lord Howe : le décalage saisonnier de 30 minutes

L'île Lord Howe, au large de l'est de l'Australie, environ 380 habitants, est à UTC+10:30 en hiver et UTC+11:00 en été. Elle décale de **trente minutes**, et c'est le seul endroit au monde à le faire.

Le motif était la mesure. L'île voulait une heure d'été alignée sur le continent de Nouvelle-Galles du Sud, mais a jugé une heure entière excessive pour un lieu aussi petit ; elle a donc coupé la poire en deux en 1981. Il en résulte le meilleur cas de test au monde pour le code de gestion des dates : toute bibliothèque qui fige un décalage saisonnier de 60 minutes se trompe sur l'île Lord Howe et a raison partout ailleurs, ce qui veut dire qu'elle passera tous les tests que vous écrirez, sauf celui-là.

## Ceux qui ont disparu

**Pays-Bas : UTC+00:19:32,13.** De 1909 à 1937, les Pays-Bas ont vécu à l'heure moyenne locale d'Amsterdam, spécifiée à la seconde. Elle fut arrondie à +00:20 en 1937 puis abandonnée au profit de l'heure d'Europe centrale en 1940. La base de l'IANA la conserve toujours, et c'est pourquoi les décalages dans le moteur de ce site sont calculés en secondes plutôt qu'en minutes : un environnement d'exécution interrogé sur une date néerlandaise de 1920 répondra cette valeur, et l'arrondir serait un petit mensonge.

**Liberia : UTC-00:44:30.** Jusqu'en 1972, le Liberia était 44 minutes et 30 secondes derrière Greenwich, dernier pays au monde à afficher un décalage qui n'était pas un nombre entier de minutes.

**Singapour : cinq changements.** Singapour est passée par +06:55:25, +07:00, +07:20, +07:30, +09:00 et aujourd'hui +08:00. Elle se trouve à l'ouest du méridien qui justifierait +08:00, et y reste pour s'aligner sur la Malaisie, qui a changé en 1982.

## Le motif récurrent

Aucun de ces décalages ne concerne le soleil. L'Inde a coupé une différence politique. Le Népal a affirmé son indépendance. Singapour a suivi un partenaire commercial. Lord Howe a transigé avec elle-même.

D'où l'argument en faveur du choix de conception qui sous-tend chaque page de ce site : **ne calculez jamais un décalage à partir de la longitude, et n'en stockez jamais dans une table que vous entretenez**. Interrogez la base de l'IANA, qui consigne ce que chaque gouvernement a réellement décidé, y compris les décisions dénuées de sens astronomique — car ce sont précisément celles dans lesquelles vivent vos utilisateurs.

## La déclaration de trente minutes de la Corée du Nord

En août 2015, la Corée du Nord a reculé ses horloges de 30 minutes, passant de UTC+09:00 à UTC+08:30, et a baptisé le résultat heure de Pyongyang. Le motif annoncé était d'annuler un changement imposé pendant l'occupation japonaise, qui avait aligné la Corée sur Tokyo.

L'effet pratique fut que la Corée du Nord et la Corée du Sud, qui partageaient la même horloge depuis 1961, se retrouvaient séparées de 30 minutes.

En mai 2018, après le sommet intercoréen de Panmunjom, la Corée du Nord est revenue à UTC+09:00. L'annonce présentait la chose comme un premier pas concret vers la réunification ; pendant les pourparlers, les horloges de la Maison de la Paix avaient affiché les deux heures côte à côte.

Deux versions de tzdata à trois ans d'écart, pour un changement qui n'avait rien à voir avec le soleil et tout à voir avec la politique. C'est le cas normal, non l'exception.

## La demi-heure du Venezuela, et son retour en arrière

En décembre 2007, le Venezuela est passé de UTC-04:00 à UTC-04:30, un décalage d'une demi-heure que le gouvernement présenta comme offrant aux enfants plus de lumière du jour sur le chemin de l'école. En mai 2016, il est revenu en arrière, cette fois au titre d'une mesure d'économie d'énergie pendant une grave crise de l'électricité.

Neuf ans à un décalage inhabituel, puis retour. Tout système ayant codé en dur le décalage du Venezuela a dû être modifié deux fois.

## La leçon pour quiconque stocke du temps

Ce ne sont pas des cas limites au sens où ils seraient rares. À elles toutes, ces pages ont décrit des changements de décalage au Népal, aux Samoa, aux Tokélaou, en Corée du Nord, au Venezuela, en Turquie, en Russie, en Iran, au Mexique, au Brésil et en Égypte — tous de mémoire d'homme, la plupart au cours des deux dernières décennies.

La base de l'IANA absorbe chacun d'eux dans une version. Une table figée n'en absorbe aucun, échoue en silence, et l'échec ressemble à une erreur de planification humaine plutôt qu'à un défaut du logiciel.
