---
title: "Die UTC-Abweichungen, die keine ganzen Stunden sind"
description: "Indien, Nepal, Neufundland und die Chathaminseln laufen auf halben und viertel Stunden. Hier die vollständige Liste und was in Software daran zerbricht."
summary: "Rund ein Fünftel der Welt lebt auf einer Abweichung, die keine ganze Stundenzahl von UTC entfernt ist. Software, die das Gegenteil annimmt, liegt für diese Menschen nicht ein wenig daneben, sondern 30 oder 45 Minuten — was schlimmer ist."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 5
keywords: ['halbstunden zeitzonen', 'utc abweichung 45 minuten', 'indien zeitzone abweichung', 'nepal zeitzone']
related: ['half-hour-offsets-explained', 'time-zones-in-code', 'how-time-zones-work']
---

Die Vorstellung von vierundzwanzig Stundenzonen ist auf teure Weise falsch: sie erzeugt Code, der für weit über eine Milliarde Menschen selbstbewusst 30 oder 45 Minuten danebenliegt. Ein Fehler um eine ganze Stunde sieht wenigstens nach einem Fehler aus. Ein Fehler um 45 Minuten sieht nach einem Tippfehler aus und geht in Produktion.

## Die vollständige Liste

**Abweichungen auf :30**

| Abweichung | Wo                                                        |
| ---------- | --------------------------------------------------------- |
| UTC-09:30  | Marquesas-Inseln                                          |
| UTC-03:30  | Neufundland und Labrador                                  |
| UTC+03:30  | Iran                                                      |
| UTC+04:30  | Afghanistan                                               |
| UTC+05:30  | Indien, Sri Lanka                                         |
| UTC+06:30  | Myanmar, Kokosinseln                                      |
| UTC+09:30  | Zentralaustralien — Northern Territory, South Australia   |
| UTC+10:30  | Lord-Howe-Insel (Normalzeit)                              |

**Abweichungen auf :45**

| Abweichung | Wo                                                       |
| ---------- | -------------------------------------------------------- |
| UTC+05:45  | Nepal                                                    |
| UTC+08:45  | Südöstliches Westaustralien (Eucla, inoffiziell)         |
| UTC+12:45  | Chathaminseln (Normalzeit)                               |

Allein Indien sind 1,4 Milliarden Menschen. Zählen Sie Iran, Afghanistan, Myanmar, Sri Lanka und Nepal hinzu, und Sie sind über einem Fünftel des Planeten, noch bevor Australien oder Kanada dazukommen.

## Die andere Art ungewöhnlicher Abweichung

Nicht-ganzstündige Abweichungen sind die bekannte Merkwürdigkeit. Zwei weitere wiegen genauso schwer.

**Die Spanne beträgt 26 Stunden, nicht 24.** Kiritimati in Kiribati liegt bei UTC+14; die Bakerinsel und die Howlandinsel bei UTC-12. Das sind 26 Stunden, was bedeutet, dass es Augenblicke gibt, in denen irgendwo auf der Erde gleichzeitig drei verschiedene Kalenderdaten gelten. Jeder Code, der annimmt, ein Zwei-Tage-Fenster decke alle Zonen ab, liegt zweimal täglich falsch.

**Sommerzeit ist nicht immer eine Stunde.** Die Lord-Howe-Insel, eine kleine australische Insel mit einer festen Bevölkerung von etwa 380 Menschen, verschiebt sich um 30 Minuten: UTC+10:30 im Winter, UTC+11:00 im Sommer. Sie ist der einzige Ort der Erde, der das tut, und der beste Testfall für eine Datumsbibliothek — jede Umsetzung, die eine 60-Minuten-Verschiebung fest verdrahtet, ist dort falsch und sonst nirgends, besteht also jeden anderen Test, den Sie schreiben.

## Was zerbricht

**Runden auf die nächste Stunde.** Der häufigste Fehler. Code, der eine Abweichung als ganzzahlige Stundenzahl berechnet, schneidet Indien stillschweigend auf +5 ab, was für jeden Nutzer im Land 30 Minuten falsch ist.

**Abweichungen als Ganzzahlen speichern.** Eine Schemaspalte, die als Stundenzahl deklariert ist, kann Kathmandu nicht darstellen. Entdeckt wird das gewöhnlich, wenn die Daten schon drin sind.

**Rasteroberflächen auf Stundenspalten.** Jeder Kalender oder Planer, der einen Tag in 24 gleiche Zellen legt und annimmt, die Ortsstunde jeder Zone falle auf eine Zellgrenze, setzt Halbstunden- und 45-Minuten-Zonen falsch. Das Band im Besprechungsplaner dieser Website nutzt Zeitpunkte als Spalten statt Ortsstunden, sodass eine +05:45-Zeile 09:45 dort zeigt, wo eine UTC-Zeile 04:00 zeigt — was die Wahrheit ist statt einer aufgeräumteren Lüge.

**Dauerrechnung über eine 30-Minuten-Umstellung.** Anzunehmen, ein Sommerzeitwechsel betrage genau 3.600.000 Millisekunden, ergibt auf der Lord-Howe-Insel die falsche Antwort — und nur dort.

## Wie man es richtig macht

Die Behebung ist dieselbe, die fast jeden Zeitzonenfehler behebt: **berechnen Sie eine Abweichung niemals selbst.** Fragen Sie die Plattform.

Jede moderne Laufzeitumgebung liefert die IANA-Datenbank mit und nennt Ihnen die Abweichung einer Zone zu einem gegebenen Zeitpunkt korrekt in Minuten, auch für Kathmandu und Lord Howe. In JavaScript ist das `Intl.DateTimeFormat` mit `timeZoneName: 'longOffset'` oder ein Vergleich der Uhrzeitablesung der Zone gegen UTC — der Weg, den die Rechenlogik dieser Website geht, weil er sogar für die untersekundengenauen Ortszeitabweichungen in Daten vor 1900 exakt bleibt.

Halten Sie sich dann an drei Regeln:

1. **Abweichungen sind Minuten**, niemals Stunden. Heißt eine Variable `offsetHours`, ist sie bereits ein Fehler.
2. **Testen Sie gegen Kathmandu und Lord Howe.** Sie brechen die beiden Annahmen, die Ihnen alles andere durchgehen lässt.
3. **Runden Sie niemals eine Zeitzone.** Muss eine Anzeige ungefähr sein, sagen Sie es; verschieben Sie nicht stillschweigend die Uhr eines Nutzers um 30 Minuten, damit ein Layout leichter fällt.

## Ein durchgerechnetes Beispiel: was 45 Minuten mit einem Raster machen

Nehmen Sie einen Besprechungsplaner, der den Tag als 24 Spalten anlegt, eine je Stunde, und die Arbeitszeit jedes Teilnehmers schattiert. Die naive Umsetzung berechnet jede Zeile, indem sie die Grundzeile um die Abweichung der Zone in Stunden verschiebt.

Für London gegen New York geht das auf: die New-York-Zeile ist die London-Zeile, um fünf Zellen nach rechts geschoben. Für London gegen Kathmandu geht es nicht auf. Kathmandu ist 5 Stunden 45 Minuten voraus, also 5,75 Zellen, und ein Dreiviertel einer Zelle gibt es nicht. Die Umsetzung rundet — meist auf 6 — und nun ist jede Ablesung in dieser Zeile 15 Minuten zu früh.

Der Fehler ist klein genug, um eine Durchsicht zu überleben, und groß genug, um zu zählen: eine 09:00-Besprechung, die das Raster für Kathmandu als 09:00 ausweist, ist dort in Wahrheit 08:45, und wer beitritt, kommt fünfzehn Minuten zu spät zum eigenen Tag.

Die Behebung besteht darin, Spalten nicht mehr als Stunden zu behandeln. Machen Sie jede Spalte zu einem _Zeitpunkt_ und fragen Sie die Plattform, was die Ortsuhr in jeder Zone zu diesem Zeitpunkt anzeigt. Eine +05:45-Zeile zeigt dann 09:45, wo eine UTC-Zeile 04:00 zeigt — sichtbar nicht am Raster ausgerichtet, was die ehrliche Darstellung ist. Der Besprechungsplaner dieser Website tut genau das, und die ausgefranste Kante der Kathmandu-Zeile ist eine Eigenschaft, kein Mangel.

## Historische Abweichungen sind noch merkwürdiger

Vor der Vereinheitlichung waren Abweichungen mittlere Ortssonnenzeit und auf die Sekunde genau. Die IANA-Datenbank hält sie fest.

Die Niederlande liefen von 1909 bis 1937 auf UTC+00:19:32,13. Liberia lag bis 1972 bei UTC-00:44:30. Fragen Sie eine Laufzeitumgebung nach der Abweichung von `Europe/Amsterdam` an einem Datum aus 1920, und sie gibt Ihnen den exakten Wert samt Sekunden.

Deshalb rechnet die Abweichungsfunktion unter dieser Website in Sekunden und rundet erst in der Anzeigeschicht auf Minuten. Eine Rechenlogik, die Minuten speicherte, verlöre stillschweigend 32 Sekunden niederländischer Geschichte — was niemandem auffiele und trotzdem falsch wäre.
