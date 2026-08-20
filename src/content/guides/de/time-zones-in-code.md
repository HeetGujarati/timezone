---
title: 'Zeitzonen im Code, ein praktischer Leitfaden'
description: 'UTC speichern, den Zonenbezeichner behalten, bei der Anzeige umrechnen, nie eine Abweichungstabelle bauen. Die Regeln und die Begründung dahinter.'
summary: 'Fast jeder Zeitzonenfehler geht auf einen von vier Fehlgriffen zurück. Hier steht, was stattdessen zu tun ist — in JavaScript, Python, Java, Go und SQL, mit Begründung statt bloßer Regel.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 9
keywords:
  [
    'zeitzonen im code',
    'datum und zeit best practices',
    'zeitstempel speichern',
    'utc in der datenbank',
  ]
related: ['what-utc-really-is', 'iso-8601-explained', 'the-2038-problem']
---

Fast jeder Zeitzonenfehler im Produktivbetrieb geht auf einen von vier Fehlgriffen zurück: eine Ortszeit zu speichern, eine Abweichung statt einer Zone zu speichern, in der falschen Schicht umzurechnen oder eine Abweichungstabelle von Hand zu bauen. Alles Folgende ergibt sich daraus, diese zu vermeiden.

## Regel 1: Zeitpunkte in UTC speichern

Ein Zeitpunkt ist eine Stelle auf der Zeitachse. Eine Ortszeit ist eine Uhrzeitablesung, die eine Zone und eine Auflösungsregel braucht, bevor sie überhaupt etwas bedeutet.

```sql
-- Gut: ein Zeitpunkt
created_at TIMESTAMPTZ NOT NULL

-- Schlecht: eine Uhrzeitablesung ohne Zone
created_at TIMESTAMP NOT NULL
```

`TIMESTAMPTZ` in PostgreSQL speichert keine Zone — es normalisiert beim Schreiben auf UTC und rechnet beim Lesen um. Genau das wollen Sie für „wann ist das geschehen".

## Regel 2: den Zonenbezeichner speichern, nicht die Abweichung

Wenn Sie wissen müssen, _wo_ — für einen wiederkehrenden Termin, eine Nutzereinstellung, die Öffnungszeiten eines Betriebs —, speichern Sie `Europe/London`, nicht `+01:00`.

Eine Abweichung ist eine Aussage über einen einzigen Zeitpunkt. Eine Zone ist ein Regelwerk, das es übersteht, wenn eine Regierung ihre Meinung ändert. Britannien liegt im Januar bei `+00:00` und im Juli bei `+01:00`; eines von beidem zu speichern und „die Zone des Nutzers" zu nennen, ist ein halbes Jahr lang falsch.

```sql
event_start_local  TIMESTAMP   NOT NULL,  -- die gewählte Uhrzeit
event_time_zone    TEXT        NOT NULL,  -- 'Europe/London'
event_start_utc    TIMESTAMPTZ NOT NULL   -- aufgelöster Zeitpunkt, bei Regeländerung neu berechnet
```

Bei einem wiederkehrenden Termin sind Ortszeit und Zone die Wahrheitsquelle; der UTC-Zeitpunkt ist ein abgeleiteter Index. Ändert sich tzdata — und das tut es mehrmals im Jahr —, wird die abgeleitete Spalte neu erzeugt, und die 09:00 des Nutzers bleiben 09:00.

## Regel 3: am Rand umrechnen

Die Fachlogik arbeitet in Zeitpunkten. Die Umrechnung in eine lesbare Ortszeit geschieht so spät wie möglich, in der Schicht, die weiß, wer liest.

Wichtiger ist die Folgerung: **lassen Sie niemals die Zone des Servers ins Verhalten einsickern.** Setzen Sie `TZ=UTC` in Ihrer Betriebsumgebung und behandeln Sie jeden Codepfad, dessen Ergebnis von der Spracheinstellung des Servers abhängt, als Fehler. Das ist die Fehlerklasse, die erst auftaucht, wenn jemand in eine zweite Region ausrollt.

## Regel 4: niemals eine Abweichungstabelle bauen

Jede Laufzeitumgebung bringt die IANA-Datenbank mit. Nutzen Sie sie.

**JavaScript**

```js
// In einer Zone formatieren
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

// Abweichung ohne Bibliothek: die Uhr der Zone gegen UTC vergleichen
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

Setzen Sie `hourCycle: 'h23'` ausdrücklich. Manche ICU-Fassungen melden Mitternacht unter `en-US` als Stunde 24, was das Datum um einen Tag verschiebt und ein wirklich elender Fehler zum Finden ist.

**Python**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo  # Standardbibliothek seit 3.9

now = datetime.now(timezone.utc)
local = now.astimezone(ZoneInfo("Asia/Kathmandu"))
```

Verwenden Sie nie `datetime.utcnow()`. Es liefert ein naives Datum, das _wie_ UTC aussieht, aber keine Zone trägt, und es mit zonenbewussten Werten zu mischen wirft zum denkbar schlechtesten Zeitpunkt. `datetime.now(timezone.utc)` ist der richtige Aufruf.

**Java**

```java
Instant now = Instant.now();
ZonedDateTime local = now.atZone(ZoneId.of("Asia/Kathmandu"));
```

`java.time` ist gut entworfen: `Instant` für Punkte auf der Zeitachse, `LocalDateTime` für Uhrzeitablesungen ohne Zone, `ZonedDateTime` für beides zusammen. Das Typsystem erzwingt genau die Unterscheidung, auf der dieser Leitfaden beharrt.

**Go**

```go
loc, _ := time.LoadLocation("Asia/Kathmandu")
local := time.Now().In(loc)
```

`LoadLocation` liest die tzdata des Systems. In einem leeren Container gibt es keine — binden Sie `_ "time/tzdata"` ein, um sie ins Programm einzubetten, sonst fällt jede Zonenabfrage stillschweigend auf UTC zurück.

## Die zwei Tage im Jahr

Das Vorstellen löscht eine Stunde, das Zurückstellen wiederholt eine. Wählen Sie eine Regel, wenden Sie sie durchgängig an und sagen Sie dem Nutzer, was Sie getan haben:

- **Nicht existierende Ortszeit** (02:30 am US-Frühjahrstermin): um die Größe der Lücke vorschieben, sodass aus 02:30 die Zeit 03:30 wird.
- **Mehrdeutige Ortszeit** (01:30 am US-Herbsttermin): das erste, frühere Vorkommen nehmen.

Das sind die Regeln dieser Website, und sie entsprechen der Voreinstellung `disambiguation: 'compatible'` von ECMAScript `Temporal` — eine Übereinstimmung, die sich lohnt, damit Ihr Verhalten mit der Plattform übereinstimmt.

Die Lücke ist nicht immer eine Stunde. Die Lord-Howe-Insel verschiebt sich um 30 Minuten, lesen Sie die Größe also aus der Umstellung, statt sie anzunehmen.

## Testen

Vier Fälle fangen das meiste ab:

1. **Eine Halbstundenzone** — `Asia/Kolkata` (+05:30). Fängt Annahmen über ganze Stunden.
2. **Eine 45-Minuten-Zone** — `Asia/Kathmandu` (+05:45). Fängt Annahmen über halbe Stunden.
3. **Eine Zone der Südhalbkugel** — `Australia/Sydney`. Fängt „Sommer heißt Juni".
4. **Lord-Howe-Insel** — `Australia/Lord_Howe`. Fängt die fest verdrahtete 60-Minuten-Umstellung, und nichts sonst tut das.

Fügen Sie für jede Zone, in der Ihre Nutzer tatsächlich sind, ein Vorstell- und ein Zurückstelldatum hinzu, und pinnen Sie die tzdata-Fassung in der Integrationsstrecke, damit eine Datenbankaktualisierung nicht aus dem falschen Grund einen Build scheitern lässt.

## Wiederkehrende Termine sind ein anderes Problem

Ein einmaliger Termin ist ein Zeitpunkt. Ein wiederkehrender Termin ist eine Regel, und beide brauchen unterschiedliche Speicherung.

„Jeden Dienstag um 09:00 in Europe/London" ist nicht „alle 604800 Sekunden ab diesem Zeitpunkt". Die beiden laufen in dem Moment auseinander, in dem Britannien seine Uhren umstellt: die Regel hält die Besprechung bei 09:00 Ortszeit, während das Zeitintervall sie auf 08:00 oder 10:00 treiben lässt.

Speichern Sie die Regel — Ortszeit, Zonenbezeichner, Wiederholungsmuster — und erzeugen Sie Zeitpunkte daraus. Ändert sich tzdata, erzeugen Sie die materialisierten Zeitpunkte neu; migrieren Sie sie nicht. Die Regel ist das, dem der Nutzer zugestimmt hat.

Die heiklen Fälle folgen aus den beiden jährlichen Unstetigkeiten. Eine Besprechung täglich um 02:30 wird feststellen, dass es diese Zeit an einem Frühjahrstag nicht gibt und dass sie an einem Herbsttag zweimal stattfindet. Wählen Sie eine Regel, wenden Sie sie durchgängig an, und seien Sie sich bewusst, dass verschiedene Kalendersysteme verschiedene gewählt haben — weshalb derselbe wiederkehrende Termin an genau zwei Tagen im Jahr in zwei Kalendern eine Stunde auseinanderliegen kann.

## Eine Anmerkung zu `Temporal`

Die `Temporal`-Schnittstelle von ECMAScript ersetzt `Date` durch Typen, die Zeitpunkte, Uhrzeiten und zonenbehaftete Datumszeiten unterscheiden, nach Art von `java.time`. `Temporal.ZonedDateTime` trägt einen Zonenbezeichner; `Temporal.Instant` ist ein Punkt auf der Zeitachse; `Temporal.PlainDateTime` ist eine Uhrzeitablesung ohne Zone, und das Typsystem hindert Sie daran, sie zu verwechseln.

Seine Einstellung `disambiguation` legt genau jene Regel für die zwei Tage im Jahr offen, auf die dieser Leitfaden immer wieder zurückkommt: `'compatible'` (die Voreinstellung — durch Lücken vorschieben, von einem mehrdeutigen Paar das frühere nehmen), `'earlier'`, `'later'` und `'reject'`. Das letzte lohnt eine Überlegung überall dort, wo stillschweigend eine Stunde danebenzuliegen schlimmer ist als ein Fehler.
