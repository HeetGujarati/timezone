---
title: "Pourquoi EST est ambigu, et quoi employer à la place"
description: "IST signifie trois choses différentes. CST, quatre. Les sigles de fuseau ne sont pas des identifiants, et les traiter comme tels crée de vrais bogues."
summary: "Les sigles de fuseau horaire sont des étiquettes informelles, sans organisme responsable et sans garantie d’unicité. IST, c’est l’Inde, l’Irlande et Israël ; CST, l’Amérique, la Chine et Cuba. Employez les identifiants IANA."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 10
keywords: ['est ambigu', 'sigles fuseaux horaires', 'signification ist', 'fuseau cst']
related: ['how-time-zones-work', 'time-zones-in-code', 'what-utc-really-is']
---

Une invitation d’agenda annonce « 14:00 IST ». Selon l’expéditeur, cela fait 08:30 UTC, 13:00 UTC ou 12:00 UTC. Rien dans la chaîne ne dit lequel, et les trois lectures sont un usage correct.

Les sigles de fuseau sont informels. Aucun organisme de normalisation ne les attribue, aucun ne garantit leur unicité, et plusieurs sont activement disputés. Ils conviennent dans une conversation entre gens qui partagent le contexte, et sont dangereux partout ailleurs.

## Les collisions qui comptent

**IST** — trois sens, tous en usage :

| Sens                       | Décalage  | Fuseau                        |
| -------------------------- | --------- | ----------------------------- |
| Indian Standard Time       | UTC+05:30 | `Asia/Kolkata`                |
| Irish Standard Time        | UTC+01:00 | `Europe/Dublin` (été seul)    |
| Israel Standard Time       | UTC+02:00 | `Asia/Jerusalem`              |

L’Inde et l’Irlande sont séparées de quatre heures et demie. Une réunion posée dans le mauvais IST n’est pas légèrement en avance : elle rate presque une journée de travail.

**CST** — quatre sens :

| Sens                                   | Décalage  | Fuseau               |
| -------------------------------------- | --------- | -------------------- |
| Central Standard Time (Amérique du N.) | UTC-06:00 | `America/Chicago`    |
| China Standard Time                    | UTC+08:00 | `Asia/Shanghai`      |
| Cuba Standard Time                     | UTC-05:00 | `America/Havana`     |
| Central Standard Time (Australie)      | UTC+09:30 | `Australia/Adelaide` |

Chicago et Shanghai sont séparées de quatorze heures.

**PST** — Pacific Standard Time à UTC-08:00, et Philippine Standard Time à UTC+08:00. Exactement seize heures d’écart, ce qui veut dire qu’une erreur atterrit un autre jour du calendrier.

**BST** — British Summer Time à UTC+01:00, et Bangladesh Standard Time à UTC+06:00.

**EST** — Eastern Standard Time en Amérique du Nord à UTC-05:00, et historiquement le sigle employé par l’Australie pour ses États de l’est à UTC+10:00 avant l’adoption d’AEST. De vieux documents australiens emploient encore la forme nue.

## L’autre problème : les sigles sont saisonniers

Même là où un sigle est unique, il ne nomme que la moitié de l’année.

`America/New_York` est en EST de novembre à mars et en EDT de mars à novembre. « EST » en juillet ne décrit donc aucune horloge existante : le fuseau est alors en EDT. Les gens l’écrivent quand même, pour dire « heure de New York », et un système qui le prend au mot se trompe d’une heure pendant sept mois.

C’est pourquoi « EST » est le sigle le plus mal employé de l’internet : on s’en sert comme du nom d’un lieu, alors que c’est le nom d’une saison dans ce lieu.

## La plupart des fuseaux n’ont aucun sigle

Les fuseaux du monde anglophone ont pour la plupart des sigles en lettres. La plupart des fuseaux n’en ont pas.

Tokyo, Shanghai et São Paulo n’ont aucun sigle en lettres dans les données ICU qu’utilise n’importe quelle locale anglaise — ils sont rapportés comme « GMT+9 », « GMT+8 » et « GMT-3 ». On voit écrire « JST » pour le Japon, et cela se comprend, mais c’est un usage, pas une donnée.

D’où une tentation évidente pour qui construit un outil de fuseaux horaires : combler les trous. Inventer « JST » parce que cela paraît plausible, « BRT » pour le Brésil, quelque chose pour Katmandou. Ce site s’y refuse délibérément. Là où aucune locale ne porte de lettres, il affiche le décalage — car la seule promesse qu’il fait, c’est que les données viennent de la base IANA et non d’une supposition, et un sigle inventé est exactement le genre de fausseté plausible qui rend un ouvrage de référence peu digne de confiance.

## Quoi employer à la place

**Les identifiants IANA.** `America/New_York`, `Asia/Kolkata`, `Europe/Dublin`. Ils sont uniques, stables, et ils nomment un lieu avec son histoire de règles plutôt qu’une saison.

Ils survivent aussi aux changements de règles. Quand la Turquie a supprimé l’heure d’été en 2016, `Europe/Istanbul` a continué de désigner la Turquie. Tout code accroché à « EET » ou « EEST » a dû changer.

**Quand vous écrivez à des humains**, nommez la ville et le décalage : « 14 h 00 à Bombay (UTC+05:30) ». Un lecteur, où qu’il soit, peut agir sans savoir de quel IST il s’agissait.

**Dans les invitations d’agenda**, laissez l’agenda attacher le fuseau. Tout agenda moderne enregistre un identifiant de fuseau avec l’événement et convertit pour chaque participant. Taper un sigle dans le titre ruine précisément cela.

**Dans les interfaces et les données**, utilisez ISO 8601 avec un décalage explicite ou `Z`, et transportez l’identifiant à part quand vous devez savoir _où_ et pas seulement _quel décalage_.

## Quand il faut en déchiffrer un

Si vous avez reçu un sigle et ne pouvez pas demander, servez-vous du contexte :

- Qui l’a envoyé ? Une entreprise indienne veut dire l’Inde, une irlandaise l’Irlande.
- Quel décalage rendrait l’horaire proposé sensé pour elle ? Personne ne cale un appel à 03:00.
- Une ville figure-t-elle dans le fil ? Une ville tranche complètement.

Et si l’enjeu est réel — un appel client, une échéance, une fenêtre de déploiement — demandez. Dix secondes de « c’est l’Inde ou l’Irlande ? » coûtent moins cher que l’inverse, et la personne interrogée s’est sans doute posé la même question.

## Les sigles qui sont sûrs

Tous ne sont pas disputés. Quelques-uns sont uniques en pratique et raisonnablement sûrs en prose, quoique jamais dans du code :

- **UTC** — un seul sens, par définition
- **CEST** — Central European Summer Time, unique
- **AEDT** / **AEST** — Australian Eastern, sans ambiguïté depuis l’adoption du préfixe A
- **NZDT** / **NZST** — Nouvelle-Zélande
- **JST** — le Japon, par convention et non par donnée ; ICU ne le porte pour aucune locale anglaise

Notez le motif : les sûrs sont ceux qui portent un préfixe de pays ou de continent. « Eastern Standard Time » ne pouvait qu’entrer en collision, puisque plus d’un continent a un est.

## Ce que la base IANA dit des sigles

La base enregistre bien des sigles, dans un champ par période de fuseau, mais les traite comme informels. Sa propre documentation note qu’ils ne sont ni uniques ni normalisés, et que certains ont été inventés par les mainteneurs de la base là où aucun sigle local n’existait.

Plusieurs ont été retirés avec le temps parce que c’étaient des inventions. Des fuseaux qui portaient jadis des codes de trois lettres inventés rapportent aujourd’hui une forme numérique comme `+0545`, précisément parce qu’un sigle fabriqué est pire qu’un décalage honnête.

Ce jugement éditorial — qu’une invention plausible vaut moins que l’aveu d’une absence — est celui qu’applique aussi ce site. C’est pourquoi la colonne des sigles sur une page de Tokyo affiche UTC+9 et non JST.
