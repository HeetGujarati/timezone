---
title: 'Ce qu’est vraiment UTC, et en quoi cela diffère de GMT'
description: 'UTC est un standard tenu par des horloges atomiques. GMT est un fuseau tenu par la Terre. Ils concordent le plus souvent, et la différence compte.'
summary: 'UTC n’est pas un fuseau horaire. C’est le standard de référence auquel chaque fuseau se rapporte, entretenu par quelque 450 horloges atomiques, et il ne bouge jamais pour l’heure d’été — c’est précisément pour cela que les systèmes s’en servent.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 2
keywords: ['qu’est-ce que utc', 'utc et gmt', 'temps universel coordonné', 'utc expliqué']
related: ['how-time-zones-work', 'iso-8601-explained', 'time-zones-in-code']
---

On emploie « UTC » et « GMT » comme si c’était la même chose. La plupart du temps rien ne casse, parce que la plupart du temps les deux affichent la même heure. Mais ce sont des objets de nature différente, et cette différence explique pourquoi l’un est ce qu’il faut stocker en base et l’autre non.

## UTC est un standard, pas un lieu

Le temps universel coordonné est tenu par le Bureau international des poids et mesures à partir d’une moyenne pondérée d’environ 450 horloges atomiques réparties dans quelque 85 institutions à travers le monde. Ces horloges mesurent la fréquence de résonance d’atomes de césium 133, stable à environ une seconde sur 100 millions d’années.

L’heure locale de personne n’est UTC par la loi. Même le Royaume-Uni, assis sur le méridien d’origine, est à UTC+1 sept mois par an. UTC est le point fixe à partir duquel toute heure locale se décrit — le zéro de la règle, non une marque sur la carte.

La propriété la plus importante pour qui construit du logiciel : **UTC ne se décale jamais pour l’heure d’été.** Aucune variation saisonnière, aucune histoire politique, aucune exception. C’est toute la raison pour laquelle l’aviation, la marine marchande, le règlement financier et tout système distribué existant s’en servent.

## GMT est un fuseau horaire avec un parcours professionnel

Le temps moyen de Greenwich est le temps solaire moyen à l’Observatoire royal de Greenwich. Il est défini par la rotation de la Terre, qui n’est pas un instrument de précision : la planète oscille, ralentit irrégulièrement et accélère de temps à autre.

De 1884 à 1972, GMT a été le standard de temps mondial. UTC l’a remplacé précisément parce que les horloges atomiques se sont révélées une meilleure référence qu’une planète. GMT survit comme nom de fuseau — celui que le Royaume-Uni utilise en hiver, et celui que plusieurs pays d’Afrique de l’Ouest utilisent toute l’année.

Donc : **UTC n’observe jamais l’heure d’été. GMT, tel que le Royaume-Uni l’emploie, si** — la Grande-Bretagne le quitte chaque mars pour le British Summer Time et y revient chaque octobre. Si un collègue britannique dit « 15 h GMT » en juillet, il veut presque à coup sûr dire 15 h BST, soit 14 h UTC. L’erreur est assez fréquente pour qu’il vaille mieux demander que supposer.

## Pourquoi l’abréviation est UTC

Ni l’acronyme anglais ni le français n’a gagné. Les anglophones proposaient CUT pour « coordinated universal time ». Les francophones proposaient TUC pour « temps universel coordonné ». L’Union internationale des télécommunications a tranché pour UTC, qui ne correspond à aucune des deux langues et froisse donc les deux à égalité. À sa manière, un résultat diplomatique parfait.

## Les secondes intercalaires et leur abolition à venir

La Terre ne tourne pas à vitesse constante. Pour empêcher UTC de dériver du temps solaire, des secondes supplémentaires ont parfois été insérées : 27 entre 1972 et 2016. Pendant une seconde intercalaire, une horloge UTC affiche 23:59:60 — une heure bien réelle que la plupart des logiciels ne savent pas représenter.

Ces secondes ont provoqué de vraies pannes. En 2012, l’une d’elles a mis à terre Reddit, les services de Mozilla et plusieurs systèmes de réservation aérienne, tous par le même bogue du noyau Linux. En 2017, le DNS de Cloudflare est tombé parce qu’un calcul de durée est passé en négatif au franchissement de l’insertion.

En novembre 2022, la Conférence générale des poids et mesures a voté l’arrêt des secondes intercalaires d’ici 2035. UTC sera alors autorisé à dériver du temps solaire, et l’on rouvrira le dossier quand l’écart deviendra gênant — sans doute dans un siècle environ.

Votre navigateur n’expose pas les secondes intercalaires. L’horloge de JavaScript fait comme si elles n’avaient jamais existé, de sorte qu’une durée qui en franchit une est rapportée une seconde trop courte. Pour presque tous les usages, c’est le bon compromis ; si vous faites de la navigation par satellite, vous le saviez déjà.

## Ce qu’il faut réellement faire

**Stockez les horodatages en UTC.** Pas dans le fuseau de l’utilisateur, pas dans celui du serveur, pas dans celui du siège social. Un instant UTC est sans ambiguïté, triable et insensible au fait qu’un gouvernement change d’avis.

**Convertissez en heure locale au moment de l’affichage**, avec le fuseau du lecteur et la copie de la base IANA de l’environnement.

**Dites UTC quand vous voulez dire UTC.** Écrire « GMT » dans une spécification invite quelqu’un à l’interpréter comme l’heure locale britannique, et l’été cela fait une heure d’écart. « 12:00 UTC » a exactement un sens, tous les jours de l’année.

**Utilisez le suffixe Z d’ISO 8601.** `2026-03-08T14:30:00Z` est de l’UTC et ne peut se lire autrement. `2026-03-08T14:30:00` est une heure locale dans un fuseau non précisé, autrement dit ce n’est pas un horodatage du tout.

## La famille des échelles de temps

UTC appartient à un ensemble d’échelles apparentées, et les différences comptent à l’occasion.

**TAI** — le temps atomique international. L’échelle atomique brute, sans secondes intercalaires. TAI est actuellement en avance de 37 secondes sur UTC, et l’écart croît à chaque insertion. Les satellites GPS tournent sur une échelle décalée par rapport au TAI.

**UT1** — la rotation réelle de la Terre, mesurée par rapport à des quasars lointains. C’est ce que les secondes intercalaires d’UTC poursuivaient. UTC est tenu à moins de 0,9 seconde d’UT1 — ou l’était, jusqu’à la décision de 2035.

**Temps GPS** — aligné sur UTC en janvier 1980, il ignore les secondes intercalaires depuis. Il est aujourd’hui en avance de 18 secondes sur UTC. Les récepteurs corrigent ; les systèmes qui lisent le temps GPS brut, parfois non.

**Temps Unix** — le compte des secondes depuis 1970, qui feint l’inexistence des secondes intercalaires en répétant une seconde plutôt qu’en la comptant. Ce n’est donc pas tout à fait un compte de secondes écoulées, subtilité qui a mordu ceux qui mesuraient des durées à cheval sur une insertion.

Pour la quasi-totalité des logiciels, UTC est la bonne réponse et le reste est de la culture générale. Pour tout ce qui touche aux satellites, aux horodatages du trading haute fréquence ou à l’instrumentation scientifique, ces distinctions portent la charge.

## Pourquoi « heure UTC » est redondant, et pourquoi nous l’écrivons quand même

Le T signifie « time », donc « heure UTC » revient à dire « heure temps universel coordonné ». Les puristes s’en offusquent.

Les pages de ce site écrivent « heure UTC » malgré tout, dans les titres et les intitulés, parce que c’est ce que les gens cherchent et ce qu’ils tapent. Il existe une forme de correction qui vous coûte le lecteur, et le pédantisme sur un sigle est en plein dedans. Dans le corps du texte, où le lecteur est déjà arrivé, c’est simplement UTC.
