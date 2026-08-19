---
title: "ISO 8601 und wie man ein Datum eindeutig schreibt"
description: "03/04/2026 bedeutet je nach Leserin zwei verschiedene Daten. ISO 8601 behebt das, und seine Regeln lohnen es, genau gekannt zu werden."
summary: "ISO 8601 gibt es, weil 03/04/2026 in Amerika März und überall sonst April heißt. 2026-04-03 zu schreiben beseitigt die Doppeldeutigkeit, sortiert als Text korrekt und ist das, was jede Schnittstelle annehmen sollte."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 7
keywords: ['iso 8601', 'datumsformat standard', 'zeitstempel format', 'rfc 3339']
related: ['what-utc-really-is', 'time-zones-in-code', 'the-2038-problem']
---

`03/04/2026` ist in den meisten Teilen der Welt der 3. April und in den Vereinigten Staaten der 4. März. Aus der Zeichenfolge allein lässt sich nicht sagen, was gemeint war, und beide Lesarten sind völlig vernünftig. Jedes Jahr erzeugt diese Doppeldeutigkeit versäumte Fristen, Doppelbuchungen und mindestens einen denkwürdigen Ausfall.

ISO 8601 ist die internationale Norm, die sie beseitigt.

## Das Kernformat

```
2026-04-03T14:30:00Z
```

Von links nach rechts gelesen, von der größten zur kleinsten Einheit:

- `2026-04-03` — Jahr, Monat, Tag, jeweils mit führender Null, stets in dieser Reihenfolge
- `T` — der Trenner zwischen Datum und Uhrzeit, in der strengen Form vorgeschrieben
- `14:30:00` — Stunden, Minuten, Sekunden auf einer 24-Stunden-Uhr
- `Z` — die Zonenkennung. `Z` bedeutet genau UTC

Auf die Reihenfolge kommt es an. Weil die Bestandteile von der bedeutendsten zur unbedeutendsten laufen, **sortiert eine ISO-8601-Zeichenfolge als reiner Text korrekt**. `2026-04-03` steht bei einfachem Zeichenkettenvergleich vor `2026-04-10`, was kein anderes gebräuchliches Format schafft. Schon diese Eigenschaft rechtfertigt die Norm.

## Zonenkennungen

Drei Formen sind gültig, und sie bedeuten Verschiedenes:

| Form                        | Bedeutung                                                        |
| --------------------------- | ---------------------------------------------------------------- |
| `2026-04-03T14:30:00Z`      | 14:30 UTC. Eindeutig                                              |
| `2026-04-03T14:30:00+05:45` | 14:30 Ortszeit in einer Zone 5 h 45 min vor UTC. Eindeutig        |
| `2026-04-03T14:30:00`       | 14:30 in einer nicht genannten Zone. **Kein Zeitstempel**         |

Die dritte Form macht den Ärger. Sie ist ein _lokales Datum mit Uhrzeit_ — eine Uhranzeige ohne jede Möglichkeit, sie auf einer Zeitachse zu verorten. Sie über eine Systemgrenze zu reichen und zu hoffen, die Gegenseite nehme dieselbe Zone an wie Sie, ist ein Fehler, der auf ein Deployment in einer anderen Region wartet.

Beachten Sie auch, was ein Versatz nicht ist: `+05:45` nennt Nepals Versatz, nicht dass der Zeitstempel aus Nepal stammt. Versätze sind keine Zonen — denselben Versatz teilen sich mehrere Zonen, und der Versatz einer Zone ändert sich. Führen Sie die Kennung mit, wenn Sie wissen müssen, wo.

## RFC 3339, das Profil, das Sie vermutlich wollen

ISO 8601 ist groß. Es erlaubt Wochendaten (`2026-W14-5`), Ordinaldaten (`2026-093`), Bruchteile von Einheiten und eine gekürzte Form ohne Jahrhundert. Das meiste davon wollen Sie in einer Schnittstelle nicht.

RFC 3339 ist ein verschärftes Profil für Internetprotokolle. Es verlangt das vollständige Datum, verlangt eine Zonenkennung und erlaubt als Trenner entweder `T` oder ein Leerzeichen. Wenn jemand im Zusammenhang mit einer Schnittstelle „ISO-Format“ sagt, meint er fast immer RFC 3339.

**Eine brauchbare Regel:** nehmen Sie alles an, was ein guter Parser verdaut; geben Sie nur striktes RFC 3339 mit `Z` aus.

## Dauern und Intervalle

Seltener gebraucht, und es lohnt, sie zu kennen, wenn man ihnen begegnet.

**Dauern** beginnen mit `P` für Periode, und `T` trennt Datums- von Zeitanteilen:

- `P3Y6M4D` — drei Jahre, sechs Monate, vier Tage
- `PT1H30M` — eine Stunde dreißig Minuten
- `P1DT12H` — ein Tag zwölf Stunden

Das `T` ist nicht optional: `P1M` ist ein Monat, `PT1M` ist eine Minute. Das ist der klassische Fehler mit ISO-8601-Dauern.

**Intervalle** verbinden zwei Punkte mit einem Schrägstrich: `2026-04-03T14:00Z/2026-04-03T16:00Z`, oder einen Punkt und eine Dauer: `2026-04-03T14:00Z/PT2H`.

Die strukturierten `HowTo`-Daten dieser Seite verwenden die Dauersyntax — `PT2M` für eine Aufgabe von zwei Minuten —, weil schema.org ISO-8601-Dauern vorschreibt.

## Wochendaten und die Falle darin

`2026-W14-5` ist der Freitag der vierzehnten ISO-Woche 2026. ISO-Wochen beginnen am Montag, und Woche 1 ist die Woche, die den ersten Donnerstag im Januar enthält.

Die Folge, über die man stolpert: **das ISO-Wochenjahr ist nicht immer das Kalenderjahr.** Der 1. Januar 2027 fällt in die ISO-Woche 53 des Jahres 2026. Formatierungscode, der eine ISO-Wochennummer mit einem Kalenderjahr paart, erzeugt jedes Jahr für ein paar Tage ein falsches Datum — und in den meisten Sprachen sehen die Formatangaben fast gleich aus (`YYYY` gegen `GGGG` oder `%Y` gegen `%G`).

## Praktische Regeln

1. **In UTC speichern, mit `Z` ausgeben.** `2026-04-03T14:30:00Z` hat überall genau eine Bedeutung.
2. **Nie ein nacktes lokales Datum mit Uhrzeit über eine Grenze schicken.** Wenn Sie keine Zone anhängen können, haben Sie keinen Zeitstempel.
3. **Alles mit führender Null.** `2026-4-3` ist kein gültiges ISO 8601, auch wenn die meisten Parser es annehmen.
4. **`-` und `:` als Trenner verwenden.** Die kompakte Form (`20260403T143000Z`) ist zulässig, aber unfreundlich, und manche Parser lehnen sie ab.
5. **Die Zonenkennung getrennt führen**, wenn Sie wissen müssen, _wo_, und nicht nur _welcher Versatz_. `Europe/London` übersteht eine Regeländerung, `+01:00` nicht.

## Fallstricke beim Parsen

Selbst mit einer Norm ist das Parsen die Stelle, an der es schiefgeht.

**Der `Date`-Konstruktor von JavaScript ist bei nicht normgerechter Eingabe uneinheitlich.** `new Date('2026-04-03')` wird als Mitternacht UTC gelesen. `new Date('2026-04-03T00:00:00')` — ohne Zonenkennung — wird als _lokale_ Mitternacht gelesen. Die beiden unterscheiden sich um Ihren Versatz, das heißt, derselbe Code liefert je nach Laufort verschiedene Tage. Setzen Sie immer eine Zonenkennung.

**Zweistellige Jahre sind doppeldeutig und gehören abgelehnt.** ISO 8601 erlaubt eine gekürzte Form; fast nichts sollte sie annehmen. `26-04-03` könnte 1926 oder 2026 sein, und das Schiebefenster, das darüber entscheidet, ist eine politische Entscheidung, die sich in einem Parser versteckt.

**Sekundenbruchteile haben unterschiedliche Genauigkeit.** `14:30:00.5`, `14:30:00.500` und `14:30:00.500000` sind alle gültig und alle derselbe Zeitpunkt. Ein Parser, der Zeichenketten statt Zeitpunkte vergleicht, wird anderer Meinung sein.

**Das Komma ist zulässig.** ISO 8601 erlaubt `14:30:00,5` — ein Dezimalkomma — und zieht es sogar vor. Die meisten Parser lehnen es ab. Wer Daten aus einem europäischen System entgegennimmt, sei darauf gefasst.

**Mitternacht hat zwei Schreibweisen.** `24:00:00` an einem Tag ist derselbe Zeitpunkt wie `00:00:00` am nächsten, und beide sind gültiges ISO 8601. Geben Sie die zweite Form aus; nehmen Sie beide an.

## Eine Anmerkung zum Sortieren

Die Sortierbarkeit von ISO 8601 gilt nur für Zeichenketten mit derselben Zonendarstellung. `2026-04-03T14:00:00Z` und `2026-04-03T10:00:00-05:00` sind derselbe Zeitpunkt, aber als Zeichenketten steht die zweite früher.

Wer Zeitstempel als Text sortiert — in einer Protokolldatei, in einem Dateinamen, in einer als Text typisierten Datenbankspalte —, normalisiere sie vorher alle auf UTC mit `Z`. Sonst ist die Reihenfolge eine Eigenschaft der Formatierung und nicht der Zeit.
