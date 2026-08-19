---
title: "Warum EST mehrdeutig ist und was man stattdessen nimmt"
description: "IST bedeutet drei verschiedene Dinge, CST vier. Zeitzonenkürzel sind keine Kennungen, und sie dafür zu halten erzeugt echte Fehler."
summary: "Zeitzonenkürzel sind informelle Etiketten ohne zuständiges Gremium und ohne Garantie auf Eindeutigkeit. IST ist Indien, Irland und Israel; CST ist Amerika, China und Kuba. Nehmen Sie stattdessen IANA-Kennungen."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 10
keywords: ['est mehrdeutig', 'zeitzonen abkürzungen', 'ist bedeutung', 'cst zeitzone']
related: ['how-time-zones-work', 'time-zones-in-code', 'what-utc-really-is']
---

In einer Kalendereinladung steht „14:00 IST“. Je nachdem, wer sie verschickt hat, ist das 08:30 UTC, 13:00 UTC oder 12:00 UTC. Nichts an der Zeichenfolge verrät, welches gemeint ist, und alle drei Lesarten sind korrekter Sprachgebrauch.

Zeitzonenkürzel sind informell. Kein Normungsgremium vergibt sie, keines garantiert Eindeutigkeit, und mehrere sind aktiv umstritten. Im Gespräch zwischen Menschen mit gemeinsamem Kontext sind sie in Ordnung; überall sonst sind sie unsicher.

## Die Kollisionen, auf die es ankommt

**IST** — drei Bedeutungen, alle in Gebrauch:

| Bedeutung                     | Versatz   | Zone                          |
| ----------------------------- | --------- | ----------------------------- |
| Indian Standard Time          | UTC+05:30 | `Asia/Kolkata`                |
| Irish Standard Time           | UTC+01:00 | `Europe/Dublin` (nur Sommer)  |
| Israel Standard Time          | UTC+02:00 | `Asia/Jerusalem`              |

Indien und Irland liegen viereinhalb Stunden auseinander. Eine im falschen IST gebuchte Besprechung ist nicht ein wenig zu früh, sondern den größten Teil eines Arbeitstags daneben.

**CST** — vier Bedeutungen:

| Bedeutung                             | Versatz   | Zone                 |
| ------------------------------------- | --------- | -------------------- |
| Central Standard Time (Nordamerika)   | UTC-06:00 | `America/Chicago`    |
| China Standard Time                   | UTC+08:00 | `Asia/Shanghai`      |
| Cuba Standard Time                    | UTC-05:00 | `America/Havana`     |
| Central Standard Time (Australien)    | UTC+09:30 | `Australia/Adelaide` |

Chicago und Schanghai trennen vierzehn Stunden.

**PST** — Pacific Standard Time bei UTC-08:00 und Philippine Standard Time bei UTC+08:00. Genau sechzehn Stunden auseinander, was bedeutet: Ein Irrtum landet an einem anderen Kalendertag.

**BST** — British Summer Time bei UTC+01:00 und Bangladesh Standard Time bei UTC+06:00.

**EST** — Eastern Standard Time in Nordamerika bei UTC-05:00 und historisch das Kürzel, das Australien vor der Einführung von AEST für seine Oststaaten bei UTC+10:00 benutzte. Ältere australische Dokumente führen die nackte Form bis heute.

## Das andere Problem: Kürzel sind saisonal

Selbst wo ein Kürzel eindeutig ist, benennt es nur die Hälfte des Jahres.

`America/New_York` ist von November bis März EST und von März bis November EDT. „EST“ im Juli beschreibt also überhaupt keine existierende Uhr — die Zone steht dann auf EDT. Die Leute schreiben es trotzdem und meinen „New Yorker Zeit“, und ein System, das es wörtlich nimmt, rechnet sieben Monate lang eine Stunde falsch.

Genau deshalb ist „EST“ das am häufigsten missbrauchte Kürzel im Netz: Es wird als Name für einen Ort benutzt, obwohl es der Name einer Jahreszeit an diesem Ort ist.

## Die meisten Zonen haben gar kein Kürzel

Die Zonen der englischsprachigen Welt haben überwiegend Buchstabenkürzel. Die meisten Zonen haben keine.

Tokio, Schanghai und São Paulo haben in den ICU-Daten, die jede englische Locale verwendet, kein Buchstabenkürzel — sie werden als „GMT+9“, „GMT+8“ und „GMT-3“ ausgegeben. Man sieht „JST“ für Japan geschrieben, und es wird verstanden, aber es ist Konvention und keine Datenlage.

Daraus erwächst für jeden, der ein Zeitzonen-Werkzeug baut, eine naheliegende Versuchung: die Lücken zu füllen. „JST“ erfinden, weil es plausibel aussieht, „BRT“ für Brasilien, irgendetwas für Kathmandu. Diese Seite tut das bewusst nicht. Wo keine Locale Buchstaben führt, zeigt sie den Versatz — denn ihr einziges Versprechen lautet, dass die Daten aus der IANA-Datenbank stammen und nicht aus Vermutungen, und ein erfundenes Kürzel ist genau die Art plausibler Unwahrheit, die ein Nachschlagewerk unglaubwürdig macht.

## Was man stattdessen nimmt

**IANA-Kennungen.** `America/New_York`, `Asia/Kolkata`, `Europe/Dublin`. Sie sind eindeutig, stabil, und sie benennen einen Ort mit Regelgeschichte statt einer Jahreszeit.

Sie überstehen auch Regeländerungen. Als die Türkei 2016 die Sommerzeit abschaffte, bedeutete `Europe/Istanbul` weiterhin Türkei. Jeder Code, der an „EET“ oder „EEST“ hing, musste geändert werden.

**Wenn Sie für Menschen schreiben**, nennen Sie Stadt und Versatz: „14:00 in Mumbai (UTC+05:30)“. Damit kann jemand überall handeln, ohne zu wissen, welches IST gemeint war.

**In Kalendereinladungen** lassen Sie den Kalender die Zone anhängen. Jeder moderne Kalender speichert eine Zonenkennung beim Termin und rechnet für jede eingeladene Person um. Ein Kürzel in den Titel zu tippen macht genau das zunichte.

**In Schnittstellen und Daten** verwenden Sie ISO 8601 mit ausdrücklichem Versatz oder `Z` und führen die Kennung getrennt mit, wenn Sie wissen müssen, _wo_ und nicht nur _welcher Versatz_.

## Wenn Sie eines lesen müssen

Wenn Sie ein Kürzel erhalten haben und nicht nachfragen können, hilft der Kontext:

- Wer hat es geschickt? Ein indisches Unternehmen meint Indien, ein irisches Irland.
- Welcher Versatz würde die vorgeschlagene Uhrzeit für die andere Seite sinnvoll machen? Niemand legt einen Anruf auf 03:00.
- Steht im Verlauf eine Stadt? Eine Stadt klärt es vollständig.

Und wenn es darauf ankommt — ein Kundengespräch, eine Frist, ein Wartungsfenster —, fragen Sie. Zehn Sekunden „Indien oder Irland?“ sind billiger als die Alternative, und die gefragte Person hat sich dasselbe vermutlich schon selbst gefragt.

## Die Kürzel, die sicher sind

Nicht jedes Kürzel ist umstritten. Ein paar sind in der Praxis eindeutig und im Fließtext vertretbar — im Code trotzdem nicht:

- **UTC** — eine Bedeutung, per Definition
- **CEST** — Central European Summer Time, eindeutig
- **AEDT** / **AEST** — Australian Eastern, eindeutig seit der Einführung des A-Präfixes
- **NZDT** / **NZST** — Neuseeland
- **JST** — Japan, per Konvention und nicht per Datenlage; ICU führt es für keine englische Locale

Beachten Sie das Muster: Sicher sind die mit einem Länder- oder Kontinentpräfix. „Eastern Standard Time“ musste kollidieren, weil mehr als ein Kontinent einen Osten hat.

## Was die IANA-Datenbank über Kürzel sagt

Die Datenbank verzeichnet Kürzel durchaus, in einem Feld je Zonenabschnitt, behandelt sie aber als informell. Ihre eigene Dokumentation hält fest, dass sie weder eindeutig noch genormt sind und in einigen Fällen von den Pflegenden der Datenbank erfunden wurden, wo es kein örtliches Kürzel gab.

Mehrere wurden mit der Zeit als Erfindungen wieder entfernt. Zonen, die einst erfundene Dreibuchstabencodes trugen, melden heute eine numerische Form wie `+0545` — gerade weil ein ausgedachtes Kürzel schlechter ist als ein ehrlicher Versatz.

Genau dieses redaktionelle Urteil — dass eine plausible Erfindung schlechter ist als das Eingeständnis einer Lücke — wendet diese Seite ebenfalls an. Deshalb steht in der Kürzelspalte einer Tokio-Seite UTC+9 und nicht JST.
