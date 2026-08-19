---
title: "Wie Zeitzonen wirklich funktionieren"
description: "Zeitzonen sind ein politisches Gebilde über einem geografischen Problem. Hier steht der Mechanismus — und warum Software daran scheitert."
summary: "Eine Zeitzone ist kein Streifen auf dem Globus, sondern ein benannter Satz von Regeln darüber, was eine Uhr an einem bestimmten Ort angezeigt hat, anzeigt und anzeigen soll. Dieser Unterschied ist das ganze Thema."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 1
keywords:
  ['wie funktionieren zeitzonen', 'zeitzonen erklärt', 'was ist eine zeitzone', 'iana zeitzonendatenbank']
related: ['what-utc-really-is', 'why-est-is-ambiguous', 'time-zones-in-code']
---

Fragen Sie jemanden, was eine Zeitzone sei, und Sie bekommen einen senkrechten Streifen auf der Landkarte beschrieben: die Welt in vierundzwanzig gleich große Scheiben geteilt, je eine Stunde auseinander, bestimmt von der geografischen Länge. Dieses Bild ist ordentlich, einprägsam und auf eine Weise falsch, die Sie irgendwann einen Termin kostet.

Eine Zeitzone ist ein **benannter Satz von Regeln**, von einer Regierung gepflegt, darüber, was Uhren in einem bestimmten Gebiet anzeigen. Diese Regeln können sich ändern. Sie ändern sich aus politischen und wirtschaftlichen Gründen, gelegentlich mit vierzehn Tagen Vorlauf. Die geografische Länge ist der Ausgangspunkt der Idee; sie ist nicht ihr Ergebnis.

## Woher die Idee kam

Vor den 1880er Jahren hielt jede Stadt ihre eigene Zeit, gestellt nach dem örtlichen Mittag — dem Moment, in dem die Sonne den Meridian über einem überquert. Bristol lag zehn Minuten hinter London, und niemanden störte das, weil nichts schnell genug reiste, als dass zehn Minuten gezählt hätten.

Die Eisenbahn änderte das. Ein Fahrplan, der 10:15 Uhr Abfahrt nennt, taugt nichts, wenn 10:15 an beiden Enden der Strecke etwas anderes bedeutet, und schon in den 1840er Jahren hatten britische Bahngesellschaften ihrem ganzen Netz kurzerhand die Londoner Zeit verordnet. Die Vereinigten Staaten folgten 1883, als die Eisenbahngesellschaften das Land eigenmächtig in vier Zonen schnitten. Die Internationale Meridiankonferenz machte 1884 Greenwich zum Nullmeridian und gab der Welt einen gemeinsamen Bezugspunkt.

Das Entscheidende an dieser Geschichte: Zeitzonen wurden erfunden, um ein Abstimmungsproblem zu lösen, und zwar von denen, die das Problem hatten. Sie waren nie eine Beschreibung davon, wo die Sonne steht.

## Was eine Zone tatsächlich enthält

Die maßgebliche Quelle ist die **IANA-Zeitzonendatenbank**, auch tzdata oder Olson-Datenbank genannt. Sie ist eine Textdatei, wird mehrmals im Jahr aktualisiert, und jedes Betriebssystem, jeder Browser und jede Programmiersprache, die Sie benutzen, liest irgendeine Fassung davon.

Zu jeder Zone hält sie fest:

- eine Kennung wie `America/New_York` oder `Asia/Kathmandu`
- den Versatz zu UTC, der in jedem Abschnitt der Geschichte dieser Zone galt
- die Regeln dafür, wann sich dieser Versatz ändert, sofern er das tut
- eine Abkürzung für jeden Abschnitt, sofern es eine gibt

Die Kennungen folgen dem Schema `Gebiet/Ort`, und der Ort ist eine stellvertretende Stadt statt eines Landes — denn Länder teilen sich, vereinigen sich und ändern ihre Regeln unabhängig von ihren Grenzen. `America/Argentina/Buenos_Aires` existiert, weil Argentiniens Provinzen einst unterschiedliche Zeiten hielten.

Achten Sie darauf, was eine Zone nicht ist: Sie ist kein Versatz. `America/New_York` ist nicht „UTC-5“. Es ist eine Zone, deren Versatz einen Teil des Jahres UTC-5 und den Rest UTC-4 beträgt, die im Zweiten Weltkrieg ganzjährig auf UTC-5 lag und die vor 1966 nach anderen Regeln arbeitete. „UTC-5“ zu speichern und es New York zu nennen, ist der mit Abstand häufigste Zeitzonenfehler in Software.

## Die Regeln ändern sich, und zwar nicht allmählich

2016 gab die Türkei die Sommerzeit mit etwa drei Wochen Vorlauf auf und blieb dauerhaft auf UTC+3. 2018 verschob Nordkorea seine Uhren um 30 Minuten, um sich wieder mit dem Süden gleichzustellen. 2022 schaffte der Iran die Sommerzeit ab; im selben Jahr strich Mexiko sie für den größten Teil des Landes. Ägypten führte sie 2023 wieder ein, nachdem es sie 2014 abgeschafft hatte.

Jede dieser Änderungen war eine tzdata-Ausgabe, und jede brach jedes System mit fest eingebauter Versatztabelle. Deshalb liest die Maschinerie hinter jeder Seite dieses Angebots die Versätze aus der tzdata-Kopie der Laufzeitumgebung statt aus irgendetwas, das hier gespeichert wäre. Ein neuer Build übernimmt die neuen Regeln; nichts muss bearbeitet werden.

## Warum Versätze nicht alle volle Stunden sind

Etwa ein Fünftel der Weltbevölkerung lebt mit einem Versatz, der keine ganze Zahl von Stunden zu UTC ist. Indien liegt bei UTC+05:30, gewählt als ein einziger Kompromiss für ein Land, das breit genug für zwei Zonen wäre. Nepal liegt bei UTC+05:45, fünfundvierzig Minuten versetzt, auch um Unabhängigkeit von der indischen Zeit zu behaupten. Die Chathaminseln liegen bei UTC+12:45. Neufundland bei UTC-03:30.

Software, die volle Stunden voraussetzt, rundet nicht bloß — sie liefert für Hunderte Millionen Menschen Antworten, die 30 oder 45 Minuten danebenliegen. Und das ist genau die Größenordnung an Fehler, die im Gespräch auffällt und nicht davor.

## Die zwei Tage im Jahr, an denen Ortszeit keine Funktion ist

Die Sommerzeit erzeugt zwei jährliche Sprungstellen, und sie sind der Grund, warum „diese Ortszeit umrechnen“ schwieriger ist, als es aussieht.

**Das Vorstellen löscht eine Stunde.** In New York folgt am Umstellungstag auf 01:59:59 unmittelbar 03:00:00. Die Ortszeit 02:30 tritt nicht ein. Gibt ein Nutzer sie ein, existiert kein richtiger Zeitpunkt zum Zurückgeben — nur Regeln dafür, was man stattdessen zurückgibt.

**Das Zurückstellen wiederholt eine Stunde.** 01:30 tritt zweimal ein, einmal in der Sommerzeit und eine Stunde später in der Normalzeit. Eine Ortszeit allein ist wirklich doppeldeutig; man muss wissen, welches Auftreten gemeint war, und die meisten Oberflächen fragen nie danach.

Jedes Werkzeug hier löst beides ausdrücklich auf und sagt Ihnen, was es getan hat. Stillschweigend eines zu wählen ist der Weg, auf dem ein Kalendereintrag um eine Stunde danebenliegt, ohne dass es bis zum Gespräch jemand bemerkt.

## Was das in der Praxis heißt

Aus dem Mechanismus folgen drei Regeln, und sie decken das meiste ab, was schiefgeht:

1. **Zeitpunkte speichern, nicht Ortszeiten.** Ein UTC-Zeitstempel ist eindeutig. Eine Ortszeit ist ein Zeitstempel plus eine Zone plus eine Regel für die beiden heiklen Tage.
2. **Die Zonenkennung speichern, nicht den Versatz.** `Europe/London` übersteht eine Regeländerung; `UTC+0` nicht — und ist ohnehin ein halbes Jahr lang falsch.
3. **Beim Anzeigen umrechnen, mit der tzdata der Laufzeitumgebung.** Nicht beim Speichern, und niemals aus einer selbst gepflegten Tabelle.

Aus demselben Grund schreibt diese Seite bei Versätzen immer „zum Stand des letzten Builds“ und berechnet aktuelle Zeiten stattdessen in Ihrem Browser. Die Regeln stehen uns nicht zum Einfrieren zu.
