---
title: 'La ligne de changement de date et ses détours'
description: "La ligne de changement de date n'est pas un méridien. Elle zigzague autour des pays qui préfèrent ne pas être coupés en deux, et elle a bougé."
summary: "La ligne internationale de changement de date ne suit le 180e méridien que de loin : elle contourne les Kiribati, la Russie et les Aléoutiennes, et des pays se sont eux-mêmes déplacés d'un côté à l'autre pour des raisons commerciales."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 11
keywords:
  [
    'ligne internationale de changement de date',
    'ligne de changement de date expliquée',
    'fuseau horaire kiribati',
    'jour avant jour après',
  ]
related: ['how-time-zones-work', 'offsets-that-are-not-whole-hours', 'what-utc-really-is']
---

Si vous naviguez assez longtemps vers l'ouest depuis Los Angeles, vous gagnez une heure tous les quinze degrés de longitude environ, et après vingt-quatre gains de ce genre vous auriez un jour entier de décalage avec ceux que vous avez quittés. La ligne internationale de changement de date est l'endroit où ce jour est rendu.

Ce n'est pourtant pas une ligne. C'est une frontière négociée, qui s'incurve autour des pays qu'elle couperait sinon en deux.

## Par où elle passe réellement

Dans le Pacifique, la ligne suit grossièrement le 180e méridien, choisi en 1884 parce qu'il est le plus exactement opposé à Greenwich et qu'il traverse très peu de terres. Puis elle fait quatre détours notables :

**Vers le nord, autour des Aléoutiennes.** Elle oblique vers l'est afin que toute l'Alaska garde la même date au lieu de scinder le chapelet d'îles.

**Autour de la Russie.** Une courbe vers l'ouest maintient la Tchoukotka du côté asiatique.

**Vers l'est, autour des Kiribati.** Le plus grand détour, et le plus intéressant. Les Kiribati sont à cheval sur le 180e méridien et, jusqu'en 1995, le pays était partagé entre deux dates : ses îles occidentales avaient un jour d'avance sur les orientales. Les bureaux du gouvernement à Tarawa ne partageaient que quatre jours ouvrés par semaine avec ceux des îles de la Ligne. En 1995, les Kiribati ont déplacé la ligne vers l'est, plaçant tout le pays à la même date et repoussant la frontière jusqu'à 150° ouest — un renflement d'environ 2 000 kilomètres. Le pays s'est ainsi doté du fuseau le plus avancé de la planète, UTC+14, et donc du premier lever de soleil de l'an 2000, que le gouvernement a promu avec entrain.

**Vers le sud, autour des Samoa et des Tonga.** Le propre saut des Samoa en 2011 est le meilleur exemple moderne d'une ligne qui relève de l'économie et non de la géographie.

## Le jour manquant des Samoa

Jusqu'en 2011, les Samoa se trouvaient du côté américain de la ligne, trois heures derrière Sydney mais aussi un jour derrière. Leurs principaux partenaires commerciaux étaient passés des États-Unis à l'Australie et à la Nouvelle-Zélande, et ce décalage d'un jour ne laissait que quatre jours ouvrés communs par semaine : le vendredi samoan était le samedi australien, et le dimanche samoan le lundi australien.

À minuit le 29 décembre 2011, les Samoa ont sauté directement au 31 décembre. **Le 30 décembre 2011 n'a pas existé aux Samoa.** Personne n'a eu d'anniversaire, aucun contrat n'est arrivé à échéance, et le pays est passé de UTC-11 à UTC+13.

Les Tokélaou, administrées par la Nouvelle-Zélande, ont fait le même saut la même nuit.

Les Samoa avaient accompli l'inverse en 1892, passant du côté asiatique au côté américain à la demande de commerçants américains — en célébrant deux fois le 4 juillet pour y parvenir, ce qui fut présenté comme une faveur faite à la communauté américaine.

## L'amplitude de 26 heures

À cause de ces détours, les décalages du monde couvrent plus de vingt-quatre heures :

- **UTC+14** — Kiritimati (île Christmas), Kiribati. L'horloge la plus avancée de la planète
- **UTC+13** — Samoa, Tonga et les îles Phœnix des Kiribati
- **UTC-11** — Samoa américaines, Niue
- **UTC-12** — îles Baker et Howland, territoires inhabités des États-Unis

Cela fait 26 heures d'amplitude, avec une conséquence qu'il vaut la peine d'intégrer : **il existe des moments où trois dates différentes du calendrier sont en usage simultanément quelque part sur terre**. Pendant environ deux heures chaque jour, Kiritimati est à une date, la plus grande partie du monde à la suivante, et l'île Baker à la précédente.

Tout code qui suppose qu'une fenêtre de deux jours couvre tous les fuseaux se trompe pendant ces intervalles. Toute question du type « quel jour est-il à l'échelle mondiale » n'a pas de réponse.

Kiritimati et l'île Baker sont distantes d'environ 2 100 kilomètres et de 26 heures d'horloge. On pourrait, en principe, voir deux fois le même coucher de soleil.

## Ce que cela change en pratique

**Convertir en traversant la ligne change la date, pas seulement l'heure.** Tokyo un lundi soir, c'est Los Angeles un lundi matin ; Auckland un lundi matin, c'est Honolulu un dimanche après-midi. Chaque page de conversion de ce site signale explicitement le changement de jour pour exactement cette raison : une heure juste au mauvais jour est une erreur d'un genre particulier.

**« Demain » n'est pas une notion mondiale.** Une échéance « fin de journée vendredi » désigne des instants différents selon les personnes, et pour un public véritablement mondial l'écart entre le premier vendredi qui s'achève et le dernier dépasse une journée. Dites « vendredi 23 h 59 UTC » si vous pensez à un moment unique.

**La ligne se déplace.** Pas souvent, mais c'est une frontière politique et elle a changé de mémoire d'homme — deux fois au cours de ce siècle. Tout système dont le tracé est figé dans le code finira par se tromper. La base de l'IANA suit ces changements ; c'est sa raison d'être.

## La franchir en pratique

Les vols au-dessus du Pacifique produisent des heures d'arrivée qui ressemblent à des erreurs sans en être.

Un vol qui quitte Tokyo à 17 h le lundi et dure neuf heures atterrit à Los Angeles à 10 h le **lundi** — sept heures avant son départ, à l'horloge. Dans l'autre sens, un vol quittant Los Angeles le lundi après-midi arrive à Tokyo le mercredi matin, ayant sauté le mardi presque en entier.

Ni l'un ni l'autre n'est un paradoxe. Le vol a duré neuf heures dans les deux sens ; seules les étiquettes ont changé. C'est exactement pourquoi le calculateur de durée de ce site ramène les deux extrémités à des instants avant de soustraire : la différence entre deux lectures d'horloge de part et d'autre de la ligne n'a aucun sens, tandis que la différence entre deux instants est toujours le temps réellement écoulé.

La conséquence pratique pour quiconque construit un logiciel de réservation ou de logistique : **ne calculez jamais une durée en soustrayant des heures locales**. C'est juste la plupart du temps, et c'est ce qui rend la méthode dangereuse.

## Quel côté est « en avance »

La convention déroute parce qu'elle inverse l'intuition que donne une carte. Les pays juste à l'_ouest_ de la ligne — Nouvelle-Zélande, Fidji, Kiribati — voient chaque jour nouveau les premiers. Ceux qui sont juste à l'_est_ — Hawaï, Samoa américaines — les derniers.

Auckland a donc près d'une journée entière d'avance sur Honolulu alors que 7 000 kilomètres environ les séparent, et les deux villes sont à des dates différentes pendant la plus grande partie de chaque cycle de vingt-quatre heures.

La règle qui aide : la ligne est là où le jour _commence_, puis le jour balaie le globe vers l'ouest et revient à la ligne vingt-quatre heures plus tard, au moment où le suivant se lève. Kiritimati, à UTC+14, est le premier lieu habité à atteindre une date donnée. L'île Baker, à UTC-12, est le dernier.
