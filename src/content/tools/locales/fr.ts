import type { PageCopy } from '../types.ts';
/**
 * Copie française. L’anglais fait foi : le typage échoue si un champ manque.
 */
export const copy: PageCopy = {
  tools: {
    converter: {
      title: 'Convertisseur de fuseaux horaires',
      metaTitle: 'Convertisseur de fuseaux horaires',
      description:
        'Convertissez un fuseau vers un autre à n’importe quelle date. Tient compte de l’heure d’été et des décalages d’une demi-heure et de 45 minutes.',
      summary:
        'Choisissez deux fuseaux et une date : la conversion est exacte, y compris les deux jours par an où le changement d’heure rend une heure locale impossible ou ambiguë.',
      faqs: [
        {
          question: 'Ce convertisseur gère-t-il l’heure d’été ?',
          answer:
            'Oui, ainsi que les deux jours délicats. Les décalages viennent de la base de données IANA via le navigateur : une conversion effectuée le jour du changement utilise le décalage réellement en vigueur à cet instant, pas celui d’aujourd’hui. Si vous saisissez une heure locale qui n’a jamais existé, ou une qui s’est produite deux fois, le convertisseur le signale au lieu d’en choisir une en silence.',
        },
        {
          question: 'Pourquoi l’écart entre deux villes change-t-il au cours de l’année ?',
          answer:
            'Parce que les deux endroits changent rarement d’heure à la même date, et que certains n’en changent jamais. New York est 5 heures derrière Londres la plupart de l’année, mais 4 heures pendant deux semaines en mars, car les États-Unis avancent leurs horloges deux à trois semaines avant l’Europe. Convertissez toujours par rapport à une date précise, jamais à un décalage mémorisé.',
        },
        {
          question: 'Entre quels fuseaux puis-je convertir ?',
          answer:
            'Tous ceux de la base IANA — plus de 400 — y compris les décalages d’une demi-heure et de 45 minutes qui font trébucher la plupart des convertisseurs. L’Inde à UTC+05:30, le Népal à UTC+05:45 et les îles Chatham à UTC+12:45 sont traités exactement, sans arrondi à l’heure la plus proche.',
        },
        {
          question: 'Ai-je besoin de JavaScript ?',
          answer:
            'Pour le convertisseur en direct, oui. Tout le reste — décalages, dates de changement d’heure, tableaux de référence heure par heure et toutes les explications — fait partie de la page prégénérée et fonctionne avec JavaScript désactivé.',
        },
        {
          question: 'Ce que je saisis est-il envoyé quelque part ?',
          answer:
            'Non. Tous les calculs se font dans votre navigateur. Il n’y a ni serveur, ni analytique, ni cookie, ni script tiers. Les fuseaux que vous choisissez apparaissent dans l’URL pour que vous puissiez partager ou marquer une conversion, et c’est le seul endroit où ils vont.',
        },
      ],
      sections: [
        {
          heading: 'Pourquoi les conversions de fuseaux tournent mal',
          paragraphs: [
            'Presque toutes les erreurs de planification viennent de quatre endroits, et tous les quatre sont traités ici plutôt qu’arrondis.',
            'Le décalage n’est pas une constante. « New York a cinq heures de retard sur Londres » est vrai environ dix mois par an. Pendant à peu près trois semaines au printemps et une en automne, c’est quatre heures, car les deux régions changent d’heure à des dates différentes. Un convertisseur qui stocke un décalage fixe par ville se trompe précisément ces jours-là — et ce sont exactement les jours où l’on fixe la réunion que l’on regrettera.',
            'Tous les décalages ne sont pas des heures entières. L’Inde est à 5 heures 30 d’UTC. Le Népal à 5 heures 45. Les îles Chatham à 12 heures 45, et l’île Lord Howe ne décale que de 30 minutes quand son heure d’été commence. Près d’un cinquième de la population mondiale vit sur un décalage qui n’est pas une heure ronde.',
            'Certaines heures locales n’existent pas. Quand les horloges avancent, une heure disparaît. À New York, le jour du changement, 01:59:59 est immédiatement suivi de 03:00:00 : 02:30 n’arrive jamais. Demandez à la plupart des outils de convertir 02:30 et ils répondront quand même, avec assurance. Celui-ci vous dit ce qu’il a fait.',
            'Certaines heures locales arrivent deux fois. Quand les horloges reculent, une heure se répète. 01:30 survient une fois en heure d’été puis une heure plus tard en heure normale. Ce convertisseur retient la première, le dit, et vous montre la seconde.',
          ],
        },
      ],
    },
    meetingPlanner: {
      title: 'Planificateur de réunions',
      metaTitle: 'Planificateur de réunions multi-fuseaux',
      description:
        'Ajoutez de deux à dix fuseaux et voyez une bande de 24 heures aux heures de travail ombrées. Trouvez les heures communes, ou constatez qu’il n’y en a pas.',
      summary:
        'Ajoutez les fuseaux de votre équipe : la bande ci-dessous montre la journée entière d’un coup, heures de travail ombrées. Le chevauchement devient une forme que l’on voit, pas un calcul que l’on fait.',
      faqs: [
        {
          question: 'Combien de fuseaux puis-je ajouter ?',
          answer:
            'Entre deux et dix. Au-delà de dix, la bande cesse d’être lisible d’un coup d’œil, ce qui est précisément la raison d’utiliser une bande plutôt qu’une liste de chiffres. La limite est un choix de conception, pas une contrainte technique.',
        },
        {
          question: 'Qu’est-ce qui compte comme heures de travail ?',
          answer:
            'Ce que vous décidez. Par défaut de 09:00 à 18:00 heure locale dans chaque fuseau, et les deux bornes sont réglables. L’heure qui précède et celle qui suit la journée sont ombrées plus clair : c’est joignable, mais vous demandez un service.',
        },
        {
          question: 'Pourquoi certaines lignes affichent-elles des heures en :30 ou :45 ?',
          answer:
            'Parce que ces fuseaux sont réellement décalés d’une demi-heure ou de trois quarts d’heure. L’Inde est à UTC+05:30, le Népal à UTC+05:45, les îles Chatham à UTC+12:45. Chaque colonne de la bande est le même instant, donc ces lignes affichent la lecture locale réelle, pas une valeur arrondie.',
        },
        {
          question: 'Et s’il n’y a aucun chevauchement ?',
          answer:
            'Le planificateur le dit franchement plutôt que de suggérer un compromis que personne n’a accepté. Los Angeles et Bombay ne partagent aucune minute d’une journée 09:00–18:00, et aucun ombrage n’y change rien : quelqu’un doit bouger. Élargir la journée ou scinder en deux appels sont les options honnêtes.',
        },
        {
          question: 'Le plan survit-il à un rechargement de page ?',
          answer:
            'Oui. Vos fuseaux, la date et les heures de travail sont inscrits dans l’URL : vous pouvez marquer un plan ou l’envoyer à quelqu’un, qui verra exactement la même chose. La liste des fuseaux est aussi conservée dans votre navigateur, pour que le planificateur se souvienne de votre équipe.',
        },
        {
          question: 'Tient-il compte de l’heure d’été ?',
          answer:
            'Oui, à la date que vous choisissez. Prenez une date en mars ou en octobre et vous verrez des lignes se décaler les unes par rapport aux autres, parce que c’est ce qui se passe réellement : les fuseaux changent d’heure des jours différents.',
        },
      ],
      sections: [
        {
          heading: 'Comment lire la bande',
          paragraphs: [
            'Chaque colonne est un instant. En lisant une colonne de haut en bas, vous voyez ce qu’indique l’horloge à chaque endroit au même moment — exactement ce qu’une liste de décalages vous oblige à calculer de tête, et exactement ce que les gens se trompent.',
            'Trois teintes : les heures de travail portent une bordure supérieure colorée, l’heure de part et d’autre est plus claire, le reste est uni. La bordure compte autant que le fond : la distinction ne repose jamais sur la seule couleur, donc elle reste lisible si vous ne séparez pas ces deux bleus.',
          ],
        },
        {
          heading: 'Quand il n’y a aucun chevauchement',
          paragraphs: [
            'Certaines équipes n’en ont réellement aucun. Une journée 09:00–18:00 à Los Angeles et la même à Bombay ne partagent rien : la journée de Bombay se termine avant le réveil de Los Angeles. New York et Sydney sont encore plus curieux : ils partagent exactement une heure de novembre à mars, quand l’écart est de 16 heures, et absolument rien d’avril à octobre, quand il tombe à 14. Les mêmes deux villes, la réponse inverse, et la seule chose qui a changé est la date.',
            'Quand cela arrive, le planificateur le dit au lieu d’ombrer quelque chose en espérant. Les choix réalistes sont d’élargir la journée d’un côté, d’alterner qui prend l’appel inconfortable, ou de cesser de se réunir en direct. Prétendre qu’un créneau à 22:00 convient est la manière dont les gens s’épuisent en silence.',
          ],
        },
      ],
    },
    worldClock: {
      title: 'Horloge mondiale',
      metaTitle: 'Horloge mondiale : 80 villes en direct',
      description:
        'Heure locale en direct dans 80 grandes villes, classées d’est en ouest. Cherchez une ville, épinglez celles qui comptent et voyez la date basculer.',
      summary:
        'Heure locale en direct dans 80 villes, de l’horloge la plus avancée du globe à la plus tardive. Cherchez pour filtrer, épinglez les villes que vous consultez souvent : elles restent en haut.',
      faqs: [
        {
          question: 'Quelle est la précision de ces horloges ?',
          answer:
            'Elles lisent l’horloge de votre appareil et lui appliquent le décalage que votre navigateur tire de la base IANA : elles sont donc aussi justes que votre propre machine. Si l’horloge de votre ordinateur est fausse, toutes celles de cette page le sont d’autant — rien ici ne vient d’un serveur.',
        },
        {
          question: 'Puis-je garder mes villes en haut ?',
          answer:
            'Oui. Épinglez une ville et elle passe en tête de la grille et y reste lors de votre prochaine visite. Les épingles vivent uniquement dans votre navigateur ; rien n’est envoyé nulle part et aucun cookie n’est posé.',
        },
        {
          question: 'Pourquoi certaines villes affichent-elles une autre date ?',
          answer:
            'Parce que c’est le cas. Quand il est lundi soir à New York, il est déjà mardi matin à Tokyo. La date sous chaque horloge est la date locale de cette ville, pas la vôtre.',
        },
        {
          question: 'Pourquoi Bombay et Katmandou affichent-elles des heures en :30 et :45 ?',
          answer:
            'L’Inde est à UTC+05:30 et le Népal à UTC+05:45. Ce sont les décalages réels, pas des erreurs d’arrondi — près d’un cinquième du monde vit sur un décalage qui n’est pas une heure ronde.',
        },
      ],
      sections: [],
    },
    timeDifference: {
      title: 'Décalage horaire',
      metaTitle: 'Décalage horaire entre deux fuseaux',
      description:
        'Voyez l’écart actuel entre deux lieux et toutes les dates de l’année à venir où cet écart change parce que l’un des deux avance ou recule ses horloges.',
      summary:
        'Choisissez deux lieux : vous verrez leur écart actuel, plus les dates exactes de l’année à venir où cet écart change — la partie que la plupart des outils passent sous silence.',
      faqs: [
        {
          question: 'Pourquoi l’écart n’est-il pas le même toute l’année ?',
          answer:
            'Parce que les deux lieux changent d’heure à des dates différentes, ou que l’un n’en change pas du tout. New York et Londres sont à 5 heures d’écart la plupart de l’année, à 4 heures pendant les trois semaines de mars qui suivent le passage américain et précèdent l’européen, et à 4 heures de nouveau pendant la semaine de fin octobre qui suit le passage européen et précède l’américain.',
        },
        {
          question: 'Quels lieux gardent toujours le même écart ?',
          answer:
            'Toute paire où aucun des deux n’applique l’heure d’été — l’Inde et le Japon, par exemple, sont en permanence à 3 heures 30. Les paires au sein d’un même bloc réglementaire sont aussi stables : tous les fuseaux de l’Union européenne changent au même instant, donc Lisbonne et Athènes restent exactement à 2 heures toute l’année.',
        },
        {
          question: 'Comment l’écart est-il calculé ?',
          answer:
            'En demandant au navigateur le décalage de chaque fuseau au même instant, puis en soustrayant. L’écart est donc juste au moment où vous le regardez, y compris en plein basculement, au lieu de lire un chiffre stocké qui était vrai le mois dernier.',
        },
        {
          question: 'Que signifie un écart négatif ?',
          answer:
            'Que le second lieu est en retard sur le premier. La page écrit « en avance » ou « en retard » en toutes lettres pour cette raison précise : les signes négatifs sur les décalages horaires sont lus à l’envers par environ la moitié des gens.',
        },
      ],
      sections: [],
    },
    workingHoursOverlap: {
      title: 'Chevauchement des heures de travail',
      metaTitle: 'Chevauchement des heures de travail',
      description:
        'Trouvez les heures exactes que partage une équipe distribuée, affichées sur l’horloge de chacun — ou apprenez honnêtement qu’il n’y en a aucune.',
      summary:
        'Ajoutez les fuseaux de votre équipe : vous obtenez les créneaux exacts où tout le monde est disponible, sur l’horloge de chacun, et un message clair quand il n’y en a aucun.',
      faqs: [
        {
          question: 'Qu’est-ce qui compte comme heures de travail ?',
          answer:
            'Par défaut 09:00 à 18:00 heure locale pour tout le monde, les deux bornes étant réglables. L’outil traite délibérément tous les fuseaux de la même façon plutôt que d’encoder des hypothèses sur les pays qui commencent tôt : une équipe qui travaille de 10:00 à 19:00 devrait le dire.',
        },
        {
          question: 'Et s’il n’y a aucun chevauchement ?',
          answer:
            'On vous le dit, avec les créneaux les plus proches où le plus de personnes sont dans leurs heures. Los Angeles et Bombay ne partagent aucune minute d’une journée 09:00–18:00 ; aucun agencement de la grille n’y change rien. Les options honnêtes : élargir la journée d’un côté, alterner qui prend l’appel inconfortable, ou travailler en asynchrone.',
        },
        {
          question: 'En quoi est-ce différent du planificateur de réunions ?',
          answer:
            'Le planificateur montre la journée entière sous forme de bande, pour en voir la forme. Cet outil répond à la question précise : quelles minutes sont partagées et ce que ces minutes affichent sur l’horloge de chacun. Le planificateur pour explorer, celui-ci pour décider.',
        },
        {
          question: 'Tient-il compte de l’heure d’été ?',
          answer:
            'Oui, pour aujourd’hui. Les créneaux se décalent d’une heure quand un côté change ses horloges et pas l’autre — d’où le fait qu’une même équipe puisse avoir quatre heures communes en février et trois en mars.',
        },
      ],
      sections: [],
    },
    unixTimestamp: {
      title: 'Convertisseur d’horodatage Unix',
      metaTitle: 'Convertisseur d’horodatage Unix',
      description:
        'Convertissez un horodatage Unix en date et inversement, dans n’importe quel fuseau. Détecte secondes ou millisecondes et affiche un compteur en direct.',
      summary:
        'Collez un horodatage Unix pour le lire comme une date, ou choisissez une date pour obtenir l’horodatage : l’outil détecte si votre nombre est en secondes ou en millisecondes et vous dit ce qu’il a supposé.',
      faqs: [
        {
          question: 'Secondes ou millisecondes : comment le sait-il ?',
          answer:
            'Par la taille. Un horodatage de 1e11 ou plus est traité comme des millisecondes, car 1e11 secondes correspond à l’an 5138 et rien de réel n’y parvient. L’unité détectée est affichée à côté du résultat plutôt qu’appliquée en silence, car se tromper est une erreur d’un facteur 1000 qui vous ramène en 1970.',
        },
        {
          question: 'Qu’est-ce qu’un horodatage Unix ?',
          answer:
            'Le nombre de secondes écoulées depuis le 1er janvier 1970 à 00:00:00 UTC, secondes intercalaires non comptées. C’est un nombre unique sans fuseau attaché, et c’est précisément pourquoi les systèmes l’utilisent : deux machines n’importe où sur terre qui lisent le même horodatage s’accordent sur le même instant.',
        },
        {
          question: 'Un horodatage peut-il être négatif ?',
          answer:
            'Oui. Tout ce qui précède 1970 est négatif. L’alunissage d’Apollo 11 est autour de -14 182 940. Ce convertisseur gère les valeurs négatives dans les deux sens.',
        },
        {
          question: 'Que se passe-t-il en 2038 ?',
          answer:
            'Les systèmes qui stockent le compte dans un entier signé 32 bits arrivent à court de place à 03:14:07 UTC le 19 janvier 2038. La seconde suivante déborde vers un nombre négatif, que ces systèmes lisent comme décembre 1901. La plupart des plateformes modernes sont passées à 64 bits depuis des années ; ce sont les systèmes embarqués et hérités qui restent exposés.',
        },
        {
          question: 'Le fuseau horaire influence-t-il l’horodatage ?',
          answer:
            'Pas l’horodatage lui-même : il est toujours compté depuis un instant UTC. Le fuseau décide seulement de la façon dont cet instant s’affiche en date et heure, et de quelle lecture locale se reconvertit en quel nombre.',
        },
      ],
      sections: [],
    },
    durationCalculator: {
      title: 'Calculateur de durée',
      metaTitle: 'Calculateur de durée entre fuseaux',
      description:
        'Calculez le temps entre deux dates-heures, chacune dans son fuseau. Gère correctement l’heure d’été : une journée de 23 heures est annoncée comme telle.',
      summary:
        'Fixez un début et une fin — chacun dans son fuseau s’ils diffèrent — et l’outil indique le temps réellement écoulé, y compris les journées de 23 ou 25 heures.',
      faqs: [
        {
          question: 'Pourquoi une journée fait-elle parfois 23 ou 25 heures ?',
          answer:
            'Parce que c’était le cas. Le jour où les horloges avancent, de minuit à minuit il y a 23 heures ; le jour où elles reculent, 25. Ce calculateur résout les deux bornes en instants absolus avant de soustraire : il annonce le temps réellement passé, pas celui que suggère le calendrier.',
        },
        {
          question: 'Les deux bornes peuvent-elles être dans des fuseaux différents ?',
          answer:
            'Oui, et c’est tout l’intérêt. Un vol partant de Tokyo à 17:00 et atterrissant à San Francisco à 09:30 le même matin a duré neuf heures et demie, pas moins sept heures et demie. Mettez chaque borne dans son fuseau et l’arithmétique tombe juste.',
        },
        {
          question: 'Les secondes intercalaires sont-elles comptées ?',
          answer:
            'Non. Les navigateurs ne les exposent pas : l’horloge JavaScript les ignore entièrement, donc un intervalle qui en traverse une est annoncé une seconde trop court. Sur toute l’histoire d’UTC cela fait 27 secondes au total, ce qui compte pour la navigation par satellite et pour rien de ce que vous mesurerez ici.',
        },
        {
          question: 'Et si la fin précède le début ?',
          answer:
            'C’est signalé, et l’écart est quand même donné. Une durée négative est le plus souvent une faute de frappe, et inverser le signe en silence la masquerait.',
        },
      ],
      sections: [
        {
          heading: 'Pourquoi l’arithmétique du calendrier n’est pas celle de l’horloge',
          paragraphs: [
            '« Un jour plus tard » et « 24 heures plus tard » sont deux instructions différentes, et deux fois par an elles donnent des réponses différentes. Si une tâche nocturne est programmée à 02:30 heure locale, elle s’exécute deux fois un matin d’automne et pas du tout un matin de printemps. Si elle est programmée toutes les 86 400 secondes, elle dérive d’une heure par rapport à 02:30.',
            'Aucun des deux comportements n’est un bug : ils répondent à des questions différentes. L’ennui commence quand le code fait l’un et que la personne attendait l’autre. Ce calculateur répond toujours à la question de l’horloge — combien de temps s’est réellement écoulé — et affiche les jours calendaires à côté.',
          ],
        },
      ],
    },
    countdown: {
      title: 'Compte à rebours',
      metaTitle: 'Compte à rebours vers n’importe quelle date',
      description:
        'Comptez à rebours vers n’importe quel moment dans n’importe quel fuseau, et partagez-le par lien. Ni compte, ni stockage : tout tient dans l’URL.',
      summary:
        'Choisissez un moment et un fuseau : le compte à rebours ci-dessous y court. Tout tient dans l’URL, donc copier la barre d’adresse suffit à le partager.',
      faqs: [
        {
          question: 'Comment partager un compte à rebours ?',
          answer:
            'Configurez-le et copiez la barre d’adresse : chaque champ est dans l’URL. Qui l’ouvrira verra le même compte à rebours vers le même instant, décompté sur l’horloge de son propre appareil. Pas de compte, pas d’enregistrement, rien de stocké sur un serveur — puisqu’il n’y a pas de serveur.',
        },
        {
          question: 'Le destinataire le voit-il dans son propre fuseau ?',
          answer:
            'Il voit le même compte à rebours, car un compte à rebours mesure la distance jusqu’à un instant, et cette distance est identique partout. La date et l’heure cibles sont affichées dans le fuseau que vous avez choisi, pour que chacun voie de quel moment local il s’agit.',
        },
        {
          question: 'Que se passe-t-il à zéro ?',
          answer:
            'Il indique que le moment est passé et s’arrête. Il ne se met pas à compter à l’endroit : si vous voulez le temps écoulé depuis un événement, le calculateur de durée y répond correctement.',
        },
        {
          question: 'Puis-je compter vers une heure qui n’existe pas ?',
          answer:
            'Si vous choisissez une heure locale située dans le saut du printemps, le compte à rebours se place à l’instant équivalent après le changement et vous le dit. C’est la politique que tous les outils de ce site appliquent.',
        },
      ],
      sections: [
        {
          heading: 'Pourquoi tout le compte à rebours tient dans le lien',
          paragraphs: [
            'La plupart des outils de compte à rebours vous demandent de créer un compte pour pouvoir stocker le vôtre sur leur serveur et afficher une publicité à côté. Ici il n’y a pas de serveur : l’état doit donc tenir quelque part que le lien puisse transporter — ce qui se révèle meilleur pour tout le monde. Rien à créer, rien à supprimer plus tard, rien qui cesse de fonctionner quand une entreprise ferme.',
            'La seule chose à savoir : comme le titre voyage dans l’URL, traitez un lien de compte à rebours venu d’un inconnu comme n’importe quel lien. Le titre est dépouillé de tout ce qui n’est pas du texte brut et rendu comme du texte, jamais comme du balisage.',
          ],
        },
      ],
    },
    utcTime: {
      title: 'Heure UTC',
      metaTitle: 'Heure UTC actuelle, en direct',
      description:
        'L’heure UTC actuelle en direct, plus ce qu’est vraiment UTC, en quoi elle diffère de GMT et ce contre quoi se mesurent tous les autres décalages.',
      summary:
        'UTC est l’horloge de référence contre laquelle tout autre fuseau est défini : elle ne bouge jamais pour l’heure d’été, et ce qui suit est l’horloge de votre appareil exprimée dans cette référence.',
      faqs: [
        {
          question: 'Qu’est-ce qu’UTC ?',
          answer:
            'Le temps universel coordonné est la référence contre laquelle tous les autres fuseaux sont définis. Ce n’est pas un fuseau où quelqu’un vit : c’est la base. Chaque décalage que vous voyez, d’UTC-12 à UTC+14, est une distance par rapport à cette horloge.',
        },
        {
          question: 'UTC est-il identique à GMT ?',
          answer:
            'Au quotidien, ils affichent la même heure, mais ce sont des choses différentes. GMT est un fuseau horaire, défini par la position du soleil au méridien de Greenwich, et le Royaume-Uni le quitte chaque été. UTC est un étalon de temps, tenu par environ 450 horloges atomiques et jamais ajusté pour l’heure d’été. Si vous voulez dire « la référence », dites UTC.',
        },
        {
          question: 'Pourquoi l’abréviation UTC et non CUT ?',
          answer:
            'Parce que ni l’acronyme anglais ni le français ne l’a emporté. Les anglophones voulaient CUT pour « coordinated universal time », les francophones TUC pour « temps universel coordonné », et l’Union internationale des télécommunications a tranché pour UTC — qui ne correspond à aucune des deux langues et froisse donc les deux également.',
        },
        {
          question: 'UTC applique-t-il l’heure d’été ?',
          answer:
            'Jamais. C’est tout son intérêt. UTC ne bouge pas, et c’est pourquoi les serveurs, l’aviation, le transport maritime et tout système distribué qui a besoin que deux machines s’accordent sur le moment d’un événement l’utilisent plutôt qu’un fuseau local.',
        },
        {
          question: 'Et les secondes intercalaires ?',
          answer:
            'On a parfois inséré dans UTC une seconde intercalaire pour rester à moins de 0,9 seconde de la rotation réelle de la Terre — 27 depuis 1972, la dernière fin 2016. En 2022, la Conférence générale des poids et mesures a voté leur arrêt d’ici 2035. Votre navigateur n’expose pas les secondes intercalaires, cette page non plus.',
        },
      ],
      sections: [
        {
          heading: 'Pourquoi tout se mesure depuis ici',
          paragraphs: [
            'Avant 1884, chaque ville gardait sa propre heure, réglée sur son propre midi. Cela a tenu jusqu’au chemin de fer ; à partir de là, deux villes distantes de soixante kilomètres en désaccord de douze minutes ont cessé d’être une curiosité pour devenir un risque de collision. La Conférence internationale du méridien a choisi Greenwich comme méridien d’origine, et le système moderne des décalages en découle.',
            'UTC a remplacé le temps moyen de Greenwich comme étalon technique en 1972. La différence compte plus qu’il n’y paraît : GMT est défini par la Terre, qui oscille, tandis qu’UTC est défini par des atomes de césium, qui n’oscillent pas. On maintient les deux à moins d’une seconde l’un de l’autre, à la main.',
            'Si vous stockez un horodatage en base, journalisez un événement ou planifiez quoi que ce soit sur quoi deux machines doivent s’accorder, stockez en UTC et convertissez à l’affichage. Stocker l’heure locale, c’est ainsi que les systèmes se retrouvent avec une heure qui survient deux fois par an et un ticket de support assorti.',
          ],
        },
      ],
    },
    dstChanges: {
      title: 'Changements d’heure d’été',
      metaTitle: 'Changements d’heure de l’année',
      description:
        'Tous les changements d’heure prévus cette année et l’an prochain, avec dates exactes, heure locale du basculement et décalage de part et d’autre.',
      summary:
        'Toutes les dates viennent de la base de données IANA, avec le moment local exact où chaque changement prend effet, et les villes qui ne bougent jamais leurs horloges listées à part.',
      faqs: [
        {
          question: 'Quels pays ont supprimé l’heure d’été ?',
          answer:
            'La Russie a arrêté en 2014, la Turquie en 2016, l’Iran en 2022, le Mexique en 2022 pour l’essentiel du pays, et le Brésil en 2019 après des décennies d’usage. Le Japon, l’Inde, la Chine et presque toute l’Afrique et l’Asie du Sud-Est ne l’ont jamais pratiquée. Environ un tiers du monde l’applique ; le reste observe la dispute semestrielle avec intérêt.',
        },
        {
          question: 'L’Union européenne compte-t-elle toujours la supprimer ?',
          answer:
            'Le Parlement européen a voté en 2019 la fin des changements d’heure saisonniers, mais la directive s’est enlisée : les États membres n’ont pas pu s’accorder entre heure d’été permanente et heure d’hiver permanente, et une mosaïque fragmenterait les fuseaux du marché unique. Tant que cela n’est pas tranché, les changements de cette page tiennent.',
        },
        {
          question: 'Pourquoi l’île Lord Howe ne décale-t-elle que de 30 minutes ?',
          answer:
            'Parce qu’elle a jugé qu’une heure entière était excessive. Lord Howe, au large de la côte est australienne, passe d’UTC+10:30 à UTC+11:00 : le seul décalage d’une demi-heure au monde. C’est aussi la raison pour laquelle toute bibliothèque de dates qui suppose un décalage d’une heure se trompe, en silence, pour environ 380 personnes.',
        },
        {
          question: 'À quelle heure les horloges changent-elles vraiment ?',
          answer:
            'Cela varie. Les États-Unis changent à 02:00 heure locale, l’Union européenne à 01:00 UTC — ce qui veut dire que tous ses fuseaux changent au même instant mais à une heure locale différente. L’Australie change à 02:00 locales, le Chili à 24:00. La colonne d’heure locale indique la dernière lecture avant chaque changement.',
        },
        {
          question: 'À quelle fréquence cette page est-elle mise à jour ?',
          answer:
            'Elle est reconstruite chaque mois, et les 1er mars, avril, octobre et novembre, pour que toute modification de la base IANA soit prise en compte avant les dates qu’elle affecte. Les gouvernements annoncent ces changements avec un préavis allant d’un an à une quinzaine de jours.',
        },
      ],
      sections: [],
    },
  },

  hubs: {
    convert: {
      title: 'Conversions de fuseaux horaires',
      metaTitle: 'Conversions de fuseaux horaires',
      description:
        'Toutes les conversions entre villes et abréviations, chacune avec un tableau heure par heure, les dates de changement d’heure et les créneaux d’appel.',
      summary:
        'Chaque conversion comporte un tableau heure par heure, les dates de changement d’heure des deux villes, et les heures où l’on peut réellement s’appeler.',
    },
    cities: {
      title: 'Heure actuelle par ville',
      metaTitle: 'Heure actuelle par ville et continent',
      description:
        'Heure locale, décalage par rapport à UTC et dates de changement d’heure pour 80 villes réparties sur tous les continents habités.',
      summary:
        'Chaque page comporte une horloge en direct, les dates exactes de changement d’heure du fuseau, le lever et le coucher du soleil calculés depuis les coordonnées de la ville, et des conversions vers les grands pôles.',
    },
    guides: {
      title: 'Guides',
      metaTitle: 'Guides sur les fuseaux horaires et UTC',
      description:
        'Des guides sur le fonctionnement des fuseaux horaires, ce qu’est UTC, pourquoi l’heure d’été existe, et comment gérer tout cela en code sans se tromper.',
      summary:
        'Comment fonctionnent réellement les fuseaux horaires : le mécanisme, l’histoire, et les manières précises dont les logiciels se trompent. Écrits pour être lus une fois et retenus, pas pour se positionner.',
    },
  },

  generated: {
    hourByHour: 'Heure par heure',
    daylightSaving: 'Heure d’été',
    whenYouCanTalk: 'Quand vous pouvez vraiment vous parler',
    reference: 'Référence',
    zoneFacts: 'Données du fuseau',
    sunriseSunset: 'Lever et coucher du soleil',
    againstHubs: 'Face aux grands pôles',
    convertTo: 'Convertir vers',
    exampleNote:
      'Les décalages et les dates sont calculés à la compilation depuis la base IANA. Les heures en direct sont générées dans votre navigateur.',
    sunNote:
      'Calculés depuis la latitude et la longitude de la ville avec l’algorithme de position solaire de la NOAA : aucune API, aucun appel réseau.',
    noDstNote:
      'Cette ville n’applique pas l’heure d’été. Son décalage par rapport à UTC est le même tous les jours de l’année.',
    ambiguousPanelHeading: 'Ces lettres désignent plusieurs choses',
    ambiguousPanelBody:
      'Si vous pensiez à l’une des autres, le décalage ci-dessous n’est pas le vôtre — et c’est exactement ainsi que des réunions se retrouvent fixées à la mauvaise heure.',
    abbreviationTableNote:
      'Calculé à une date où cette abréviation est réellement en vigueur : prendre aujourd’hui serait faux la moitié de l’année.',
  },
};

export default copy;
