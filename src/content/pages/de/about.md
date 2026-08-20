---
title: 'Über Meridiem'
description: 'Warum es diese Seite gibt, wie sie berechnet, was sie zeigt, und was sie bewusst unterlässt.'
order: 1
updatedAt: '2026-01-15'
---

Meridiem ist eine Sammlung von Zeitzonen-Werkzeugen, gebaut auf einem Grundsatz: nie eine Zeitangabe behaupten, die nicht im Moment des Bedarfs aus der IANA-Zeitzonendatenbank berechnet wurde.

## Warum es sie gibt

Die meisten Zeitzonen-Werkzeuge beruhen auf einer gespeicherten Tabelle von Versätzen. Diese Tabelle stimmt so lange, bis eine Regierung ihre Meinung ändert — was mehrmals im Jahr vorkommt — und danach ist sie still im Unrecht, auf eine Weise, die nach menschlichem Planungsfehler aussieht und nicht nach einem Softwarefehler.

Jeder Versatz, jedes Umstellungsdatum und jede Umrechnung auf dieser Seite stammt über die `Intl`-Schnittstelle aus der Kopie der IANA-Datenbank, die die Laufzeitumgebung mitbringt. In diesem Code gibt es keine Versatztabelle. Aktualisiert sich die Datenbank, übernimmt ein neuer Build die Änderung, und die Seite stimmt wieder — ohne eine einzige Codeänderung.

## Wie sie gebaut ist

- Jede Seite ist vorgerendert. Es gibt keinen Server, keine Datenbank und keine Programmierschnittstelle.
- Absolute aktuelle Zeiten entstehen in Ihrem Browser, nie in der Seite. Eine vorgerenderte Seite kann ehrlicherweise nicht behaupten zu wissen, wie spät es gerade ist, also versucht sie es gar nicht.
- Beständige Fakten — Versätze, Umstellungstermine, Überschneidungsfenster — werden beim Bauen berechnet und mit dem Stand dieses Builds angegeben.
- Die Seite wird monatlich neu gebaut, zusätzlich am 1. März, 1. April, 1. Oktober und 1. November, damit Aktualisierungen der Datenbank vor den Terminen ankommen, die sie betreffen.

## Was hier steht

Zehn Werkzeuge, 80 Städteseiten, 1.448 Umrechnungen zwischen Städtepaaren, 240 Abkürzungsumrechnungen und zwölf Ratgeber. Jede erzeugte Seite trägt Fakten, die für genau dieses Paar berechnet wurden: die Stundentabelle, die Umstellungstermine beider Städte und die Stunden, die beide Orte tatsächlich teilen.

## Was sie bewusst unterlässt

- **Keine Verfolgung.** Keine Analyse, keine Cookies, keine Skripte von Dritten.
- **Keine Konten.** Countdowns und Besprechungspläne stehen in der URL — einen Link zu teilen ist die ganze Funktion.
- **Keine erfundenen Daten.** Wo eine Zone in den IANA-Daten keine Abkürzung hat, steht der Versatz statt einer plausibel aussehenden Vermutung. Wo keine Bewertungen vorliegen, wird keine Bewertung behauptet.
- **Keine Netzwerkaufrufe zur Laufzeit.** Sonnenauf- und -untergang werden aus Breite und Länge mit dem NOAA-Sonnenstandsalgorithmus berechnet, nicht abgerufen.

## Korrekturen

Wenn hier etwas falsch ist, zählt das — der ganze Wert eines Nachschlagewerks besteht darin, dass es stimmt. Die Kontaktangaben stehen auf der [Kontaktseite](/de/contact/).
