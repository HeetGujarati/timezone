---
title: "Organiser des réunions à douze heures d'écart"
description: "Quand deux équipes n'ont aucune heure de travail commune, la solution est structurelle et non un agenda plus malin. Voici ce qui marche vraiment."
summary: "Un écart de douze heures n'a pas de bonne heure de réunion, et aucun ombrage de grille n'y changera rien. Les équipes qui s'en sortent cessent d'en chercher une et changent leur façon de travailler."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 4
keywords:
  [
    'organiser des réunions entre fuseaux',
    'équipe à distance fuseaux horaires',
    'douze heures de décalage',
    'travail asynchrone',
  ]
related: ['how-to-run-a-global-standup', 'why-daylight-saving-exists', 'how-time-zones-work']
---

San Francisco et Bangalore sont à douze heures et demie l'une de l'autre. Une journée de 9 h à 18 h se termine chez l'une avant de commencer chez l'autre. Aucun agencement astucieux de l'agenda ne produit une heure de travail commune, parce qu'il n'y en a aucune à trouver.

La plupart des équipes le découvrent en essayant quand même, s'accordent sur 21 h pour un côté, puis en gardent rancune en silence pendant dix-huit mois. Ce qui suit est ce que font, à la place, les équipes qui s'en sortent bien.

## D'abord, être honnête sur l'arithmétique

Avant de négocier, calculez les chiffres réels, car ils sont souvent pires qu'on ne le suppose — et parfois meilleurs.

L'écart n'est pas fixe. New York et Sydney sont à 16 heures d'écart l'hiver boréal et à 14 l'été boréal, parce que les deux appliquent l'heure d'été à des saisons opposées. Ce balancement de deux heures fait la différence entre « une heure commune » et « aucune », et il survient sans que personne ne change quoi que ce soit.

Deux villes qui gardent le même décalage toute l'année — l'Inde et le Japon, disons — ont un écart qu'on peut mémoriser. Deux villes dont une seule applique l'heure d'été ont un écart qui bouge deux fois par an. Deux villes qui l'appliquent toutes deux mais à des dates différentes ont un écart faux quatre semaines par an environ.

## Les quatre options honnêtes

Il n'y en a que quatre, et tout arrangement viable en est une combinaison.

**1. Un côté se décale durablement.** La journée de travail de quelqu'un glisse de deux ou trois heures. Cela fonctionne, c'est stable, et ce n'est équitable que si une contrepartie l'accompagne : une journée centrale plus courte, une compensation, ou un vrai choix. L'imposer à l'équipe la plus junior, c'est ainsi que commence l'attrition.

**2. Faire tourner la contrainte.** L'appel pénible tourne : ce mois-ci tôt pour Bangalore, le mois prochain tard pour San Francisco. Plus équitable en principe, plus difficile en pratique, car il faut que quelqu'un tienne les comptes et fasse respecter la règle. Cela marche surtout pour un petit nombre de réunions à forte valeur.

**3. Se recouvrir volontairement, et étroitement.** Les deux côtés s'engagent à être disponibles pendant une heure précise, proche d'une extrémité de leur journée, et rien d'autre n'est planifié en travers de l'écart. Tout ce qui se passe dans cette heure, ce sont des décisions ; tout le reste s'écrit.

**4. Cesser de se réunir.** L'écart devient un atout : le travail est transmis à la fin de chaque journée et repris au début de celle d'en face. C'est la seule option qui tienne au-delà de deux sites, et celle qui exige le plus de changements dans la façon de travailler.

## Ce qu'exige une bonne transmission

L'option quatre est là où les équipes séparées de douze heures prospèrent ou se délitent, et la différence tient presque entièrement à l'écrit.

**Les décisions sont écrites, avec leur raisonnement.** Non pas « nous avons décidé d'utiliser Postgres », mais « nous avons retenu Postgres plutôt que DynamoDB parce que les schémas de requête sont relationnels et que le coût d'exploitation d'un second entrepôt de données l'emporte sur le débit d'écriture gagné ». La seconde version survit à une transmission ; la première engendre une réunion.

**Les questions sont posées avec assez de contexte pour être traitées pendant votre sommeil.** « Qu'est-ce que tu penses du schéma ? » coûte un aller-retour d'une journée entière. « Le schéma doit prendre en charge X et Y ; l'option A fait mieux X, l'option B fait mieux Y ; je penche pour A à cause de Z — dis-moi si tu n'es pas d'accord d'ici ton matin » se règle en un cycle.

**Les blocages sont signalés avant la transmission, pas au moment de celle-ci.** Le pire schéma dans une équipe asynchrone est de découvrir à 9 h que l'autre côté était bloqué hier à 17 h et n'a rien dit pendant onze heures.

**L'état d'avancement est visible sans qu'on le demande.** Un tableau, un canal, un document — n'importe quoi qui réponde à « que s'est-il passé pendant que je dormais » sans exiger que quelqu'un soit éveillé.

## Le piège de la réunion récurrente

Si vous planifiez malgré tout un appel récurrent en travers d'un large écart, sachez qu'il dérivera. Quand un côté change ses horloges et l'autre non, une réunion ancrée à un agenda se décale d'une heure sur l'autre. Deux fois par an, pendant quelques semaines, elle atterrit là où personne n'a donné son accord.

Les logiciels d'agenda gèrent cela correctement quand l'événement est enregistré avec un fuseau — un argument de plus pour choisir un fuseau d'ancrage explicitement, le dire dans l'invitation, et laisser l'agenda de chacun faire la conversion.

L'autre piège est la réunion planifiée quand l'équipe tenait dans trois fuseaux et qui tourne encore maintenant qu'elle en occupe six. Les réunions à large écart accumulent des participants pour qui l'horaire est bien pire que pour le groupe d'origine, et personne ne propose jamais de la déplacer, car la déplacer est le désagrément d'un autre.

## Quand il n'y a vraiment rien

Los Angeles et Bombay ne partagent aucune minute d'une journée de 9 h à 18 h, en aucune saison. Si votre équipe couvre cet écart et a besoin de décisions synchrones, quelqu'un travaille hors de sa journée — la seule question est qui, à quelle fréquence, et s'il y a consenti.

C'est un problème de gestion plutôt que de planification, et les outils ne peuvent pas le résoudre. Ce que les outils peuvent faire, c'est vous éviter de le découvrir dans l'invitation.

## Une note sur l'équité

L'arrangement qui s'installe est en général celui qui convient à qui détient le plus de pouvoir dans l'organisation, et il s'installe généralement sans que personne ne l'ait décidé.

Guettez le schéma où l'équipe la plus récente, la plus junior ou la plus éloignée prend systématiquement l'heure pénible. C'est rarement une décision ; c'est l'accumulation de petits réglages par défaut, chacun raisonnable pris isolément. Une fois installé, il est invisible pour ceux qu'il avantage et parfaitement visible pour tous les autres.

La parade concrète consiste à écrire qui supporte le coût, à le revoir à échéance fixe et à le traiter comme une vraie ligne budgétaire plutôt que comme de la bonne volonté. Les dates de changement d'heure d'été sont un rappel commode pour cette revue, puisque les chiffres bougent de toute façon à ce moment-là.
