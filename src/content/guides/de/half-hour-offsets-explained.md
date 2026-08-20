---
title: 'Warum Indien eine halbe Stunde neben UTC läuft'
description: 'Halbstunden- und 45-Minuten-Abweichungen sind keine geografischen Zufälle, sondern Kompromisse, Unabhängigkeitserklärungen und ein Verwaltungsscherz.'
summary: 'Indien läuft auf UTC+05:30, weil es die Differenz zwischen zwei vorgeschlagenen Zonen geteilt hat. Nepal läuft auf UTC+05:45, auch um nicht Indien zu sein. Jede ungewöhnliche Abweichung hat eine Geschichte, und die meisten davon sind politisch.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 12
keywords:
  [
    'warum indien halbe stunde',
    'nepal 45 minuten',
    'halbstunden zeitzone',
    'geschichte der indischen standardzeit',
  ]
related: ['offsets-that-are-not-whole-hours', 'how-time-zones-work', 'the-international-date-line']
---

Die naheliegende Frage zur indischen Standardzeit lautet, warum sie von nichts eine ganze Anzahl Stunden entfernt ist. Die Antwort: Zeitzonen werden von Regierungen festgelegt, und Regierungen optimieren nicht auf die Bequemlichkeit Ihrer Datumsbibliothek hin.

## Indien: ein Land, zwei natürliche Zonen, ein Kompromiss

Indien erstreckt sich über etwa 29 Längengrade — von Gujarat im Westen bis Arunachal Pradesh im Osten. Das reicht für rund zwei Stunden Sonnenzeit. Nach der gewöhnlichen Logik der Zeitzonen müsste Indien zwei haben.

Unter britischer Herrschaft hatte es sie faktisch. Bombay-Zeit und Kalkutta-Zeit waren getrennt, rund 39 Minuten auseinander, und die Madras-Zeit lag als Eisenbahnstandard dazwischen. Als Indien nach der Unabhängigkeit 1947 vereinheitlichte, wählte es eine einzige Zone bei UTC+05:30 — 82,5° Ost, der Meridian nahe Mirzapur, fast genau zwischen den beiden alten Standards.

Begründet wurde das mit nationaler Einheit und Verwaltungseinfachheit, und der Preis dafür ist real. Im Sommer geht die Sonne in Arunachal Pradesh gegen 04:00 auf und gegen 16:00 unter, während die Büros nach den für Delhi gesetzten Zeiten arbeiten. Die Teewirtschaft in Assam führt seit über einem Jahrhundert eine inoffizielle „Bagan-Zeit“ eine Stunde voraus, genau weil die nationale Uhr nicht passt. Vorschläge für eine zweite indische Zone tauchen alle paar Jahre auf und werden jedes Mal mit derselben Begründung abgelehnt.

## Nepal: fünfundvierzig Minuten Souveränität

Nepal liegt bei UTC+05:45. Fünfzehn Minuten vor Indien, und die einzige Zone der Welt mit dieser Abweichung.

Die geografische Rechtfertigung ist der Gaurishankar, ein Berg östlich von Kathmandu, der als nationaler Referenzmeridian dient. Die politische Rechtfertigung ist, dass Nepal nicht Indien ist, und fünfzehn Minuten sind eine billige und dauerhafte Art, das zu sagen. Nepal wechselte 1986 von UTC+05:30 auf UTC+05:45.

Beide Geschichten stimmen, und Einheimische erzählen Ihnen je nach Fragestellung die eine oder die andere. Praktisch zählt, dass die Abweichung exakt und dauerhaft ist — Nepal kennt keine Sommerzeit — und dass sehr viel Software sie durch Runden auf +05:30 oder +06:00 falsch behandelt.

## Chathaminseln: 45 Minuten samt Sommerzeit

Die Chathaminseln, etwa 800 Kilometer östlich von Neuseeland, laufen im Winter auf UTC+12:45 und im Sommer auf UTC+13:45. Dort leben rund 600 Menschen.

Die Abweichung folgt ungefähr der Sonne: Die Inseln liegen weit genug östlich des neuseeländischen Festlands, um die zusätzlichen 45 Minuten zu rechtfertigen. Die Sommerzeit ist von Neuseeland geerbt, womit die Inseln einer von nur zwei Orten der Erde sind, die zugleich eine Viertelstundenabweichung und eine saisonale Umstellung haben.

## Lord-Howe-Insel: die 30-Minuten-Umstellung

Lord-Howe-Insel vor der Ostküste Australiens, Bevölkerung etwa 380, liegt im Winter bei UTC+10:30 und im Sommer bei UTC+11:00. Sie stellt um **dreißig Minuten** um, und sie ist der einzige Ort der Erde, der das tut.

Die Begründung war Mäßigung. Die Insel wollte ihre Sommerzeit an das Festland von Neusüdwales angleichen, fand eine volle Stunde für einen so kleinen Ort aber übertrieben und teilte 1981 die Differenz. Das Ergebnis ist der weltweit beste Testfall für Datumscode: jede Bibliothek, die eine 60-Minuten-Umstellung fest verdrahtet, ist auf der Lord-Howe-Insel falsch und überall sonst richtig — sie besteht also jeden Test, den Sie schreiben, außer eben diesem einen.

## Die, die verschwunden sind

**Niederlande: UTC+00:19:32,13.** Von 1909 bis 1937 liefen die Niederlande auf der mittleren Ortszeit Amsterdams, sekundengenau festgelegt. 1937 wurde sie auf +00:20 gerundet und 1940 zugunsten der MEZ aufgegeben. Die IANA-Datenbank führt sie weiterhin, weshalb die Abweichungen in der Rechenlogik dieser Website in Sekunden statt in Minuten berechnet werden — eine Laufzeitumgebung, die nach einem niederländischen Datum von 1920 gefragt wird, antwortet mit diesem Wert, und ihn wegzurunden wäre eine kleine Lüge.

**Liberia: UTC-00:44:30.** Bis 1972 lief Liberia 44 Minuten und 30 Sekunden hinter Greenwich und war damit das letzte Land der Erde mit einer Abweichung, die keine ganze Minute war.

**Singapur: fünf Wechsel.** Singapur lag bei +06:55:25, +07:00, +07:20, +07:30, +09:00 und heute +08:00. Es liegt westlich des Meridians, der +08:00 rechtfertigen würde, und bleibt dort, um mit Malaysia gleichzuziehen, das 1982 wechselte.

## Das Muster

Keine dieser Abweichungen hat mit der Sonne zu tun. Indien teilte eine politische Differenz. Nepal behauptete seine Eigenständigkeit. Singapur folgte einem Handelspartner. Lord Howe schloss einen Kompromiss mit sich selbst.

Das ist zugleich das Argument für die Entwurfsentscheidung hinter jeder Seite dieser Website: **berechnen Sie eine Abweichung nie aus der geografischen Länge, und speichern Sie nie eine in einer selbst gepflegten Tabelle**. Fragen Sie die IANA-Datenbank, die festhält, was jede Regierung tatsächlich beschlossen hat — einschließlich der Beschlüsse, die astronomisch keinen Sinn ergeben, denn in genau denen leben Ihre Nutzer.

## Nordkoreas Erklärung um dreißig Minuten

Im August 2015 stellte Nordkorea seine Uhren um 30 Minuten zurück, von UTC+09:00 auf UTC+08:30, und nannte das Ergebnis Pjöngjang-Zeit. Als Grund wurde angegeben, eine während der japanischen Besatzung auferlegte Änderung rückgängig zu machen, die Korea mit Tokio gleichgeschaltet hatte.

Praktisch führte das dazu, dass Nord- und Südkorea, die seit 1961 dieselbe Uhr geteilt hatten, nun 30 Minuten auseinanderlagen.

Im Mai 2018, nach dem innerkoreanischen Gipfel in Panmunjom, kehrte Nordkorea zu UTC+09:00 zurück. Die Ankündigung beschrieb dies als ersten praktischen Schritt zur Wiedervereinigung, und die Uhren im Friedenshaus hatten während der Gespräche beide Zeiten nebeneinander angezeigt.

Zwei tzdata-Ausgaben im Abstand von drei Jahren, für eine Änderung, die nichts mit der Sonne und alles mit Politik zu tun hatte. Das ist der Normalfall, nicht die Ausnahme.

## Venezuelas halbe Stunde und ihre Rücknahme

Im Dezember 2007 wechselte Venezuela von UTC-04:00 auf UTC-04:30, eine halbstündige Verschiebung, die die Regierung damit begründete, Kindern auf dem Schulweg mehr Tageslicht zu geben. Im Mai 2016 wechselte es zurück, diesmal als Energiesparmaßnahme während einer schweren Stromkrise dargestellt.

Neun Jahre auf einer ungewöhnlichen Abweichung, dann zurück. Jedes System, das Venezuelas Abweichung als Konstante kodiert hatte, musste zweimal geändert werden.

## Die Lehre für alle, die Zeit speichern

Das sind keine Randfälle in dem Sinne, dass sie selten wären. Zusammengenommen hat dieser Leitfaden Änderungen der Abweichung in Nepal, Samoa, Tokelau, Nordkorea, Venezuela, der Türkei, Russland, dem Iran, Mexiko, Brasilien und Ägypten beschrieben — allesamt zu Lebzeiten der Heutigen, die meisten in den letzten zwei Jahrzehnten.

Die IANA-Datenbank nimmt jede einzelne davon in einer Ausgabe auf. Eine fest verdrahtete Tabelle nimmt keine davon auf, versagt lautlos, und das Versagen sieht aus wie ein Planungsfehler eines Menschen statt wie ein Fehler in der Software.
