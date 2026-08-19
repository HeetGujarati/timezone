---
title: "Barrierefreiheit"
description: "Was diese Seite anstrebt, was automatisch geprüft wird und was zu tun ist, wenn etwas für Sie nicht funktioniert."
order: 6
updatedAt: '2026-01-15'
---

Diese Seite strebt **WCAG 2.2 Stufe AA** an. Die Teile davon, die sich automatisch prüfen lassen, werden bei jedem Build geprüft, und der Build schlägt fehl, wenn sie sich verschlechtern.

## Was der Build erzwingt

- **Farbkontrast.** Jede Text-Kombination wird gegen das Verhältnis 4,5:1 geprüft, jede Fokusanzeige gegen 3:1, im hellen wie im dunklen Erscheinungsbild. Die Farbpalette wird aus dem Stylesheet gelesen statt im Test verdoppelt, sodass eine Farbänderung die Prüfung auslöst.
- **Semantik der Auszeichnung.** Der Linter wendet Barrierefreiheitsregeln auf jede Komponente an: fehlende Beschriftungen, ungültiges ARIA und nicht interaktive Elemente mit Ereignisbehandlung lassen den Build scheitern.
- **Kein waagerechtes Überlaufen**, auch nicht im arabischen Rechts-nach-links-Layout, geprüft in einem echten Browser.

## Gestaltungsentscheidungen

- **Farbe ist nie das einzige Signal.** Die Arbeitszeit im Besprechungsplaner trägt neben der Füllung eine Kante; Hinweise zur Sommerzeit sind Worte, nicht bloß ein gelblicher Ton.
- **Ergebnisse melden sich selbst.** Jeder Ergebnisbereich ist `aria-live="polite"`, sodass eine Umrechnung vorgelesen wird, wenn sie sich ändert, statt gesucht werden zu müssen.
- **Jedes Eingabefeld hat eine echte Beschriftung.** Nirgends dient ein Platzhalter als Beschriftung.
- **Bewegung achtet auf Ihre Einstellung.** Ist `prefers-reduced-motion` gesetzt, sind Animation und weiches Scrollen abgeschaltet.
- **Es funktioniert ohne JavaScript.** Jeder Versatz, jedes Umstellungsdatum, jede Referenztabelle und jede Erklärung steckt in der vorgerenderten Seite. Nur Live-Uhren und die interaktiven Werkzeuge brauchen Skripte, und Bedienelemente, die ohne sie nicht funktionieren würden, werden ausgeblendet statt tot angezeigt.
- **Zeiten stehen in Festbreitenschrift mit Tabellenziffern**, damit Spalten fluchten und eine tickende Ziffer den Text daneben nie verschiebt.

## Bekannte Einschränkungen

- Das 24-Stunden-Band im Besprechungsplaner ist eine breite Tabelle. Es scrollt waagerecht in seinem eigenen Behälter, statt umzubrechen, denn ein umgebrochenes Band hört auf, als Form lesbar zu sein. Dieselbe Information steht als Text in der Zusammenfassung darüber.
- Automatische Prüfungen erfassen nur einen kleinen Teil der Barrieren. Wenn hier etwas für Sie nicht funktioniert, ist das ein Fehler, und wir möchten davon erfahren.

## Uns benachrichtigen

Schreiben Sie an die Adresse auf der [Kontaktseite](/de/contact/), mit der Seite und dem, was schiefging. Berichte über assistive Technik sind besonders wertvoll, weil sie das am schwersten zu Prüfende sind, solange man die Technik nicht vor sich hat.
