---
title: "Accessibilità"
description: "Che cosa si prefigge questo sito, che cosa viene verificato in automatico e cosa fare se qualcosa non funziona per te."
order: 6
updatedAt: '2026-01-15'
---

Questo sito punta al **livello AA delle WCAG 2.2**. Le parti verificabili in automatico vengono verificate a ogni compilazione, e la compilazione fallisce se peggiorano.

## Che cosa impone la compilazione

- **Contrasto cromatico.** Ogni abbinamento di testo è verificato rispetto al rapporto 4,5:1 e ogni indicatore di focus rispetto a 3:1, sia nel tema chiaro sia in quello scuro. La tavolozza viene letta dal foglio di stile invece di essere duplicata nel test, così cambiare un colore fa scattare la verifica.
- **Semantica del markup.** Il linter applica regole di accessibilità a ogni componente: etichette mancanti, ARIA non valido ed elementi non interattivi con gestori fanno fallire la compilazione.
- **Nessuna fuoriuscita orizzontale**, nemmeno nella disposizione da destra a sinistra dell’arabo, verificata in un browser reale.

## Scelte di progetto

- **Il colore non è mai l’unico segnale.** L’orario di lavoro nel pianificatore ha un bordo oltre al riempimento; gli avvisi sull’ora legale sono parole, non solo una tinta ambrata.
- **I risultati si annunciano da soli.** Ogni area di risultato è `aria-live="polite"`, così una conversione viene letta ad alta voce quando cambia invece di dover essere cercata.
- **Ogni campo ha un’etichetta vera.** In nessun punto un segnaposto fa da etichetta.
- **Il movimento rispetta la tua preferenza.** Con `prefers-reduced-motion` attivo, animazioni e scorrimento fluido sono disattivati.
- **Funziona senza JavaScript.** Ogni scarto, ogni data di cambio, ogni tabella di riferimento e ogni spiegazione stanno nella pagina già generata. Solo gli orologi dal vivo e gli strumenti interattivi richiedono script, e i comandi che senza di essi non funzionerebbero vengono nascosti anziché mostrati inerti.
- **Le ore sono in carattere a spaziatura fissa con cifre tabulari**, perché le colonne si allineino e una cifra che scorre non sposti mai il testo accanto.

## Limiti noti

- La fascia di 24 ore del pianificatore è una tabella larga. Scorre orizzontalmente dentro il proprio contenitore invece di riorganizzarsi, perché una fascia riorganizzata smette di leggersi come forma. La stessa informazione è disponibile in forma di testo nel riepilogo che la precede.
- I test automatici colgono una minoranza dei problemi di accessibilità. Se qui qualcosa non funziona per te, è un difetto e vorremmo saperlo.

## Come segnalarcelo

Scrivi all’indirizzo che trovi nella [pagina dei contatti](/it/contact/), indicando la pagina e che cosa è andato storto. Le segnalazioni sulle tecnologie assistive sono particolarmente preziose, perché sono la cosa più difficile da verificare senza avere quella tecnologia davanti.
