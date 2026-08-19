---
title: "ISO 8601, ovvero come scrivere una data senza ambiguità"
description: "03/04/2026 indica due date diverse a seconda di chi legge. ISO 8601 lo risolve, e vale la pena conoscerne le regole con precisione."
summary: "ISO 8601 esiste perché 03/04/2026 è marzo in America e aprile ovunque altrove. Scrivere 2026-04-03 elimina l’ambiguità, si ordina correttamente come testo ed è ciò che ogni interfaccia dovrebbe accettare."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 7
keywords: ['iso 8601', 'formato data standard', 'formato marca temporale', 'rfc 3339']
related: ['what-utc-really-is', 'time-zones-in-code', 'the-2038-problem']
---

`03/04/2026` è il 3 aprile in quasi tutto il mondo e il 4 marzo negli Stati Uniti. Dalla sola stringa non c’è modo di capire quale fosse inteso, e le due letture sono entrambe del tutto ragionevoli. Ogni anno questa ambiguità produce scadenze mancate, doppie prenotazioni e almeno un guasto memorabile.

ISO 8601 è la norma internazionale che la elimina.

## Il formato di base

```
2026-04-03T14:30:00Z
```

Leggendo da sinistra a destra, dall’unità più grande alla più piccola:

- `2026-04-03` — anno, mese, giorno, ciascuno con lo zero iniziale, sempre in quest’ordine
- `T` — il separatore fra data e ora, obbligatorio nella forma rigorosa
- `14:30:00` — ore, minuti, secondi su un orologio a 24 ore
- `Z` — l’indicatore di fuso. `Z` significa esattamente UTC

Il punto è l’ordine. Poiché le componenti vanno dalla più significativa alla meno significativa, **una stringa ISO 8601 si ordina correttamente come testo semplice**. `2026-04-03` precede `2026-04-10` in un semplice confronto di stringhe, cosa che nessun altro formato comune riesce a fare. Già solo questa proprietà giustifica la norma.

## Indicatori di fuso

Tre forme sono valide, e significano cose diverse:

| Forma                       | Significato                                                              |
| --------------------------- | ------------------------------------------------------------------------ |
| `2026-04-03T14:30:00Z`      | 14:30 UTC. Non ambigua                                                    |
| `2026-04-03T14:30:00+05:45` | 14:30 ora locale in un fuso avanti di 5 h 45 min su UTC. Non ambigua      |
| `2026-04-03T14:30:00`       | 14:30 in un fuso non indicato. **Non è una marca temporale**              |

La terza forma è quella che crea guai. È una _data-ora locale_: una lettura d’orologio senza alcun modo di collocarla su una linea del tempo. Passarla attraverso un confine di sistema sperando che l’altra parte assuma il vostro stesso fuso è un difetto che aspetta un rilascio in un’altra regione.

Notate anche che cosa non è uno scarto: `+05:45` vi dice lo scarto del Nepal, non che la marca temporale venga dal Nepal. Gli scarti non sono fusi — lo stesso scarto è condiviso da più fusi, e lo scarto di un fuso cambia. Portate a fianco l’identificativo se dovete sapere dove.

## RFC 3339, il profilo che probabilmente volete

ISO 8601 è ampia. Permette date settimanali (`2026-W14-5`), date ordinali (`2026-093`), unità frazionarie e una forma troncata che omette il secolo. Quasi nulla di tutto ciò è ciò che volete in un’interfaccia.

RFC 3339 è un profilo stretto per i protocolli di internet. Richiede la data completa, richiede un indicatore di fuso e ammette come separatore o `T` o uno spazio. Quando qualcuno dice «formato ISO» parlando di un’API, intende quasi sempre RFC 3339.

**Una regola utile:** accettate tutto ciò che un buon analizzatore digerisce; emettete solo RFC 3339 rigoroso con `Z`.

## Durate e intervalli

Meno usati, e vale la pena conoscerli quando si incontrano.

Le **durate** cominciano con `P` di periodo, e `T` separa la parte data dalla parte ora:

- `P3Y6M4D` — tre anni, sei mesi, quattro giorni
- `PT1H30M` — un’ora e trenta minuti
- `P1DT12H` — un giorno e dodici ore

La `T` non è facoltativa: `P1M` è un mese, `PT1M` è un minuto. È il classico difetto delle durate ISO 8601.

Gli **intervalli** uniscono due punti con una barra: `2026-04-03T14:00Z/2026-04-03T16:00Z`, oppure un punto e una durata: `2026-04-03T14:00Z/PT2H`.

I dati strutturati `HowTo` di questo sito usano la sintassi delle durate — `PT2M` per un’attività di due minuti — perché schema.org prescrive durate ISO 8601.

## Le date settimanali e la trappola che nascondono

`2026-W14-5` è il venerdì della quattordicesima settimana ISO del 2026. Le settimane ISO cominciano di lunedì, e la settimana 1 è quella che contiene il primo giovedì di gennaio.

La conseguenza su cui si inciampa: **l’anno settimanale ISO non è sempre l’anno solare.** Il 1º gennaio 2027 cade nella settimana ISO 53 del 2026. Il codice di formattazione che accoppia un numero di settimana ISO con un anno solare produce una data sbagliata per qualche giorno ogni anno, e nella maggior parte dei linguaggi gli identificatori di formato si somigliano quasi del tutto (`YYYY` contro `GGGG`, o `%Y` contro `%G`).

## Regole pratiche

1. **Salvate in UTC, emettete con `Z`.** `2026-04-03T14:30:00Z` ha esattamente un significato ovunque.
2. **Non emettete mai una data-ora locale nuda attraverso un confine.** Se non potete allegare un fuso, non avete una marca temporale.
3. **Riempite tutto con lo zero.** `2026-4-3` non è ISO 8601 valido, anche se quasi tutti gli analizzatori lo accettano.
4. **Usate i separatori `-` e `:`.** La forma compatta (`20260403T143000Z`) è lecita ma ostile, e alcuni analizzatori la rifiutano.
5. **Tenete l’identificativo di fuso a parte** quando dovete sapere _dove_, non solo _quale scarto_. `Europe/London` sopravvive a un cambio di regole; `+01:00` no.

## Insidie nell’analisi

Anche con una norma, è nell’analisi che le cose vanno storte.

**Il costruttore `Date` di JavaScript è incoerente con input non ISO.** `new Date('2026-04-03')` viene letto come mezzanotte UTC. `new Date('2026-04-03T00:00:00')` — senza indicatore di fuso — viene letto come mezzanotte _locale_. I due differiscono del vostro scarto, il che significa che lo stesso codice produce giorni diversi a seconda di dove gira. Mettete sempre un indicatore di fuso.

**Gli anni a due cifre sono ambigui e andrebbero rifiutati.** ISO 8601 ammette una forma troncata; quasi nulla dovrebbe accettarla. `26-04-03` potrebbe essere il 1926 o il 2026, e la finestra scorrevole che decide è una scelta di politica nascosta dentro un analizzatore.

**I decimi di secondo variano in precisione.** `14:30:00.5`, `14:30:00.500` e `14:30:00.500000` sono tutti validi e tutti lo stesso istante. Un analizzatore che confronta stringhe anziché istanti non sarà d’accordo.

**La virgola è lecita.** ISO 8601 ammette `14:30:00,5` — virgola decimale — e anzi la preferisce. Quasi tutti gli analizzatori la rifiutano. Se consumate dati da un sistema europeo, tenetevi pronti.

**La mezzanotte ha due scritture.** `24:00:00` di un giorno è lo stesso istante di `00:00:00` del giorno dopo, ed entrambe sono ISO 8601 valido. Emettete la seconda forma; accettatele entrambe.

## Una nota sull’ordinamento

L’ordinabilità di ISO 8601 vale solo per stringhe con la stessa rappresentazione di fuso. `2026-04-03T14:00:00Z` e `2026-04-03T10:00:00-05:00` sono lo stesso istante, ma come stringhe la seconda si ordina prima.

Se ordinate marche temporali come testo — in un file di registro, in un nome di file, in una colonna di database tipizzata come testo — normalizzatele prima tutte a UTC con `Z`. Altrimenti l’ordine è una proprietà della formattazione e non del tempo.
