---
title: "Su Meridiem"
description: "Perché questo sito esiste, come calcola ciò che mostra e cosa sceglie deliberatamente di non fare."
order: 1
updatedAt: '2026-01-15'
---

Meridiem è un insieme di strumenti per i fusi orari costruito su un principio: non affermare mai un dato orario che non sia stato calcolato dal database IANA nel momento in cui serviva.

## Perché esiste

Quasi tutti gli strumenti per i fusi orari poggiano su una tabella di scarti memorizzata. Quella tabella è corretta finché un governo non cambia idea — cosa che accade più volte l’anno — e da lì in poi è sbagliata in silenzio, in un modo che sembra un errore umano di agenda e non un difetto del software.

Ogni scarto, ogni data di cambio e ogni conversione di questo sito derivano dalla copia del database IANA che l’ambiente di esecuzione porta con sé, attraverso l’interfaccia `Intl`. In questo codice non esiste alcuna tabella di scarti. Quando il database si aggiorna, una nuova compilazione lo recepisce e il sito torna corretto senza toccare una riga.

## Com’è costruito

- Ogni pagina è generata in anticipo. Non c’è server, non c’è database, non c’è interfaccia di programmazione.
- Le ore correnti assolute si calcolano nel tuo browser, mai nella pagina. Una pagina generata in anticipo non può onestamente sostenere di sapere che ora è adesso, quindi non ci prova.
- I fatti durevoli — scarti, date di cambio, finestre di sovrapposizione — sono calcolati in fase di compilazione e dichiarati come validi a quella data.
- Il sito viene ricostruito ogni mese, e inoltre il 1º marzo, il 1º aprile, il 1º ottobre e il 1º novembre, così che gli aggiornamenti arrivino prima delle date che riguardano.

## Cosa c’è qui

Dieci strumenti, 80 pagine di città, 1.448 conversioni fra coppie di città, 240 conversioni fra sigle e dodici guide. Ogni pagina generata porta dati calcolati per quella coppia specifica: la tabella oraria, le date dell’ora legale di entrambe le città e le ore che i due luoghi condividono davvero.

## Cosa sceglie di non fare

- **Nessun tracciamento.** Niente analisi, niente cookie, nessuno script di terze parti.
- **Nessun account.** I conti alla rovescia e i piani di riunione vivono nell’indirizzo: condividere un link è tutta la funzione.
- **Nessun dato inventato.** Dove una zona non ha una sigla nei dati IANA si mostra lo scarto, non un’ipotesi dall’aria plausibile. Dove non esistono recensioni, non si dichiara alcun voto.
- **Nessuna chiamata di rete a runtime.** Alba e tramonto sono calcolati da latitudine e longitudine con l’algoritmo solare della NOAA, non richiesti a qualcun altro.

## Correzioni

Se qui c’è qualcosa di sbagliato, conta: tutto il valore di un’opera di consultazione sta nel fatto che sia esatta. I recapiti sono nella [pagina dei contatti](/it/contact/).
