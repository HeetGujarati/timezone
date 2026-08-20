---
title: 'Gli scarti da UTC che non sono ore intere'
description: "India, Nepal, Terranova e le isole Chatham vanno a mezz'ore e a quarti d'ora. Ecco l'elenco completo e che cosa si rompe nel software a causa loro."
summary: 'Circa un quinto del mondo vive su uno scarto che non è un numero intero di ore da UTC. Il software che presume il contrario non sbaglia di poco per quelle persone: sbaglia di 30 o 45 minuti, il che è peggio.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 5
keywords:
  [
    'fusi orari di mezz ora',
    'scarto utc 45 minuti',
    'scarto fuso orario india',
    'fuso orario nepal',
  ]
related: ['half-hour-offsets-explained', 'time-zones-in-code', 'how-time-zones-work']
---

Il modello mentale dei ventiquattro fusi da un'ora è sbagliato in modo costoso: produce codice che sbaglia con sicurezza di 30 o 45 minuti per ben più di un miliardo di persone. Un errore di un'ora intera almeno sembra un errore. Uno di 45 minuti sembra un refuso, e va in produzione.

## L'elenco completo

**Scarti a :30**

| Scarto    | Dove                                                            |
| --------- | --------------------------------------------------------------- |
| UTC-09:30 | Isole Marchesi                                                  |
| UTC-03:30 | Terranova e Labrador                                            |
| UTC+03:30 | Iran                                                            |
| UTC+04:30 | Afghanistan                                                     |
| UTC+05:30 | India, Sri Lanka                                                |
| UTC+06:30 | Myanmar, isole Cocos                                            |
| UTC+09:30 | Australia centrale — Territorio del Nord, Australia Meridionale |
| UTC+10:30 | Isola di Lord Howe (ora standard)                               |

**Scarti a :45**

| Scarto    | Dove                                                         |
| --------- | ------------------------------------------------------------ |
| UTC+05:45 | Nepal                                                        |
| UTC+08:45 | Australia Occidentale sudorientale (Eucla, in via ufficiosa) |
| UTC+12:45 | Isole Chatham (ora standard)                                 |

La sola India conta 1,4 miliardi di persone. Aggiungete Iran, Afghanistan, Myanmar, Sri Lanka e Nepal e superate un quinto del pianeta, prima ancora di contare Australia o Canada.

## L'altra specie di scarto insolito

Gli scarti non a ore intere sono la stranezza nota. Altre due pesano altrettanto.

**L'ampiezza è di 26 ore, non di 24.** Kiritimati, a Kiribati, sta su UTC+14; le isole Baker e Howland su UTC-12. Sono 26 ore, il che significa che esistono momenti in cui tre date di calendario diverse sono in uso contemporaneamente da qualche parte sulla Terra. Qualunque codice presuma che una finestra di due giorni copra ogni fuso sbaglia due volte al giorno.

**L'ora legale non è sempre un'ora.** L'isola di Lord Howe, piccola isola australiana con una popolazione stabile di circa 380 persone, si sposta di 30 minuti: UTC+10:30 d'inverno, UTC+11:00 d'estate. È l'unico luogo sulla Terra a farlo, ed è il miglior banco di prova per una libreria di date: qualunque realizzazione fissi uno spostamento di 60 minuti sbaglia lì e in nessun altro posto, il che significa che supererà ogni altro test scriviate.

## Che cosa si rompe

**Arrotondare all'ora più vicina.** Il guasto più comune. Il codice che calcola uno scarto in ore come numero intero tronca l'India a +5 senza dire nulla, il che è un errore di 30 minuti per ogni utente del paese.

**Memorizzare gli scarti come interi.** Una colonna dichiarata come conteggio di ore non può rappresentare Kathmandu. Di solito lo si scopre a dati già dentro.

**Interfacce a griglia costruite su colonne orarie.** Qualunque calendario o pianificatore disponga la giornata in 24 celle uguali e presuma che l'ora locale di ciascun fuso cada su un confine di cella collocherà male i fusi a mezz'ora e a 45 minuti. La fascia del pianificatore di riunioni di questo sito usa istanti come colonne anziché ore locali, così una riga +05:45 mostra 09:45 nella colonna in cui una riga UTC mostra 04:00 — che è la verità, anziché una bugia più ordinata.

**Aritmetica delle durate attraverso un cambio stagionale di 30 minuti.** Presumere che una transizione di ora legale valga esattamente 3.600.000 millisecondi dà la risposta sbagliata sull'isola di Lord Howe, e solo lì.

## Farlo bene

La correzione è la stessa che corregge quasi ogni difetto di fuso orario: **non calcolate mai voi uno scarto.** Chiedetelo alla piattaforma.

Ogni ambiente di esecuzione moderno include la banca dati della IANA e vi dirà lo scarto di un fuso in un dato istante, in minuti e correttamente, anche per Kathmandu e Lord Howe. In JavaScript è `Intl.DateTimeFormat` con `timeZoneName: 'longOffset'`, oppure un confronto fra la lettura d'orologio del fuso e UTC — la via seguita dal motore di questo sito, perché resta esatta persino per gli scarti di tempo medio locale al di sotto del minuto nei dati anteriori al 1900.

Poi attenetevi a tre regole:

1. **Gli scarti sono minuti**, mai ore. Se una variabile si chiama `offsetHours`, è già un difetto.
2. **Provate contro Kathmandu e Lord Howe.** Rompono le due ipotesi che tutto il resto vi lascia conservare.
3. **Non arrotondate mai un fuso orario.** Se una schermata deve essere approssimativa, ditelo; non spostate in silenzio l'orologio di un utente di 30 minuti per rendere più facile un'impaginazione.

## Un esempio svolto: che cosa fanno 45 minuti a una griglia

Prendete un pianificatore di riunioni che dispone la giornata in 24 colonne, una per ora, e ombreggia l'orario di lavoro di ciascun partecipante. La realizzazione ingenua calcola ogni riga spostando la riga di base dello scarto del fuso espresso in ore.

Per Londra contro New York funziona: la riga di New York è quella di Londra spostata di cinque celle a destra. Per Londra contro Kathmandu no. Kathmandu è avanti di 5 ore e 45 minuti, cioè 5,75 celle, e tre quarti di cella non esistono. La realizzazione arrotonda — di solito a 6 — e adesso ogni lettura di quella riga è in anticipo di 15 minuti.

L'errore è abbastanza piccolo da sopravvivere a una revisione e abbastanza grande da contare: una riunione delle 09:00 che la griglia dà per le 09:00 a Kathmandu lì è in realtà alle 08:45, e chi si collega arriva con un quarto d'ora di ritardo sulla propria giornata.

La correzione consiste nello smettere di trattare le colonne come ore. Fate di ogni colonna un _istante_, e chiedete alla piattaforma che cosa segna l'orologio locale di ciascun fuso in quell'istante. Una riga +05:45 mostrerà allora 09:45 dove una riga UTC mostra 04:00: visibilmente non allineata alla griglia, che è la resa onesta. Il pianificatore di riunioni di questo sito fa esattamente questo, e il bordo frastagliato della riga di Kathmandu è un pregio.

## Gli scarti storici sono ancora più strani

Prima della standardizzazione gli scarti erano tempo solare medio locale, precisi al secondo. La banca dati della IANA li registra.

I Paesi Bassi stettero su UTC+00:19:32,13 dal 1909 al 1937. La Liberia fu su UTC-00:44:30 fino al 1972. Chiedete a un ambiente di esecuzione lo scarto di `Europe/Amsterdam` a una data del 1920 e vi darà il valore esatto, secondi compresi.

Ecco perché la funzione degli scarti sotto questo sito calcola in secondi e arrotonda ai minuti solo nello strato di presentazione. Un motore che memorizzasse i minuti perderebbe in silenzio 32 secondi di storia olandese — cosa che nessuno noterebbe, e che sarebbe comunque sbagliata.
