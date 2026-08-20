---
title: 'Was UTC wirklich ist und wie es sich von GMT unterscheidet'
description: 'UTC ist ein Zeitstandard, gehalten von Atomuhren. GMT ist eine Zeitzone, gehalten von der Erde. Meist stimmen sie überein — der Unterschied zählt trotzdem.'
summary: 'UTC ist keine Zeitzone. Es ist der Referenzstandard, gegen den jede Zeitzone definiert wird, gehalten von rund 450 Atomuhren, und es verschiebt sich nie für die Sommerzeit — genau deshalb arbeiten Systeme damit.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 2
keywords: ['was ist utc', 'utc oder gmt', 'koordinierte weltzeit', 'utc erklärt']
related: ['how-time-zones-work', 'iso-8601-explained', 'time-zones-in-code']
---

Die Leute benutzen „UTC“ und „GMT“, als wäre es dasselbe. Meistens geht dabei nichts schief, weil beide meistens dieselbe Zeit anzeigen. Aber es sind Dinge verschiedener Art, und der Unterschied erklärt, warum das eine in Ihre Datenbank gehört und das andere nicht.

## UTC ist ein Standard, kein Ort

Die koordinierte Weltzeit wird vom Internationalen Büro für Maß und Gewicht aus einem gewichteten Mittel von rund 450 Atomuhren in etwa 85 Instituten weltweit gebildet. Diese Uhren messen die Resonanzfrequenz von Caesium-133-Atomen, die auf etwa eine Sekunde in 100 Millionen Jahren stabil ist.

Niemandes Ortszeit ist per Gesetz UTC. Selbst Großbritannien, das auf dem Nullmeridian liegt, steht sieben Monate im Jahr auf UTC+1. UTC ist der Fixpunkt, von dem aus jede Ortszeit beschrieben wird — die Null auf dem Lineal, keine Markierung auf der Karte.

Die wichtigste Eigenschaft für alle, die Software bauen: **UTC verschiebt sich nie für die Sommerzeit.** Es kennt keine jahreszeitliche Schwankung, keine politische Vorgeschichte und keine Ausnahmen. Genau darum arbeiten Luftfahrt, Schifffahrt, Wertpapierabwicklung und jedes verteilte System der Welt damit.

## GMT ist eine Zeitzone mit Berufsbiografie

Die Greenwich-Zeit ist die mittlere Sonnenzeit am Königlichen Observatorium in Greenwich. Sie ist über die Erdrotation definiert, und die ist kein Präzisionsinstrument: Der Planet eiert, wird ungleichmäßig langsamer und gelegentlich sogar schneller.

Von 1884 bis 1972 war GMT der Zeitstandard der Welt. Es wurde durch UTC ersetzt, gerade weil Atomuhren sich als bessere Referenz erwiesen als ein Planet. GMT lebt als Name einer Zeitzone weiter — jener, die Großbritannien im Winter nutzt, und jener, die mehrere westafrikanische Länder ganzjährig führen.

Also: **UTC kennt keine Sommerzeit. GMT im britischen Gebrauch schon** — Großbritannien verlässt es jeden März für die British Summer Time und kehrt jeden Oktober zurück. Sagt eine britische Kollegin im Juli „15 Uhr GMT“, meint sie mit ziemlicher Sicherheit 15 Uhr BST, also 14 Uhr UTC. Dieser Irrtum kommt oft genug vor, dass Nachfragen besser ist als Annehmen.

## Warum die Abkürzung UTC lautet

Weder das englische noch das französische Kürzel gewann. Englischsprachige schlugen CUT für „coordinated universal time“ vor, Französischsprachige TUC für „temps universel coordonné“. Die Internationale Fernmeldeunion einigte sich auf UTC, das zu keiner der beiden Sprachen passt und deshalb beide gleichermaßen kränkt. Auf seine Art ein vollkommenes diplomatisches Ergebnis.

## Schaltsekunden und ihre bevorstehende Abschaffung

Die Erde dreht sich nicht gleichmäßig. Damit UTC nicht von der Sonnenzeit wegdriftet, wurden gelegentlich zusätzliche Sekunden eingefügt: 27 zwischen 1972 und 2016. Während einer Schaltsekunde zeigt eine UTC-Uhr 23:59:60 — eine echte Zeit, die die meiste Software gar nicht darstellen kann.

Schaltsekunden haben echte Ausfälle verursacht. 2012 legte eine Schaltsekunde Reddit, Mozillas Dienste und mehrere Buchungssysteme von Fluggesellschaften lahm, alle über denselben Fehler im Linux-Kernel. 2017 brach Cloudflares DNS zusammen, weil eine Dauerberechnung über die Einfügung hinweg negativ wurde.

Im November 2022 beschloss die Generalkonferenz für Maß und Gewicht, das Einfügen von Schaltsekunden bis 2035 einzustellen. UTC darf dann von der Sonnenzeit abdriften, und man wird sich der Sache wieder annehmen, wenn der Abstand lästig wird — voraussichtlich in etwa einem Jahrhundert.

Ihr Browser gibt Schaltsekunden nicht heraus. Die Uhr von JavaScript tut so, als hätte es sie nie gegeben, weshalb eine Zeitspanne, die über eine hinweggeht, eine Sekunde zu kurz gemeldet wird. Für fast jeden Zweck ist das der richtige Handel; wer Satellitennavigation baut, wusste das ohnehin.

## Was man tatsächlich tun sollte

**Zeitstempel in UTC speichern.** Nicht in der Zone des Nutzers, nicht in der des Servers, nicht in der, in der das Unternehmen zufällig sitzt. Ein UTC-Zeitpunkt ist eindeutig, sortierbar und immun dagegen, dass eine Regierung ihre Meinung ändert.

**Erst beim Anzeigen in Ortszeit umrechnen**, mit der Zone der lesenden Person und der IANA-Kopie der Laufzeitumgebung.

**UTC schreiben, wenn UTC gemeint ist.** Wer „GMT“ in eine Spezifikation schreibt, lädt jemanden ein, es als britische Ortszeit zu lesen — und im Sommer liegt das eine Stunde daneben. „12:00 UTC“ hat an jedem Tag des Jahres genau eine Bedeutung.

**Das Z-Suffix aus ISO 8601 verwenden.** `2026-03-08T14:30:00Z` ist UTC und lässt sich nicht anders lesen. `2026-03-08T14:30:00` ist eine Ortszeit in einer nicht genannten Zone — und damit überhaupt kein Zeitstempel.

## Die Familie der Zeitskalen

UTC ist eine von mehreren verwandten Skalen, und die Unterschiede zählen gelegentlich.

**TAI** — Internationale Atomzeit. Die rohe Atomzeitskala, ohne Schaltsekunden. TAI läuft UTC derzeit um 37 Sekunden voraus, und der Abstand wächst mit jeder eingefügten Schaltsekunde. GPS-Satelliten arbeiten auf einer gegen TAI versetzten Skala.

**UT1** — die tatsächliche Erdrotation, gemessen gegen ferne Quasare. Ihr liefen UTCs Schaltsekunden hinterher. UTC wird innerhalb von 0,9 Sekunden zu UT1 gehalten — beziehungsweise wurde, bis zum Beschluss von 2035.

**GPS-Zeit** — begann im Januar 1980 gleichauf mit UTC und ignoriert seither Schaltsekunden. Sie liegt derzeit 18 Sekunden vor UTC. Empfänger rechnen das heraus; Systeme, die rohe GPS-Zeit lesen, manchmal nicht.

**Unix-Zeit** — die Zählung der Sekunden seit 1970, die so tut, als gäbe es Schaltsekunden nicht, indem sie eine Sekunde wiederholt statt sie zu zählen. Damit ist sie nicht ganz eine Zählung verstrichener Sekunden, und diese Feinheit hat schon Leute erwischt, die Dauern über eine Einfügung hinweg maßen.

Für fast jede Software ist UTC die richtige Antwort und der Rest Bildungsgut. Für alles mit Satelliten, Zeitstempeln im Hochfrequenzhandel oder wissenschaftlicher Messtechnik tragen die Unterschiede Last.

## Warum „UTC-Zeit“ doppelt gemoppelt ist — und wir es trotzdem schreiben

Das T steht für Zeit, „UTC-Zeit“ heißt also „koordinierte Weltzeit-Zeit“. Puristen stören sich daran.

Die Seiten hier schreiben „UTC-Zeit“ dennoch, in Überschriften und Titeln, weil Menschen genau danach suchen und genau das eintippen. Es gibt eine Art von Richtigkeit, die einen die Leserschaft kostet, und Pedanterie über ein Kürzel gehört mitten hinein. Im Fließtext, wo die Leserin schon da ist, heißt es einfach UTC.
