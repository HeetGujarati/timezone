---
title: "Das Jahr-2038-Problem, richtig erklärt"
description: "Am 19. Januar 2038 um 03:14:07 UTC läuft die vorzeichenbehaftete 32-Bit-Unix-Zeit über. Hier steht, was wirklich bricht und was längst behoben ist."
summary: "Systeme, die Zeit als vorzeichenbehaftete 32-Bit-Sekundenzahl speichern, gehen im Januar 2038 über und landen im Dezember 1901. Die meisten modernen Plattformen haben das vor Jahren behoben; gefährdet sind heute eingebettete, alte und serialisierte Daten."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 6
keywords: ['2038 problem', 'jahr-2038-fehler', 'unix zeitstempel überlauf', 'y2038']
related: ['time-zones-in-code', 'iso-8601-explained', 'what-utc-really-is']
---

Am 19. Januar 2038 um 03:14:07 UTC erreicht die Zahl der Sekunden seit dem 1. Januar 1970 den Wert 2.147.483.647. Das ist der größte Wert, den eine vorzeichenbehaftete 32-Bit-Ganzzahl fassen kann. Eine Sekunde später springt sie auf −2.147.483.648, was diese Systeme als 13. Dezember 1901 lesen.

Das ist ein echtes Problem mit festem Datum — was es unter Softwareproblemen ungewöhnlich macht.

## Warum 32 Bit

Die Unix-Zeit entstand Anfang der 1970er Jahre, als eine 32-Bit-Ganzzahl die natürliche Wortbreite war und 68 Jahre Vorlauf großzügig wirkten. Der Typ `time_t` war auf jenen Systemen eine vorzeichenbehaftete 32-Bit-Ganzzahl, und diese Wahl pflanzte sich fort: in C, in jede Sprache, die C umhüllte, in Dateiformate, in Netzwerkprotokolle und in Datenbankschemata.

Das Vorzeichen gibt dem Überlauf sein charakteristisches Symptom. Eine vorzeichenlose 32-Bit-Zählung hielte bis 2106; eine vorzeichenbehaftete teilt ihren Bereich um 1970 herum, deshalb landet der Überlauf 1901 statt bei null.

## Was bereits passiert ist

Das 2038-Problem fällt seit Jahren im Produktivbetrieb auf, weil Software routinemäßig mit Daten in der Zukunft rechnet.

- Berechnungen für dreißigjährige Hypotheken überschritten die Grenze ab 2008.
- Ablaufdaten von Zertifikaten, Cache-Lebensdauern und geplante Jobs sind wiederholt darauf gestoßen.
- 2006 legte ein Fehler in der voreingestellten Datenbankzeitüberschreitung von AOLserver — eine Milliarde Sekunden, was gutging, bis es das nicht mehr tat — die Software lahm, als das errechnete Ablaufdatum überlief.

Das Muster: Der Ausfall trifft lange vor dem Datum ein, und zwar in dem Code, der am weitesten vorausschaut.

## Was bereits behoben ist

Die Lage ist deutlich besser, als die Panik nahelegt.

- **64-Bit-Systeme**: `time_t` ist auf praktisch jeder 64-Bit-Plattform 64 Bit breit. Das reicht rund 292 Milliarden Jahre.
- **Linux auf 32 Bit**: Kernel 5.6 (März 2020) brachte 64-Bit-`time_t` auf 32-Bit-Architekturen, und die großen Distributionen haben den passenden Userspace ausgeliefert.
- **JavaScript**: verwendet eine Gleitkommazahl doppelter Genauigkeit für Millisekunden, gültig für etwa 275.000 Jahre beiderseits von 1970. Dieses Problem hatte es nie.
- **Java**: `Instant` nutzt eine 64-Bit-Sekundenzahl plus Nanosekunden.
- **Python**: Ganzzahlen sind beliebig genau; die Grenze setzt die C-Bibliothek der Plattform.
- **PostgreSQL, MySQL ab 8.0.28, SQL Server**: 64-Bit-Zeitstempelspeicherung.

## Wo die Gefährdung bleibt

**Eingebettete Systeme.** Industriesteuerungen, Medizingeräte, Fahrzeugelektronik, Zähler und Sensoren — viele für 20 oder 30 Jahre Dienstzeit ausgelegt, viele ohne Aktualisierungspfad, viele längst im Feld. Hier steckt der Großteil des echten Risikos, und es wird nirgends zentral erfasst.

**Der Typ `TIMESTAMP` von MySQL vor 8.0.28.** Er ist eine 32-Bit-Sekundenzahl, und sein dokumentiertes Maximum ist 2038-01-19 03:14:07. `DATETIME` war nie betroffen. Sehr viele Produktivdaten liegen im betroffenen Spaltentyp.

**Serialisierte Daten und Dateiformate.** Was einmal ein 32-Bit-Zeitfeld geschrieben hat, bleibt ein 32-Bit-Zeitfeld, wie neu der Leser auch sei. Alte Archivformate, Binärprotokolle und Strukturen auf der Platte tragen die Beschränkung weiter.

**Noch laufende 32-Bit-Installationen.** Manche Router, Set-Top-Boxen und langlebige Geräte betreiben 32-Bit-Userspace auf einem ungepatchten Kernel.

## Was zu tun ist

**Speichertypen prüfen.** Suchen Sie nach `int(11)`-Spalten mit Zeitstempeln, nach MySQL-`TIMESTAMP` auf alten Versionen und nach jedem Binärformat mit einem 32-Bit-Zeitfeld. Dort überlebt die Datenlage den Code.

**Mit Daten nach 2038 testen.** Stellen Sie eine Testvorgabe auf 2040 und lassen Sie die Suite laufen. Die meisten 2038-Fehler lassen sich trivial reproduzieren, sobald es jemand versucht.

**64-Bit-Ganzzahlen oder ISO-8601-Zeichenketten bevorzugen.** Ein `BIGINT` in Millisekunden oder eine `TIMESTAMPTZ`-Spalte hat keinen Horizont, über den nachzudenken wäre. Eine ISO-8601-Zeichenkette hat überhaupt keinen — zum Preis von Größe und Vergleichsgeschwindigkeit.

**Daten nie wieder als irgendetwas mit 32 Bit speichern.** Die Platzersparnis ist auf heutiger Hardware bedeutungslos, und der Horizont liegt inzwischen innerhalb der Lebensdauer gewöhnlicher Software.

## Die anderen Zeithorizonte

2038 ist der nächste, nicht der einzige.

- **2036**: Das 32-Bit-Ära-Feld von NTP läuft am 7. Februar über. NTPv4 kommt damit zurecht, die Installationen unterscheiden sich aber.
- **2106**: Vorzeichenlose 32-Bit-Sekundenzählungen springen um.
- **2262**: 64-Bit-_Nanosekunden_-Zählungen laufen über — das betrifft `time.Time` in Go in seiner Nanosekundendarstellung und das voreingestellte `datetime64[ns]` von pandas.

Der letzte Punkt ist für alle, die Datenverarbeitung schreiben, näher, als er klingt, und es ist derselbe Fehler in anderem Maßstab: eine Einheit fein genug, um nützlich zu sein, in einer Breite, die damals großzügig wirkte.

## Wie Sie Ihre eigenen Systeme prüfen

Vier Prüfungen, mit steigendem Aufwand.

**Prüfen Sie die Spaltentypen Ihrer Datenbank.** In PostgreSQL sagt Ihnen `SELECT column_name, data_type FROM information_schema.columns WHERE data_type LIKE '%timestamp%'`, was Sie haben; `timestamp with time zone` ist 64 Bit und sicher. In MySQL suchen Sie `TIMESTAMP`-Spalten auf Servern vor 8.0.28 — die sind gefährdet, `DATETIME` war es nie.

**Stellen Sie eine Uhr vor.** Setzen Sie in einem Wegwerf-Container das Systemdatum auf 2040 und lassen Sie die Testsuite laufen. Das ist grob und findet erstaunlich viel, weil die meisten 2038-Fehler jenseits der Grenze nicht subtil sind.

**Suchen Sie nach 32-Bit-Zeittypen.** In C und C++ jedes ausdrückliche `int` oder `long`, das auf einem 32-Bit-Ziel einen Zeitwert hält. In Serialisierungsschemata jedes 4-Byte-Zeitfeld. Im Anwendungscode jede Stelle, an der ein Zeitstempel zum Speichern oder Übertragen auf eine 32-Bit-Ganzzahl gecastet wird.

**Testen Sie die ferne Zukunft in Vorgaben, nicht nur die nahe.** Ein Test mit „jetzt plus ein Tag“ läuft bis 2038 und fällt dann an einem Dienstag um. Ein Test mit einem ausdrücklichen Datum in 2040 fällt heute um, solange jemand da ist, der es beheben kann.

## Was man nicht tun sollte

„Lösen“ Sie das nicht durch den Umstieg auf vorzeichenlose 32-Bit-Ganzzahlen. Das erkauft 68 Jahre, verliert die Fähigkeit, Daten vor 1970 darzustellen, und schiebt dasselbe Gespräch auf die, die das System 2106 pflegen. Der Unterschied zwischen 4 und 8 Byte ist keine zweite Migration wert.

Nehmen Sie nicht an, eine moderne Sprache schütze Sie. Anwendungscode kann vollkommen sicher sein, während die Daten, die er liest, von etwas geschrieben wurden, das es nicht war — Dateiformate und Protokolle tragen die Beschränkung durch jede Neuentwicklung hindurch.
