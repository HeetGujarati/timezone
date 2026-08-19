import type { PageCopy } from '../types.ts';

/**
 * Deutsche Texte. Englisch ist der Vertrag: Die Typprüfung schlägt fehl, wenn ein Feld fehlt.
 */
export const copy: PageCopy = {
  tools: {
    converter: {
      title: 'Zeitzonenrechner',
      metaTitle: 'Zeitzonenrechner für jede Zone und jedes Datum',
      description:
        'Rechnen Sie jede Zeitzone in jede andere um, für jedes Datum. Berücksichtigt Sommerzeit sowie Halbstunden- und 45-Minuten-Versätze.',
      summary:
        'Wählen Sie zwei Zonen und ein Datum, und die Umrechnung stimmt genau — auch an den zwei Tagen im Jahr, an denen die Zeitumstellung eine Ortszeit unmöglich oder doppeldeutig macht.',
      faqs: [
        {
          question: 'Berücksichtigt dieser Rechner die Sommerzeit?',
          answer:
            'Ja, und auch die beiden heiklen Tage. Die Versätze stammen über den Browser aus der IANA-Zeitzonendatenbank, deshalb verwendet eine Umrechnung am Umstellungstag den Versatz, der in diesem Moment tatsächlich galt, nicht den von heute. Geben Sie eine Ortszeit ein, die es nie gab, oder eine, die es zweimal gab, sagt der Rechner das, statt stillschweigend eine auszuwählen.',
        },
        {
          question: 'Warum ändert sich der Zeitunterschied zwischen zwei Städten im Lauf des Jahres?',
          answer:
            'Weil die beiden Orte ihre Uhren selten am selben Datum umstellen und manche gar nicht. New York liegt fast das ganze Jahr 5 Stunden hinter London, im März aber zwei Wochen lang nur 4, weil die Vereinigten Staaten ihre Uhren zwei bis drei Wochen früher umstellen als Europa. Rechnen Sie immer gegen ein konkretes Datum, nie gegen einen erinnerten Versatz.',
        },
        {
          question: 'Zwischen welchen Zeitzonen kann ich umrechnen?',
          answer:
            'Zwischen allen der IANA-Datenbank — über 400 — einschließlich der Halbstunden- und 45-Minuten-Versätze, an denen die meisten Rechner scheitern. Indien mit UTC+05:30, Nepal mit UTC+05:45 und die Chathaminseln mit UTC+12:45 werden exakt behandelt und nicht auf die nächste volle Stunde gerundet.',
        },
        {
          question: 'Brauche ich JavaScript?',
          answer:
            'Für den Live-Rechner ja. Alles andere — Versätze, Umstellungstermine, stündliche Referenztabellen und sämtliche Erklärungen — gehört zur vorgerenderten Seite und funktioniert auch mit deaktiviertem JavaScript.',
        },
        {
          question: 'Wird das, was ich hier eingebe, irgendwohin gesendet?',
          answer:
            'Nein. Jede Berechnung läuft in Ihrem Browser. Es gibt kein Backend, keine Analyse, keine Cookies und kein Skript von Dritten. Die gewählten Zonen erscheinen in der URL, damit Sie eine Umrechnung teilen oder als Lesezeichen speichern können — weiter gehen sie nicht.',
        },
      ],
      sections: [
        {
          heading: 'Woran Zeitzonenumrechnungen scheitern',
          paragraphs: [
            'Fast jeder Terminfehler hat eine von vier Ursachen, und alle vier werden hier behandelt statt weggerundet.',
            'Der Versatz ist keine Konstante. „New York liegt fünf Stunden hinter London“ stimmt etwa zehn Monate im Jahr. Rund drei Wochen im Frühjahr und eine im Herbst sind es vier Stunden, weil beide Regionen ihre Uhren an unterschiedlichen Daten umstellen. Ein Rechner, der pro Stadt einen festen Versatz speichert, liegt genau an diesen Tagen falsch — und genau an diesen Tagen wird der Termin gebucht, den man später bereut.',
            'Nicht jeder Versatz ist eine volle Stunde. Indien liegt 5 Stunden 30 Minuten vor UTC, Nepal 5 Stunden 45 Minuten. Die Chathaminseln liegen 12 Stunden 45 Minuten davor, und Lord Howe Island verschiebt sich zum Sommerzeitbeginn um nur 30 Minuten. Etwa ein Fünftel der Welt lebt mit einem Versatz, der keine volle Stunde ist.',
            'Manche Ortszeiten existieren nicht. Wenn die Uhren vorgestellt werden, fällt eine Stunde weg. In New York folgt am Umstellungstag auf 01:59:59 unmittelbar 03:00:00 — 02:30 gibt es nie. Bitten Sie die meisten Werkzeuge, 02:30 umzurechnen, antworten sie trotzdem überzeugt. Dieses hier sagt Ihnen, was es getan hat.',
            'Manche Ortszeiten gibt es zweimal. Wenn die Uhren zurückgestellt werden, wiederholt sich eine Stunde. 01:30 tritt einmal in der Sommerzeit ein und eine Stunde später erneut in der Normalzeit. Dieser Rechner nimmt das erste Auftreten, sagt das dazu und zeigt Ihnen das zweite.',
          ],
        },
      ],
    },

    meetingPlanner: {
      title: 'Besprechungsplaner',
      metaTitle: 'Besprechungsplaner über Zeitzonen hinweg',
      description:
        'Fügen Sie zwei bis zehn Zeitzonen hinzu und sehen Sie ein 24-Stunden-Band mit schattierten Arbeitszeiten. Findet gemeinsame Stunden — oder keine.',
      summary:
        'Fügen Sie die Zonen hinzu, in denen Ihr Team arbeitet: Das Band unten zeigt den ganzen Tag auf einmal, mit schattierter Arbeitszeit — die Überschneidung ist eine Form, die man sieht, keine Rechnung, die man macht.',
      faqs: [
        {
          question: 'Wie viele Zeitzonen kann ich hinzufügen?',
          answer:
            'Zwischen zwei und zehn. Ab elf lässt sich das Band nicht mehr auf einen Blick lesen, und genau dafür ist ein Band da statt einer Zahlenliste — die Grenze ist eine Gestaltungsentscheidung, keine technische.',
        },
        {
          question: 'Was gilt als Arbeitszeit?',
          answer:
            'Was Sie festlegen. Voreingestellt sind 09:00 bis 18:00 Ortszeit in jeder Zone, beide Enden sind verstellbar. Die Stunde davor und danach ist heller schattiert: erreichbar, aber Sie bitten um einen Gefallen.',
        },
        {
          question: 'Warum enden manche Zeilen auf :30 oder :45?',
          answer:
            'Weil diese Zonen tatsächlich um eine halbe oder eine Dreiviertelstunde versetzt sind. Indien liegt bei UTC+05:30, Nepal bei UTC+05:45, die Chathaminseln bei UTC+12:45. Jede Spalte des Bandes ist derselbe Zeitpunkt, deshalb zeigen diese Zeilen die echte Ortszeit und keine gerundete.',
        },
        {
          question: 'Was, wenn es überhaupt keine Überschneidung gibt?',
          answer:
            'Der Planer sagt es klar, statt einen Kompromiss vorzuschlagen, dem niemand zugestimmt hat. Los Angeles und Mumbai teilen keine Minute eines Arbeitstags von 09:00 bis 18:00, und keine Schattierung ändert daran etwas — jemand muss sich bewegen. Den Arbeitstag zu erweitern oder das Gespräch zu teilen sind die ehrlichen Möglichkeiten.',
        },
        {
          question: 'Übersteht der Plan ein Neuladen der Seite?',
          answer:
            'Ja. Ihre Zonen, das Datum und die Arbeitszeiten stehen in der URL; Sie können einen Plan also als Lesezeichen speichern oder verschicken, und der Empfänger sieht genau dasselbe. Die Zonenliste bleibt zusätzlich in Ihrem Browser, damit der Planer Ihr Team beim nächsten Mal kennt.',
        },
        {
          question: 'Berücksichtigt er die Sommerzeit?',
          answer:
            'Ja, zum gewählten Datum. Wählen Sie ein Datum im März oder Oktober, verschieben sich Zeilen gegeneinander — weil genau das tatsächlich passiert: Die Zonen stellen ihre Uhren an verschiedenen Tagen um.',
        },
      ],
      sections: [
        {
          heading: 'Wie man das Band liest',
          paragraphs: [
            'Jede Spalte ist ein Zeitpunkt. Lesen Sie eine Spalte von oben nach unten, sehen Sie, was die Uhr an jedem Ort im selben Moment zeigt — genau das, was eine Liste von Versätzen im Kopf ausrechnen lässt, und genau das, was schiefgeht.',
            'Drei Abstufungen: Die Arbeitszeit trägt oben eine farbige Kante, die Stunde davor und danach ist heller, der Rest bleibt flach. Die Kante zählt so viel wie die Füllung — der Unterschied hängt nie allein an der Farbe und bleibt lesbar, auch wenn Sie diese beiden Blautöne nicht trennen können.',
          ],
        },
        {
          heading: 'Wenn es keine Überschneidung gibt',
          paragraphs: [
            'Manche Teams haben schlicht keine. Ein Arbeitstag von 09:00 bis 18:00 in Los Angeles und derselbe in Mumbai teilen gar nichts — Mumbais Arbeitstag endet, bevor Los Angeles aufwacht. New York und Sydney sind noch merkwürdiger: Von November bis März teilen sie genau eine Stunde, wenn der Abstand 16 Stunden beträgt, und von April bis Oktober überhaupt nichts, wenn er auf 14 schrumpft. Dieselben zwei Städte, gegenteilige Antwort, und geändert hat sich nur das Datum.',
            'Wenn das eintritt, sagt der Planer es, statt etwas zu schattieren und zu hoffen. Realistisch bleibt: den Arbeitstag auf einer Seite ausweiten, abwechseln, wer das unangenehme Gespräch übernimmt, oder auf synchrone Treffen verzichten. So zu tun, als wäre 22:00 in Ordnung, ist der Weg, auf dem Menschen still ausbrennen.',
          ],
        },
      ],
    },

    worldClock: {
      title: 'Weltuhr',
      metaTitle: 'Weltuhr: Uhrzeit in 80 Städten',
      description:
        'Live-Ortszeit in 80 großen Städten, von Ost nach West geordnet. Jede Stadt suchen, wichtige anheften und den Datumswechsel mitverfolgen.',
      summary:
        'Live-Ortszeit in 80 Städten, von der frühesten Uhr der Erde bis zur spätesten — suchen Sie, um zu filtern, und heften Sie die Städte an, die Sie oft brauchen: Sie bleiben oben.',
      faqs: [
        {
          question: 'Wie genau sind diese Uhren?',
          answer:
            'Sie lesen die Uhr Ihres Geräts und wenden den Versatz an, den Ihr Browser aus der IANA-Zeitzonendatenbank bezieht — sie sind also so genau wie Ihr eigenes Gerät. Geht Ihre Rechneruhr falsch, gehen alle Uhren hier um denselben Betrag falsch: Nichts auf dieser Seite kommt von einem Server.',
        },
        {
          question: 'Kann ich meine Städte oben behalten?',
          answer:
            'Ja. Heften Sie eine Stadt an, rückt sie an den Anfang des Rasters und bleibt beim nächsten Besuch dort. Die Anheftungen liegen nur in Ihrem Browser; nichts wird gesendet und kein Cookie gesetzt.',
        },
        {
          question: 'Warum zeigen manche Städte ein anderes Datum?',
          answer:
            'Weil sie es haben. Wenn es in New York Montagabend ist, ist es in Tokio schon Dienstagmorgen. Das Datum unter jeder Uhr ist das lokale Kalenderdatum dieser Stadt, nicht Ihres.',
        },
        {
          question: 'Warum zeigen Mumbai und Kathmandu Zeiten auf :30 und :45?',
          answer:
            'Indien läuft auf UTC+05:30 und Nepal auf UTC+05:45. Das sind die echten Versätze, keine Rundungsfehler — etwa ein Fünftel der Welt lebt mit einem Versatz, der keine volle Stunde ist.',
        },
      ],
      sections: [],
    },

    timeDifference: {
      title: 'Zeitunterschied',
      metaTitle: 'Zeitunterschied zwischen zwei Zeitzonen',
      description:
        'Der aktuelle Unterschied zwischen zwei Orten und jedes Datum im nächsten Jahr, an dem er sich ändert, weil einer von beiden die Uhren umstellt.',
      summary:
        'Wählen Sie zwei Orte, und Sie sehen, wie weit sie gerade auseinanderliegen — dazu die genauen Daten im nächsten Jahr, an denen sich dieser Abstand ändert. Genau den Teil lassen die meisten Werkzeuge weg.',
      faqs: [
        {
          question: 'Warum ist der Unterschied nicht das ganze Jahr gleich?',
          answer:
            'Weil die beiden Orte ihre Uhren an verschiedenen Daten umstellen oder einer von beiden gar nicht. New York und London trennen die meiste Zeit 5 Stunden, in den drei Märzwochen nach der US-Umstellung und vor der europäischen nur 4, und in der Oktoberwoche nach der europäischen Rückstellung und vor der amerikanischen wieder 4.',
        },
        {
          question: 'Bei welchen Orten ändert sich der Unterschied nie?',
          answer:
            'Bei jedem Paar, in dem keiner Sommerzeit nutzt — Indien und Japan etwa liegen dauerhaft 3 Stunden 30 Minuten auseinander. Auch Paare innerhalb desselben Regelungsraums sind stabil: Alle EU-Zonen stellen im selben Moment um, deshalb bleiben Lissabon und Athen das ganze Jahr genau 2 Stunden auseinander.',
        },
        {
          question: 'Wie wird der Unterschied berechnet?',
          answer:
            'Indem für beide Zonen der Versatz zum selben Zeitpunkt beim Browser abgefragt und subtrahiert wird. Damit stimmt er in dem Moment, in dem Sie hinsehen — auch mitten in einer Umstellung — statt eine gespeicherte Zahl wiederzugeben, die letzten Monat richtig war.',
        },
        {
          question: 'Was bedeutet ein negativer Unterschied?',
          answer:
            'Dass der zweite Ort hinter dem ersten liegt. Genau deshalb sagt die Seite „vor“ oder „hinter“ in Worten: Minuszeichen bei Zeitunterschieden liest ungefähr die Hälfte aller Menschen verkehrt herum.',
        },
      ],
      sections: [],
    },

    workingHoursOverlap: {
      title: 'Überschneidung der Arbeitszeiten',
      metaTitle: 'Gemeinsame Arbeitszeiten verteilter Teams',
      description:
        'Die genauen Stunden, die ein verteiltes Team teilt, auf der Ortsuhr jedes Einzelnen — oder die ehrliche Auskunft, dass es keine gibt.',
      summary:
        'Fügen Sie die Zonen hinzu, in denen Ihr Team arbeitet, und Sie erhalten die genauen Fenster, in denen alle verfügbar sind, jeweils auf der eigenen Uhr — und die klare Auskunft, wenn es keine gibt.',
      faqs: [
        {
          question: 'Was gilt als Arbeitszeit?',
          answer:
            'Voreingestellt sind 09:00 bis 18:00 Ortszeit für alle, beide Enden sind verstellbar. Bewusst wird jede Zone gleich behandelt, statt Annahmen darüber einzubauen, welche Länder früh anfangen — ein Team, das tatsächlich von 10:00 bis 19:00 arbeitet, sollte das eintragen.',
        },
        {
          question: 'Was, wenn es keine Überschneidung gibt?',
          answer:
            'Sie erfahren es, dazu die nächstgelegenen Fenster, in denen die meisten Beteiligten innerhalb ihrer Arbeitszeit liegen. Los Angeles und Mumbai teilen keine Minute eines Tages von 09:00 bis 18:00; keine Anordnung des Rasters ändert das. Ehrlich bleibt: den Tag auf einer Seite ausweiten, abwechseln, wer das unangenehme Gespräch übernimmt, oder asynchron arbeiten.',
        },
        {
          question: 'Worin unterscheidet sich das vom Besprechungsplaner?',
          answer:
            'Der Planer zeigt den ganzen Tag als Band, damit Sie die Form erkennen. Dieses Werkzeug beantwortet die engere Frage genau: welche Minuten geteilt werden und wie sie auf der Uhr jedes Einzelnen aussehen. Zum Erkunden der Planer, zum Entscheiden dieses.',
        },
        {
          question: 'Berücksichtigt es die Sommerzeit?',
          answer:
            'Ja, für heute. Überschneidungsfenster verschieben sich um eine Stunde, wenn eine Seite bereits umgestellt hat und die andere noch nicht — deshalb hat dasselbe Team im Februar vier gemeinsame Stunden und im März drei.',
        },
      ],
      sections: [],
    },

    unixTimestamp: {
      title: 'Unix-Zeitstempel-Rechner',
      metaTitle: 'Unix-Zeitstempel in ein Datum umrechnen',
      description:
        'Unix-Zeitstempel in ein lesbares Datum umrechnen und zurück, in jeder Zeitzone. Erkennt Sekunden oder Millisekunden und zeigt einen Live-Zähler.',
      summary:
        'Fügen Sie einen Unix-Zeitstempel ein, um ihn als Datum zu lesen, oder wählen Sie ein Datum für den Zeitstempel — der Rechner erkennt, ob Ihre Zahl in Sekunden oder Millisekunden steht, und sagt, wovon er ausgegangen ist.',
      faqs: [
        {
          question: 'Sekunden oder Millisekunden — woran erkennt er das?',
          answer:
            'An der Größe. Ein Zeitstempel ab 1e11 gilt als Millisekunden, denn 1e11 Sekunden entsprechen dem Jahr 5138, und nichts Reales reicht so weit. Die erkannte Einheit steht neben dem Ergebnis, statt still angewendet zu werden: Sich hier zu irren, ist ein Fehler um den Faktor 1000, der Sie im Jahr 1970 landen lässt.',
        },
        {
          question: 'Was ist ein Unix-Zeitstempel?',
          answer:
            'Die Zahl der Sekunden seit dem 1. Januar 1970 um 00:00:00 UTC, ohne Schaltsekunden. Es ist eine einzelne Zahl ohne Zeitzone, und genau deshalb verwenden Systeme sie: Zwei Maschinen irgendwo auf der Erde, die denselben Zeitstempel lesen, meinen denselben Zeitpunkt.',
        },
        {
          question: 'Kann ein Zeitstempel negativ sein?',
          answer:
            'Ja. Alles vor 1970 ist negativ. Die Mondlandung von Apollo 11 liegt bei rund -14.182.940. Dieser Rechner verarbeitet negative Werte in beide Richtungen.',
        },
        {
          question: 'Was passiert 2038?',
          answer:
            'Systemen, die den Zählstand in einer vorzeichenbehafteten 32-Bit-Ganzzahl halten, geht am 19. Januar 2038 um 03:14:07 UTC der Platz aus. Die nächste Sekunde läuft ins Negative über, was diese Systeme als Dezember 1901 lesen. Die meisten modernen Plattformen zählen längst mit 64 Bit; betroffen sind eingebettete und alte Systeme.',
        },
        {
          question: 'Beeinflusst die Zeitzone den Zeitstempel?',
          answer:
            'Den Zeitstempel selbst nicht — er wird immer von einem UTC-Zeitpunkt aus gezählt. Die Zone entscheidet nur, wie dieser Zeitpunkt als Datum und Uhrzeit dargestellt wird und welche Ortszeit zu welcher Zahl zurückführt.',
        },
      ],
      sections: [],
    },

    durationCalculator: {
      title: 'Dauerrechner',
      metaTitle: 'Dauerrechner über Zeitzonen hinweg',
      description:
        'Berechnet die Zeit zwischen zwei Zeitpunkten, jeder in eigener Zone. Sommerzeitfest: Ein 23-Stunden-Tag wird auch als 23 Stunden ausgewiesen.',
      summary:
        'Setzen Sie Beginn und Ende — bei Bedarf jeweils in eigener Zeitzone — und Sie erhalten die tatsächlich verstrichene Zeit, einschließlich der Tage, die 23 oder 25 Stunden lang sind.',
      faqs: [
        {
          question: 'Warum kommt ein Tag manchmal als 23 oder 25 Stunden heraus?',
          answer:
            'Weil er es war. Am Tag der Vorstellung liegen zwischen Mitternacht und Mitternacht 23 Stunden, am Tag der Rückstellung 25. Dieser Rechner löst beide Enden in absolute Zeitpunkte auf, bevor er subtrahiert, und meldet damit die tatsächlich vergangene Zeit statt der, die der Kalender nahelegt.',
        },
        {
          question: 'Können die beiden Enden in verschiedenen Zeitzonen liegen?',
          answer:
            'Ja, und darum geht es. Ein Flug, der um 17:00 in Tokio startet und um 09:30 desselben Morgens in San Francisco landet, dauerte neuneinhalb Stunden, nicht minus siebeneinhalb. Setzen Sie jedes Ende in seine eigene Zone, und die Rechnung geht auf.',
        },
        {
          question: 'Sind Schaltsekunden enthalten?',
          answer:
            'Nein. Browser geben sie nicht heraus — die JavaScript-Uhr ignoriert Schaltsekunden vollständig, deshalb fällt eine Spanne, die über eine hinweggeht, eine Sekunde zu kurz aus. Über die gesamte Geschichte der UTC sind das 27 Sekunden: wichtig für die Satellitennavigation und für nichts, was Sie hier vermutlich messen.',
        },
        {
          question: 'Was, wenn das Ende vor dem Beginn liegt?',
          answer:
            'Das wird gesagt, und der Betrag trotzdem ausgewiesen. Eine negative Dauer ist meist ein Tippfehler, und das Vorzeichen still umzudrehen würde ihn verbergen.',
        },
      ],
      sections: [
        {
          heading: 'Warum Kalenderrechnen kein Uhrenrechnen ist',
          paragraphs: [
            '„Einen Tag später“ und „24 Stunden später“ sind zwei verschiedene Anweisungen, und zweimal im Jahr liefern sie verschiedene Antworten. Ein nächtlicher Job, der für 02:30 Ortszeit eingeplant ist, läuft an einem Herbstmorgen zweimal und an einem Frühlingsmorgen gar nicht. Ist er alle 86.400 Sekunden eingeplant, driftet er stattdessen um eine Stunde von 02:30 weg.',
            'Keines von beidem ist ein Fehler; sie beantworten verschiedene Fragen. Ärger entsteht, wenn der Code das eine tut und der Mensch das andere erwartet hat. Dieser Rechner beantwortet immer die Uhrenfrage — wie viel Zeit tatsächlich vergangen ist — und zeigt die Kalendertage daneben.',
          ],
        },
      ],
    },

    countdown: {
      title: 'Countdown',
      metaTitle: 'Countdown zu jedem Datum und jeder Zone',
      description:
        'Zählen Sie zu jedem Moment in jeder Zeitzone herunter und teilen Sie ihn als Link. Kein Konto, kein Speicher — der Countdown steht in der URL.',
      summary:
        'Wählen Sie einen Zeitpunkt und eine Zone, und der Countdown darunter läuft darauf zu — das Ganze steckt in der URL, geteilt wird also durch Kopieren der Adresszeile.',
      faqs: [
        {
          question: 'Wie teile ich einen Countdown?',
          answer:
            'Einrichten und die Adresszeile kopieren — jedes Feld steht in der URL. Wer sie öffnet, sieht denselben Countdown auf denselben Zeitpunkt, heruntergezählt nach der eigenen Geräteuhr. Es gibt kein Konto, keinen gespeicherten Datensatz und nichts auf einem Server, weil es keinen Server gibt.',
        },
        {
          question: 'Sieht der Empfänger ihn in seiner eigenen Zeitzone?',
          answer:
            'Er sieht denselben Countdown, denn ein Countdown misst den Abstand zu einem Zeitpunkt, und dieser Abstand ist überall gleich. Zieldatum und Zielzeit werden in der von Ihnen gewählten Zone angezeigt, damit alle erkennen, welcher lokale Moment gemeint ist.',
        },
        {
          question: 'Was passiert bei null?',
          answer:
            'Es heißt, der Moment sei vorbei, und der Countdown hält an. Er zählt nicht aufwärts — für die verstrichene Zeit seit einem Ereignis beantwortet der Dauerrechner die Frage sauber.',
        },
        {
          question: 'Kann ich auf eine Zeit herunterzählen, die es nicht gibt?',
          answer:
            'Wählen Sie eine Ortszeit innerhalb einer Umstellungslücke im Frühjahr, rückt der Countdown auf den entsprechenden Zeitpunkt nach der Umstellung und sagt Ihnen das. Es ist dieselbe Regel, die jedes Werkzeug auf dieser Seite anwendet.',
        },
      ],
      sections: [
        {
          heading: 'Warum der ganze Countdown im Link steht',
          paragraphs: [
            'Die meisten Countdown-Werkzeuge verlangen ein Konto, damit sie Ihren Countdown auf ihrem Server ablegen und Ihnen daneben Werbung zeigen können. Hier gibt es keinen Server, also muss der Zustand dort liegen, wo der Link ihn tragen kann — was sich für alle als besser erweist. Nichts anzumelden, nichts später zu löschen, nichts, das aufhört zu funktionieren, wenn eine Firma zumacht.',
            'Eine Sache lohnt sich zu wissen: Weil der Titel in der URL mitreist, behandeln Sie einen Countdown-Link von Fremden wie jeden anderen Link auch. Der Titel wird von allem befreit, was nicht reiner Text ist, und stets als Text dargestellt, nie als Markup.',
          ],
        },
      ],
    },

    utcTime: {
      title: 'UTC-Zeit',
      metaTitle: 'UTC-Zeit jetzt — koordinierte Weltzeit',
      description:
        'Die aktuelle UTC-Zeit, live tickend, dazu was UTC wirklich ist, worin es sich von GMT unterscheidet und woran jeder Zonenversatz gemessen wird.',
      summary:
        'UTC ist die Referenzuhr, gegen die jede andere Zeitzone definiert ist — sie verschiebt sich nie für die Sommerzeit, und die Anzeige unten ist die Uhr Ihres Geräts in UTC ausgedrückt.',
      faqs: [
        {
          question: 'Was ist UTC?',
          answer:
            'Die koordinierte Weltzeit ist die Referenz, gegen die jede andere Zeitzone definiert ist. Sie ist keine Zone, in der jemand lebt — sie ist die Grundlinie. Jeder Versatz, den Sie sehen, von UTC-12 bis UTC+14, ist ein Abstand zu dieser Uhr.',
        },
        {
          question: 'Ist UTC dasselbe wie GMT?',
          answer:
            'Im Alltag zeigen beide dieselbe Zeit, aber sie sind verschiedene Dinge. GMT ist eine Zeitzone, festgelegt über den Sonnenstand am Nullmeridian von Greenwich, und Großbritannien verlässt sie jeden Sommer. UTC ist ein Zeitstandard, gehalten von rund 450 Atomuhren und nie für die Sommerzeit verstellt. Wenn Sie „die Referenz“ meinen, sagen Sie UTC.',
        },
        {
          question: 'Warum die Abkürzung UTC und nicht CUT?',
          answer:
            'Weil weder das englische noch das französische Kürzel gewann. Englischsprachige wollten CUT für „coordinated universal time“, Französischsprachige TUC für „temps universel coordonné“, und die Internationale Fernmeldeunion einigte sich auf UTC — das zu keiner der beiden Sprachen passt und deshalb beide gleichermaßen kränkt.',
        },
        {
          question: 'Gilt in UTC die Sommerzeit?',
          answer:
            'Nie. Genau darum geht es. UTC verschiebt sich nicht, weshalb Server, Luftfahrt, Schifffahrt und jedes verteilte System, in dem sich zwei Maschinen über den Zeitpunkt eines Ereignisses einig sein müssen, damit arbeiten statt mit einer Ortszone.',
        },
        {
          question: 'Und die Schaltsekunden?',
          answer:
            'In UTC wurde gelegentlich eine Schaltsekunde eingefügt, um innerhalb von 0,9 Sekunden der tatsächlichen Erdrotation zu bleiben — 27 seit 1972, die letzte Ende 2016. 2022 beschloss die Generalkonferenz für Maß und Gewicht, bis 2035 damit aufzuhören. Ihr Browser gibt Schaltsekunden nicht heraus, deshalb tut es diese Seite auch nicht.',
        },
      ],
      sections: [
        {
          heading: 'Warum alles von hier aus gemessen wird',
          paragraphs: [
            'Vor 1884 hielt jede Stadt ihre eigene Uhr, gestellt nach ihrem eigenen Mittag. Das ging gut, bis die Eisenbahn kam: Dass zwei Orte sechzig Kilometer auseinander um zwölf Minuten abwichen, war plötzlich keine Kuriosität mehr, sondern ein Kollisionsrisiko. Die Internationale Meridiankonferenz wählte Greenwich zum Nullmeridian, und das heutige System der Versätze folgt daraus.',
            'UTC löste 1972 die Greenwich-Zeit als technischen Standard ab. Der Unterschied wiegt schwerer, als er klingt: GMT ist über die Erde definiert, die eiert, UTC über Caesiumatome, die das nicht tun. Beide werden von Hand innerhalb einer Sekunde zueinander gehalten.',
            'Wenn Sie einen Zeitstempel in einer Datenbank ablegen, ein Ereignis protokollieren oder irgendetwas planen, worüber sich zwei Maschinen einig sein müssen: in UTC speichern und erst zur Anzeige umrechnen. Ortszeit zu speichern ist der Weg zu einer Stunde, die es zweimal im Jahr gibt, und zum passenden Support-Ticket.',
          ],
        },
      ],
    },

    dstChanges: {
      title: 'Zeitumstellungen',
      metaTitle: 'Zeitumstellung: Termine dieses und nächstes Jahr',
      description:
        'Jede geplante Zeitumstellung dieses und nächsten Jahres mit genauem Datum, lokaler Uhrzeit und dem Versatz davor und danach. Nach Land filterbar.',
      summary:
        'Jedes Datum unten stammt aus der IANA-Zeitzonendatenbank, mit dem genauen lokalen Moment, zu dem die Umstellung greift — und die Städte, die ihre Uhren nie umstellen, stehen getrennt aufgeführt.',
      faqs: [
        {
          question: 'Welche Länder haben die Sommerzeit abgeschafft?',
          answer:
            'Russland 2014, die Türkei 2016, der Iran 2022 und Mexiko 2022 für den größten Teil des Landes; Brasilien 2019 nach Jahrzehnten. Japan, Indien, China und fast ganz Afrika und Südostasien haben sie nie genutzt. Rund ein Drittel der Welt hält sie ein; der Rest verfolgt den halbjährlichen Streit mit Interesse.',
        },
        {
          question: 'Plant die Europäische Union weiterhin die Abschaffung?',
          answer:
            'Das Europäische Parlament stimmte 2019 für das Ende der saisonalen Umstellung, doch die Richtlinie blieb stecken: Die Mitgliedstaaten konnten sich nicht darauf einigen, ob dauerhaft Sommer- oder Winterzeit gelten soll, und ein Flickenteppich würde die Zeitzonen des Binnenmarkts zerreißen. Bis das gelöst ist, gelten die Termine auf dieser Seite.',
        },
        {
          question: 'Warum verschiebt sich Lord Howe Island nur um 30 Minuten?',
          answer:
            'Weil die Insel eine ganze Stunde für zu viel hielt. Lord Howe vor der Ostküste Australiens wechselt von UTC+10:30 auf UTC+11:00 — die einzige halbstündige Sommerzeitumstellung der Welt. Sie ist auch der Grund, warum jede Zeitbibliothek, die eine Stundenverschiebung annimmt, für etwa 380 Menschen still danebenliegt.',
        },
        {
          question: 'Wann genau werden die Uhren umgestellt?',
          answer:
            'Das ist unterschiedlich. Die Vereinigten Staaten stellen um 02:00 Ortszeit um, die Europäische Union um 01:00 UTC — alle EU-Zonen also im selben Moment, aber zu verschiedenen Ortszeiten. Australien stellt um 02:00 Ortszeit um, Chile um 24:00. Die Spalte mit der Ortszeit zeigt die letzte Anzeige vor jeder Umstellung.',
        },
        {
          question: 'Wie oft wird diese Seite aktualisiert?',
          answer:
            'Sie wird monatlich neu gebaut und zusätzlich am 1. März, 1. April, 1. Oktober und 1. November, damit jede Änderung an der IANA-Zeitzonendatenbank vor den betroffenen Terminen einfließt. Regierungen kündigen solche Änderungen mit einem Jahr bis zu vierzehn Tagen Vorlauf an.',
        },
      ],
      sections: [],
    },
  },

  hubs: {
    convert: {
      title: 'Zeitzonenumrechnungen',
      metaTitle: 'Zeitzonen umrechnen zwischen Städten',
      description:
        'Jede Städtepaar- und Abkürzungsumrechnung dieser Seite, jeweils mit Stundentabelle, Zeitumstellungsterminen und den Stunden zum Telefonieren.',
      summary:
        'Jede Umrechnung bringt eine Tabelle Stunde für Stunde mit, die Umstellungstermine beider Städte und die Stunden, in denen ein Anruf wirklich möglich ist.',
    },
    cities: {
      title: 'Aktuelle Uhrzeit nach Stadt',
      metaTitle: 'Aktuelle Uhrzeit nach Stadt weltweit',
      description:
        'Ortszeit, UTC-Versatz und Zeitumstellungstermine für 80 Städte auf allen bewohnten Kontinenten.',
      summary:
        'Jede Seite trägt eine Live-Uhr, die genauen Umstellungstermine dieser Zone, Sonnenauf- und -untergang aus den Koordinaten der Stadt berechnet und Umrechnungen zu den großen Knotenpunkten.',
    },
    guides: {
      title: 'Ratgeber',
      metaTitle: 'Ratgeber zu Zeitzonen, UTC und Sommerzeit',
      description:
        'Ratgeber dazu, wie Zeitzonen funktionieren, was UTC ist, warum es die Sommerzeit gibt und wie man das alles im Code richtig behandelt.',
      summary:
        'Wie Zeitzonen wirklich funktionieren — der Mechanismus, die Geschichte und die konkreten Arten, auf die Software daran scheitert. Geschrieben, um einmal gelesen und behalten zu werden, nicht um zu ranken.',
    },
  },

  generated: {
    hourByHour: 'Stunde für Stunde',
    daylightSaving: 'Sommerzeit',
    whenYouCanTalk: 'Wann Sie wirklich sprechen können',
    reference: 'Referenz',
    zoneFacts: 'Fakten zur Zone',
    sunriseSunset: 'Sonnenaufgang und Sonnenuntergang',
    againstHubs: 'Gegen die großen Knotenpunkte',
    convertTo: 'Umrechnen nach',
    exampleNote:
      'Versätze und Termine werden beim Bauen aus der IANA-Datenbank berechnet. Live-Zeiten entstehen in Ihrem Browser.',
    sunNote:
      'Berechnet aus Breite und Länge der Stadt mit dem NOAA-Sonnenstandsalgorithmus — ohne API, ohne Netzwerkaufruf.',
    noDstNote:
      'Diese Stadt nutzt keine Sommerzeit. Ihr Versatz zu UTC ist an jedem Tag des Jahres derselbe.',
    ambiguousPanelHeading: 'Diese Buchstaben bedeuten mehr als eines',
    ambiguousPanelBody:
      'Meinten Sie eine der anderen, ist der Versatz unten für Sie falsch — und genau so werden Termine zur falschen Stunde gebucht.',
    abbreviationTableNote:
      'Berechnet an einem Datum, an dem diese Abkürzung tatsächlich gilt — das heutige Datum wäre für das halbe Jahr falsch.',
  },
};

export default copy;
