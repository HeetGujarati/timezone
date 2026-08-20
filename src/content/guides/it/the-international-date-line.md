---
title: 'La linea del cambiamento di data e perché si piega'
description: 'La linea del cambiamento di data non è un meridiano. Zigzaga attorno ai paesi che preferiscono non essere tagliati in due, e si è già spostata.'
summary: 'La linea internazionale del cambiamento di data segue il meridiano 180° solo alla larga: aggira Kiribati, la Russia e le Aleutine, e alcuni paesi si sono spostati da soli oltre di essa per ragioni commerciali.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 11
keywords:
  [
    'linea internazionale del cambiamento di data',
    'linea del cambiamento di data spiegata',
    'fuso orario kiribati',
    'giorno prima giorno dopo',
  ]
related: ['how-time-zones-work', 'offsets-that-are-not-whole-hours', 'what-utc-really-is']
---

Se navigate verso ovest da Los Angeles abbastanza a lungo, guadagnate un'ora ogni quindici gradi di longitudine all'incirca, e dopo ventiquattro guadagni del genere sareste sfasati di un giorno intero rispetto a chi avete lasciato. La linea internazionale del cambiamento di data è il luogo in cui quel giorno viene restituito.

Non è però una linea. È un confine negoziato, che si incurva attorno ai paesi che altrimenti taglierebbe a metà.

## Dove passa davvero

Nel Pacifico la linea segue grosso modo il meridiano 180°, scelto nel 1884 perché è quello più esattamente opposto a Greenwich e attraversa pochissima terra. Poi compie quattro deviazioni di rilievo:

**A nord, attorno alle Aleutine.** Piega verso est perché tutta l'Alaska mantenga la stessa data invece di spezzare la catena di isole.

**Attorno alla Russia.** Una curva verso ovest tiene la Čukotka sul versante asiatico.

**A est, attorno a Kiribati.** La deviazione maggiore e la più interessante. Kiribati sta a cavallo del meridiano 180° e fino al 1995 il paese era diviso fra due date: le isole occidentali erano un giorno avanti a quelle orientali. Gli uffici governativi di Tarawa condividevano solo quattro giorni lavorativi a settimana con quelli delle isole della Linea. Nel 1995 Kiribati spostò la linea verso est, portando l'intero paese alla stessa data e spingendo il confine fino a 150° ovest: una protuberanza di circa 2.000 chilometri. Così Kiribati ottenne anche il fuso più avanti al mondo, UTC+14, e con esso la prima alba dell'anno 2000, che il governo pubblicizzò con entusiasmo.

**A sud, attorno a Samoa e Tonga.** Il salto compiuto da Samoa nel 2011 è il migliore esempio moderno di una linea che è uno strumento economico e non geografico.

## Il giorno mancante di Samoa

Fino al 2011 Samoa stava sul lato americano della linea, tre ore dietro Sydney ma anche un giorno indietro. I suoi principali partner commerciali si erano spostati dagli Stati Uniti all'Australia e alla Nuova Zelanda, e lo sfasamento di un giorno lasciava solo quattro giornate lavorative comuni a settimana: il venerdì samoano era il sabato australiano, e la domenica samoana era il lunedì australiano.

A mezzanotte del 29 dicembre 2011, Samoa saltò direttamente al 31 dicembre. **Il 30 dicembre 2011 a Samoa non è esistito.** Nessuno compì gli anni, nessun contratto scadde, e il paese passò da UTC-11 a UTC+13.

Tokelau, amministrata dalla Nuova Zelanda, fece lo stesso salto la stessa notte.

Samoa aveva fatto l'inverso nel 1892, passando dal lato asiatico a quello americano su pressione dei commercianti statunitensi — e ripetendo due volte il 4 luglio per riuscirci, cosa che fu presentata come una cortesia verso la comunità americana.

## L'ampiezza di 26 ore

A causa di queste deviazioni, gli scarti orari del mondo coprono più di ventiquattro ore:

- **UTC+14** — Kiritimati (isola di Natale), Kiribati. L'orologio più avanti sulla Terra
- **UTC+13** — Samoa, Tonga e le isole Fenici di Kiribati
- **UTC-11** — Samoa Americane, Niue
- **UTC-12** — le isole Baker e Howland, territori disabitati degli Stati Uniti

Sono 26 ore di ampiezza, e ne discende qualcosa che vale la pena interiorizzare: **esistono istanti in cui tre date di calendario diverse sono in uso contemporaneamente da qualche parte sulla Terra**. Per circa due ore al giorno, Kiritimati è a una data, quasi tutto il mondo alla successiva e l'isola Baker alla precedente.

Qualunque codice che presuma che una finestra di due giorni copra ogni fuso sbaglia durante quegli intervalli. Qualunque domanda del tipo «che giorno è, globalmente» non ha risposta.

Kiritimati e l'isola Baker distano geograficamente circa 2.100 chilometri e 26 ore di orologio. In linea di principio, si potrebbe vedere due volte lo stesso tramonto.

## Che cosa significa nella pratica

**Convertire attraversando la linea cambia la data, non solo l'ora.** Tokyo il lunedì sera è Los Angeles il lunedì mattina; Auckland il lunedì mattina è Honolulu la domenica pomeriggio. Ogni pagina di conversione di questo sito segnala il cambio di giorno in modo esplicito proprio per questo: un'ora giusta nel giorno sbagliato è un errore di specie particolare.

**«Domani» non è un concetto globale.** Una scadenza «fine giornata di venerdì» indica istanti diversi per persone diverse, e per un pubblico davvero mondiale l'intervallo fra il primo venerdì che finisce e l'ultimo supera la giornata. Dite «venerdì alle 23:59 UTC» se intendete un momento solo.

**La linea si sposta.** Non spesso, ma è un confine politico ed è cambiata a memoria di chi vive oggi: due volte in questo secolo. Qualunque sistema con un tracciato fissato nel codice prima o poi sbaglierà. La banca dati della IANA registra questi cambiamenti; serve a questo.

## Attraversarla nella pratica

I voli sul Pacifico producono orari di arrivo che sembrano errori e non lo sono.

Un volo che lascia Tokyo alle 17:00 di lunedì e dura nove ore atterra a Los Angeles alle 10:00 di **lunedì**: sette ore prima di partire, secondo l'orologio. Nell'altro senso, un volo che lascia Los Angeles il lunedì pomeriggio arriva a Tokyo il mercoledì mattina, avendo saltato il martedì quasi per intero.

Nessuno dei due è un paradosso. Il volo è durato nove ore in entrambe le direzioni; sono cambiate solo le etichette. È esattamente per questo che il calcolatore di durate di questo sito riduce entrambi gli estremi a istanti prima di sottrarre: la differenza fra due letture d'orologio ai due lati della linea non significa nulla, mentre la differenza fra due istanti è sempre il tempo realmente trascorso.

La conseguenza pratica per chiunque costruisca software di prenotazione o di logistica: **non calcolate mai una durata sottraendo orari locali**. Funziona quasi sempre, ed è questo a renderlo pericoloso.

## Quale lato è «avanti»

La convenzione confonde perché rovescia l'intuizione della carta geografica. I paesi appena a _ovest_ della linea — Nuova Zelanda, Figi, Kiribati — sono i primi a vedere ogni nuovo giorno. Quelli appena a _est_ — Hawaii, Samoa Americane — sono gli ultimi.

Così Auckland è quasi un giorno intero avanti a Honolulu benché disti solo 7.000 chilometri circa, e le due città stanno a date diverse per la maggior parte di ogni ciclo di ventiquattro ore.

La regola che aiuta: la linea è dove il giorno _comincia_, e il giorno spazza poi il globo verso ovest, tornando alla linea ventiquattro ore dopo mentre il successivo si apre. Kiritimati, a UTC+14, è il primo luogo abitato a raggiungere una data qualsiasi. L'isola Baker, a UTC-12, è l'ultimo.
