---
title: "Che cos’è davvero UTC e in che cosa differisce da GMT"
description: "UTC è uno standard di tempo tenuto da orologi atomici. GMT è un fuso tenuto dalla Terra. Di solito coincidono, e la differenza conta lo stesso."
summary: "UTC non è un fuso orario. È lo standard di riferimento rispetto a cui ogni fuso viene definito, mantenuto da circa 450 orologi atomici, e non si sposta mai per l’ora legale: è esattamente per questo che i sistemi lo usano."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 2
keywords: ['che cos’è utc', 'utc e gmt', 'tempo universale coordinato', 'utc spiegato']
related: ['how-time-zones-work', 'iso-8601-explained', 'time-zones-in-code']
---

Si usano «UTC» e «GMT» come se fossero la stessa cosa. Quasi sempre non succede nulla, perché quasi sempre segnano la stessa ora. Ma sono oggetti di natura diversa, e quella differenza spiega perché uno dei due è la cosa giusta da salvare nel database e l’altro no.

## UTC è uno standard, non un luogo

Il tempo universale coordinato è tenuto dall’Ufficio internazionale dei pesi e delle misure a partire da una media pesata di circa 450 orologi atomici in una ottantina di istituzioni sparse per il mondo. Quegli orologi misurano la frequenza di risonanza degli atomi di cesio-133, stabile all’incirca a un secondo ogni 100 milioni di anni.

L’ora locale di nessuno è UTC per legge. Persino il Regno Unito, che sta sul meridiano di riferimento, è a UTC+1 per sette mesi l’anno. UTC è il punto fisso da cui ogni ora locale viene descritta: lo zero sul righello, non un segno sulla mappa.

La proprietà più importante per chi costruisce software: **UTC non si sposta mai per l’ora legale.** Non ha variazione stagionale, non ha storia politica, non ha eccezioni. È tutta qui la ragione per cui l’aviazione, la navigazione, i regolamenti finanziari e qualunque sistema distribuito esistente lo usano.

## GMT è un fuso orario con una carriera alle spalle

Il tempo medio di Greenwich è il tempo solare medio all’Osservatorio Reale di Greenwich. È definito dalla rotazione della Terra, che non è uno strumento di precisione: il pianeta oscilla, rallenta in modo irregolare e ogni tanto accelera.

Dal 1884 al 1972 GMT è stato lo standard di tempo del mondo. È stato sostituito da UTC proprio perché gli orologi atomici si sono rivelati un riferimento migliore di un pianeta. GMT sopravvive come nome di un fuso: quello che il Regno Unito usa d’inverno, e quello che diversi paesi dell’Africa occidentale usano tutto l’anno.

Quindi: **UTC non osserva mai l’ora legale. GMT, nell’uso britannico, sì** — la Gran Bretagna lo lascia ogni marzo per il British Summer Time e vi torna ogni ottobre. Se un collega britannico dice «le 15 GMT» a luglio, quasi certamente intende le 15 BST, cioè le 14 UTC. È un errore abbastanza frequente da rendere sensato chiedere anziché dare per scontato.

## Perché si abbrevia UTC

Non ha vinto né l’acronimo inglese né quello francese. Gli anglofoni proponevano CUT per «coordinated universal time». I francofoni proponevano TUC per «temps universel coordonné». L’Unione internazionale delle telecomunicazioni si è fermata su UTC, che non corrisponde a nessuna delle due lingue e perciò offende entrambe allo stesso modo. A suo modo, un esito diplomatico perfetto.

## I secondi intercalari e la loro prossima abolizione

La Terra non ruota a ritmo costante. Per impedire a UTC di allontanarsi dal tempo solare, di tanto in tanto sono stati inseriti secondi in più: 27 fra il 1972 e il 2016. Durante un secondo intercalare un orologio UTC segna 23:59:60, un’ora reale che quasi nessun software sa rappresentare.

I secondi intercalari hanno causato guasti veri. Nel 2012 uno di essi ha messo giù Reddit, i servizi di Mozilla e diversi sistemi di prenotazione aerea, tutti per lo stesso difetto del kernel Linux. Nel 2017 il DNS di Cloudflare si è rotto perché un calcolo di durata è andato in negativo attraversando l’inserimento.

Nel novembre 2022 la Conferenza generale dei pesi e delle misure ha votato per smettere di aggiungere secondi intercalari entro il 2035. A UTC sarà allora permesso di allontanarsi dal tempo solare, e la questione verrà riaperta quando lo scarto diventerà scomodo: probabilmente fra un secolo circa.

Il vostro browser non espone i secondi intercalari. L’orologio di JavaScript fa finta che non siano mai esistiti, per cui un intervallo che ne attraversa uno risulta più corto di un secondo. Per quasi ogni scopo è lo scambio giusto; se vi occupate di navigazione satellitare, lo sapevate già.

## Che cosa fare davvero

**Salvate le marche temporali in UTC.** Non nel fuso dell’utente, non in quello del server, non in quello dove per caso ha sede l’azienda. Un istante UTC è inequivocabile, ordinabile e immune al fatto che un governo cambi idea.

**Convertite in ora locale al momento di mostrarla**, con il fuso di chi legge e la copia della base IANA dell’ambiente.

**Dite UTC quando intendete UTC.** Scrivere «GMT» in una specifica invita qualcuno a leggerlo come ora locale britannica, e d’estate quello sbaglia di un’ora. «12:00 UTC» ha esattamente un significato in ogni giorno dell’anno.

**Usate il suffisso Z di ISO 8601.** `2026-03-08T14:30:00Z` è UTC e non si può leggere in altro modo. `2026-03-08T14:30:00` è un’ora locale in un fuso non indicato, vale a dire che non è affatto una marca temporale.

## La famiglia delle scale di tempo

UTC è una di diverse scale imparentate, e le differenze ogni tanto contano.

**TAI** — il tempo atomico internazionale. La scala atomica grezza, senza secondi intercalari. TAI è attualmente 37 secondi avanti rispetto a UTC, e lo scarto cresce a ogni inserimento. I satelliti GPS lavorano su una scala sfalsata rispetto a TAI.

**UT1** — la rotazione reale della Terra, misurata contro quasar lontani. È ciò che i secondi intercalari di UTC inseguivano. UTC viene tenuto entro 0,9 secondi da UT1; o lo era, fino alla decisione del 2035.

**Tempo GPS** — è partito allineato a UTC nel gennaio 1980 e da allora ignora i secondi intercalari. Oggi è 18 secondi avanti rispetto a UTC. I ricevitori correggono; i sistemi che leggono il tempo GPS grezzo, a volte no.

**Tempo Unix** — il conteggio dei secondi dal 1970, che finge che i secondi intercalari non esistano ripetendo un secondo invece di contarlo. Questo lo rende non proprio un conteggio dei secondi trascorsi, sottigliezza che ha morso chi misurava durate a cavallo di un inserimento.

Per quasi tutto il software UTC è la risposta giusta e il resto è curiosità. Per qualunque cosa riguardi satelliti, marche temporali di negoziazione ad alta frequenza o strumentazione scientifica, quelle distinzioni reggono il peso.

## Perché «ora UTC» è ridondante, e perché lo scriviamo lo stesso

La T sta per «time», quindi «ora UTC» equivale a «ora tempo universale coordinato». I puristi protestano.

Le pagine di questo sito scrivono «ora UTC» comunque, nei titoli e nelle intestazioni, perché è ciò che la gente cerca e ciò che digita. Esiste una versione della correttezza che vi costa il lettore, e la pedanteria su un acronimo ci sta dentro in pieno. Nel corpo del testo, dove chi legge è già arrivato, resta semplicemente UTC.
