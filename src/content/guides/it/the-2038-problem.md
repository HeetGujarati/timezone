---
title: 'Il problema del 2038, spiegato come si deve'
description: 'Alle 03:14:07 UTC del 19 gennaio 2038 il tempo Unix a 32 bit con segno va in overflow. Ecco cosa si rompe davvero e cosa è già stato risolto.'
summary: 'I sistemi che memorizzano il tempo come conteggio di secondi a 32 bit con segno esauriscono lo spazio nel gennaio 2038 e tornano al dicembre 1901. Quasi tutte le piattaforme moderne hanno risolto anni fa; l’esposizione residua riguarda l’embedded, il legacy e i dati serializzati.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 6
keywords: ['problema del 2038', 'bug anno 2038', 'overflow timestamp unix', 'y2038']
related: ['time-zones-in-code', 'iso-8601-explained', 'what-utc-really-is']
---

Alle 03:14:07 UTC del 19 gennaio 2038 il numero di secondi trascorsi dal 1º gennaio 1970 raggiunge 2.147.483.647. È il valore più grande che un intero a 32 bit con segno possa contenere. Un secondo dopo passa a −2.147.483.648, che quei sistemi leggono come 13 dicembre 1901.

È un problema reale con una data certa, il che lo rende insolito fra i problemi del software.

## Perché 32 bit

Il tempo Unix fu progettato all’inizio degli anni Settanta, quando un intero a 32 bit era la dimensione di parola naturale e 68 anni di margine sembravano generosi. Il tipo `time_t` su quei sistemi era un intero a 32 bit con segno, e quella scelta si è propagata nel C, in ogni linguaggio che ha incapsulato il C, nei formati di file, nei protocolli di rete e negli schemi dei database.

È il segno a dare all’overflow il suo sintomo caratteristico. Un conteggio a 32 bit senza segno durerebbe fino al 2106; uno con segno divide il proprio intervallo attorno al 1970, quindi il traboccamento atterra nel 1901 anziché a zero.

## Cosa è già successo

Il problema del 2038 provoca guasti in produzione da anni, perché il software calcola abitualmente date future.

- I calcoli sui mutui trentennali hanno iniziato a superare la soglia nel 2008.
- Date di scadenza dei certificati, TTL delle cache e job pianificati ci sono finiti ripetutamente.
- Nel 2006 un difetto nel timeout predefinito del database di AOLserver — impostato a un miliardo di secondi, cosa che andò bene finché non andò più bene — mise fuori uso il software quando la scadenza calcolata andò in overflow.

Lo schema è che il guasto arriva molto prima della data, in qualunque porzione di codice guardi più avanti nel tempo.

## Cosa è già risolto

La situazione è decisamente migliore di quanto lasci intendere l’allarmismo.

- **Sistemi a 64 bit**: `time_t` è a 64 bit praticamente su ogni piattaforma a 64 bit. Si esaurisce fra circa 292 miliardi di anni.
- **Linux a 32 bit**: il kernel 5.6 (marzo 2020) ha introdotto `time_t` a 64 bit sulle architetture a 32 bit, e le principali distribuzioni hanno rilasciato lo spazio utente corrispondente.
- **JavaScript**: usa un numero in virgola mobile a doppia precisione per i millisecondi, valido per circa 275.000 anni da entrambi i lati del 1970. Non ha mai avuto questo problema.
- **Java**: `Instant` usa un conteggio di secondi a 64 bit più i nanosecondi.
- **Python**: gli interi hanno precisione arbitraria; il vincolo è la libreria C della piattaforma.
- **PostgreSQL, MySQL 8.0.28+, SQL Server**: memorizzazione dei timestamp a 64 bit.

## Dove resta l’esposizione

**Sistemi embedded.** Controllori industriali, dispositivi medicali, elettronica dei veicoli, contatori e sensori, molti progettati per vite di servizio di venti o trent’anni, molti senza alcun percorso di aggiornamento, molti già installati. È qui che si concentra il rischio reale, e non esiste un censimento centrale.

**Il tipo `TIMESTAMP` di MySQL prima della 8.0.28.** È un conteggio di secondi a 32 bit e il suo massimo documentato è 2038-01-19 03:14:07. `DATETIME` non è mai stato interessato. Un’enorme quantità di dati di produzione risiede nel tipo di colonna vulnerabile.

**Dati serializzati e formati di file.** Tutto ciò che ha scritto un campo temporale a 32 bit resta un campo temporale a 32 bit per quanto recente sia il lettore. Vecchi formati d’archivio, protocolli binari e strutture su disco trascinano avanti il vincolo.

**Build a 32 bit ancora in servizio.** Alcuni router, decoder e apparati di lunga durata eseguono uno spazio utente a 32 bit su un kernel non aggiornato.

## Cosa farci

**Verificare i tipi di memorizzazione.** Cercare colonne `int(11)` che contengono timestamp, `TIMESTAMP` di MySQL su versioni vecchie e qualunque formato binario con un campo temporale a 32 bit. È lì che i dati sopravvivono al codice.

**Provare con date oltre il 2038.** Impostare una fixture di test al 2040 ed eseguire la suite. Quasi tutti i bug del 2038 si riproducono banalmente, non appena qualcuno ci prova.

**Preferire interi a 64 bit o stringhe ISO 8601.** Un `BIGINT` di millisecondi o una colonna `TIMESTAMPTZ` non ha un orizzonte degno di preoccupazione. Una stringa ISO 8601 non ne ha affatto, al costo di dimensione e velocità di confronto.

**Non memorizzare mai più date in nulla che sia a 32 bit.** Il risparmio di spazio è irrilevante sull’hardware moderno e l’orizzonte ricade ormai dentro la vita di servizio di un software ordinario.

## Gli altri orizzonti temporali

Il 2038 è il più vicino, non l’unico.

- **2036**: il campo era a 32 bit di NTP trabocca il 7 febbraio. NTPv4 lo gestisce, ma le installazioni variano.
- **2106**: traboccano i conteggi di secondi a 32 bit senza segno.
- **2262**: vanno in overflow i conteggi di _nanosecondi_ a 64 bit — cioè `time.Time` di Go nella sua rappresentazione in nanosecondi, e il datetime64[ns] predefinito di pandas.

Quest’ultimo è più vicino di quanto sembri per chiunque scriva codice di elaborazione dati, ed è lo stesso errore su scala diversa: un’unità abbastanza fine da essere utile, in una larghezza che all’epoca pareva generosa.

## Come controllare i propri sistemi

Quattro verifiche, in ordine crescente di impegno.

**Controllare i tipi delle colonne del database.** In PostgreSQL, `SELECT column_name, data_type FROM information_schema.columns WHERE data_type LIKE '%timestamp%'` dice cosa si ha; `timestamp with time zone` è a 64 bit ed è sicuro. In MySQL, cercare le colonne `TIMESTAMP` sui server precedenti alla 8.0.28 — sono quelle esposte, mentre `DATETIME` non lo è mai stato.

**Spostare avanti l’orologio.** In un contenitore usa e getta, impostare la data di sistema al 2040 ed eseguire la suite di test. È un metodo rozzo e trova una quantità sorprendente di cose, perché quasi nessun bug del 2038 è sottile una volta superata la soglia.

**Cercare i tipi temporali a 32 bit.** In C e C++, qualunque `int` o `long` esplicito che contenga un valore temporale su un target a 32 bit. Negli schemi di serializzazione, qualunque campo temporale da 4 byte. Nel codice applicativo, ogni punto in cui un timestamp viene convertito in un intero a 32 bit per memorizzarlo o trasmetterlo.

**Testare il futuro lontano nelle fixture, non solo quello vicino.** Un test che usa «adesso più un giorno» passerà fino al 2038 e poi fallirà di martedì. Un test che usa una data esplicita nel 2040 fallisce oggi, mentre c’è qualcuno disponibile a sistemarlo.

## Cosa non fare

Non «risolvere» la cosa passando a interi a 32 bit senza segno. Guadagna 68 anni, perde la capacità di rappresentare qualunque data precedente al 1970 e scarica la stessa conversazione su chi manterrà il sistema nel 2106. La differenza fra 4 e 8 byte non vale una seconda migrazione.

Non dare per scontato che un linguaggio moderno protegga. Il codice applicativo può essere perfettamente sicuro mentre i dati che legge sono stati scritti da qualcosa che non lo era — formati di file e protocolli di rete trascinano il vincolo attraverso ogni riscrittura.
