---
title: 'I fusi orari nel codice, una guida pratica'
description: "Memorizzate UTC, conservate l'identificatore del fuso, convertite alla visualizzazione, non costruite mai una tabella di scarti. Le regole e il perché."
summary: 'Quasi ogni difetto legato ai fusi orari risale a uno di quattro errori. Ecco che cosa fare invece, in JavaScript, Python, Java, Go e SQL, con il ragionamento e non solo la regola.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 9
keywords:
  [
    'fusi orari nel codice',
    'buone pratiche data e ora',
    'memorizzare marche temporali',
    'utc nel database',
  ]
related: ['what-utc-really-is', 'iso-8601-explained', 'the-2038-problem']
---

Quasi ogni difetto legato ai fusi orari in produzione risale a uno di quattro errori: memorizzare un'ora locale, memorizzare uno scarto anziché un fuso, convertire nello strato sbagliato, o costruire a mano una tabella di scarti. Tutto ciò che segue discende dall'evitarli.

## Regola 1: memorizzate gli istanti in UTC

Un istante è un punto sulla linea del tempo. Un'ora locale è una lettura d'orologio, che ha bisogno di un fuso e di una politica di disambiguazione prima di significare qualcosa.

```sql
-- Bene: un istante
created_at TIMESTAMPTZ NOT NULL

-- Male: una lettura d'orologio senza fuso
created_at TIMESTAMP NOT NULL
```

Il `TIMESTAMPTZ` di PostgreSQL non memorizza un fuso: normalizza a UTC in scrittura e converte in lettura. È esattamente ciò che serve per «quando è successo».

## Regola 2: memorizzate l'identificatore del fuso, non lo scarto

Se dovete sapere _dove_ — per un evento ricorrente, una preferenza dell'utente, gli orari di apertura di un'attività — memorizzate `Europe/London`, non `+01:00`.

Uno scarto è un fatto relativo a un solo istante. Un fuso è un insieme di regole che sopravvive a un governo che cambia idea. La Gran Bretagna è a `+00:00` in gennaio e a `+01:00` in luglio; memorizzare l'uno o l'altro chiamandolo «il fuso dell'utente» è sbagliato per metà anno.

```sql
event_start_local  TIMESTAMP   NOT NULL,  -- l'ora d'orologio scelta
event_time_zone    TEXT        NOT NULL,  -- 'Europe/London'
event_start_utc    TIMESTAMPTZ NOT NULL   -- istante risolto, ricalcolato se le regole cambiano
```

Per un evento ricorrente, l'ora locale e il fuso sono la fonte di verità; l'istante in UTC è un indice derivato. Se tzdata cambia — e cambia più volte l'anno — la colonna derivata viene rigenerata e le 09:00 dell'utente restano le 09:00.

## Regola 3: convertite al margine

La logica applicativa lavora in istanti. La conversione in un'ora locale leggibile avviene nell'ultimo momento possibile, nello strato che sa chi sta leggendo.

Il corollario conta di più: **non lasciate mai che il fuso del server trapeli nel comportamento.** Impostate `TZ=UTC` nell'ambiente di distribuzione e considerate un difetto qualunque percorso di codice il cui risultato dipenda dalle impostazioni locali del server. È la classe di guasto che compare solo quando qualcuno distribuisce in una seconda regione.

## Regola 4: non costruite mai una tabella di scarti

Ogni ambiente di esecuzione include la banca dati della IANA. Usatela.

**JavaScript**

```js
// Formattare in un fuso
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

// Ottenere uno scarto senza librerie: confrontare l'orologio del fuso con UTC
function offsetMinutes(timeZone, instant) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return (asUtc - Math.floor(instant / 1000) * 1000) / 60000;
}
```

Impostate `hourCycle: 'h23'` in modo esplicito. Alcune versioni di ICU riportano la mezzanotte come ora 24 sotto `en-US`, il che sposta la data di un giorno ed è un difetto davvero penoso da trovare.

**Python**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo  # libreria standard dalla 3.9

now = datetime.now(timezone.utc)
local = now.astimezone(ZoneInfo("Asia/Kathmandu"))
```

Non usate mai `datetime.utcnow()`. Restituisce una data ingenua che _sembra_ UTC ma non porta alcun fuso, e mescolarla con date consapevoli solleva un'eccezione nel momento peggiore. La chiamata corretta è `datetime.now(timezone.utc)`.

**Java**

```java
Instant now = Instant.now();
ZonedDateTime local = now.atZone(ZoneId.of("Asia/Kathmandu"));
```

`java.time` è ben progettato: `Instant` per i punti sulla linea del tempo, `LocalDateTime` per le letture d'orologio senza fuso, `ZonedDateTime` per entrambi insieme. Il sistema dei tipi impone la distinzione su cui questa guida continua a insistere.

**Go**

```go
loc, _ := time.LoadLocation("Asia/Kathmandu")
local := time.Now().In(loc)
```

`LoadLocation` legge la tzdata del sistema. In un contenitore vuoto non ce n'è: importate `_ "time/tzdata"` per incorporarla nel programma, altrimenti ogni ricerca di fuso ricade in silenzio su UTC.

## I due giorni dell'anno

Lo spostamento in avanti cancella un'ora; quello indietro ne ripete una. Scegliete una politica, applicatela con coerenza, e dite all'utente che cosa avete fatto:

- **Ora locale inesistente** (le 02:30 nella data primaverile statunitense): spostare avanti della dimensione del buco, così le 02:30 diventano le 03:30.
- **Ora locale ambigua** (le 01:30 nella data autunnale statunitense): prendere la prima occorrenza, la più antica.

Sono le politiche usate da questo sito, e coincidono con il valore predefinito `disambiguation: 'compatible'` di `Temporal` in ECMAScript: vale la pena allinearsi perché il vostro comportamento concordi con la piattaforma.

Il buco non è sempre un'ora. L'isola di Lord Howe si sposta di 30 minuti, quindi leggete la dimensione dalla transizione anziché presumerla.

## Provare

Quattro casi intercettano quasi tutto:

1. **Un fuso a mezz'ora** — `Asia/Kolkata` (+05:30). Intercetta le ipotesi di ore intere.
2. **Un fuso a 45 minuti** — `Asia/Kathmandu` (+05:45). Intercetta le ipotesi di mezz'ora.
3. **Un fuso dell'emisfero australe** — `Australia/Sydney`. Intercetta l'«estate vuol dire giugno».
4. **L'isola di Lord Howe** — `Australia/Lord_Howe`. Intercetta lo spostamento di 60 minuti fissato nel codice, e nient'altro lo farà.

Aggiungete una data di spostamento in avanti e una indietro per ciascun fuso in cui i vostri utenti si trovano davvero, e fissate la versione di tzdata nell'integrazione continua, perché un aggiornamento della banca dati non faccia fallire una compilazione per il motivo sbagliato.

## Gli eventi ricorrenti sono un altro problema

Un evento singolo è un istante. Un evento ricorrente è una regola, e i due chiedono memorizzazioni diverse.

«Ogni martedì alle 09:00 in Europe/London» non è «ogni 604800 secondi a partire da questo istante». I due divergono nel momento in cui la Gran Bretagna cambia gli orologi: la regola tiene la riunione alle 09:00 locali, mentre l'intervallo la fa slittare alle 08:00 o alle 10:00.

Memorizzate la regola — ora locale, identificatore del fuso, schema di ricorrenza — e da essa materializzate gli istanti. Quando tzdata cambia, rigenerate gli istanti materializzati; non migrateli. La regola è ciò a cui l'utente ha acconsentito.

I casi scomodi discendono dalle due discontinuità annuali. Una riunione alle 02:30 tutti i giorni scoprirà che in un giorno di primavera quell'ora non esiste, e che in un giorno d'autunno accade due volte. Scegliete una politica, applicatela con coerenza, e sappiate che sistemi di calendario diversi ne hanno scelte di diverse: ecco perché lo stesso evento ricorrente può comparire a un'ora di distanza in due calendari, esattamente due giorni l'anno.

## Una nota su `Temporal`

L'interfaccia `Temporal` di ECMAScript sostituisce `Date` con tipi che distinguono istanti, ore d'orologio e date con fuso, alla maniera di `java.time`. `Temporal.ZonedDateTime` porta un identificatore di fuso; `Temporal.Instant` è un punto sulla linea del tempo; `Temporal.PlainDateTime` è una lettura d'orologio senza fuso, e il sistema dei tipi vi impedisce di confonderli.

La sua opzione `disambiguation` espone esattamente la politica dei due giorni l'anno a cui questa guida continua a tornare: `'compatible'` (il valore predefinito — spostarsi avanti attraverso i buchi, prendere la più antica di una coppia ambigua), `'earlier'`, `'later'` e `'reject'`. L'ultima merita considerazione ovunque sbagliare in silenzio di un'ora sia peggio di un errore.
