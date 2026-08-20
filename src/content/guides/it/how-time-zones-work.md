---
title: 'Come funzionano davvero i fusi orari'
description: 'I fusi orari sono un manufatto politico steso su un problema geografico. Ecco il meccanismo e perché il software ci si perde.'
summary: 'Un fuso orario non è una fetta del globo: è un insieme di regole con un nome, su ciò che un orologio in un dato luogo ha segnato, segna e dovrà segnare. Quella distinzione è tutto l’argomento.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 1
keywords:
  [
    'come funzionano i fusi orari',
    'fusi orari spiegati',
    'che cos’è un fuso orario',
    'database iana fusi orari',
  ]
related: ['what-utc-really-is', 'why-est-is-ambiguous', 'time-zones-in-code']
---

Chiedete a chiunque che cosa sia un fuso orario e vi descriverà una striscia verticale su una mappa: il mondo diviso in ventiquattro fette uguali, distanti un’ora l’una dall’altra, governate dalla longitudine. Quel modello è ordinato, memorabile e sbagliato in un modo che prima o poi vi costerà una riunione.

Un fuso orario è un **insieme di regole con un nome**, tenuto da un governo, su che ora segnano gli orologi in un dato territorio. Le regole possono cambiare. Cambiano per ragioni politiche, per ragioni economiche e, ogni tanto, con quindici giorni di preavviso. La longitudine è dove l’idea è nata; non è dove è finita.

## Da dove è venuta l’idea

Prima degli anni ottanta dell’Ottocento ogni paese teneva la propria ora, fissata sul mezzogiorno locale — l’istante in cui il sole attraversa il meridiano sopra di voi. Bristol era dieci minuti indietro rispetto a Londra, e non importava a nessuno, perché nulla viaggiava abbastanza in fretta perché dieci minuti contassero.

Le ferrovie hanno cambiato le cose. Un orario che dice che un treno parte alle 10:15 non serve a niente se le 10:15 significano cose diverse ai due capi della linea, e già negli anni quaranta dell’Ottocento le compagnie ferroviarie britanniche avevano semplicemente imposto l’ora di Londra a tutta la rete. Gli Stati Uniti seguirono nel 1883, con le ferrovie che tagliarono il paese in quattro fusi di propria iniziativa. La Conferenza internazionale del meridiano del 1884 fece di Greenwich il meridiano di riferimento e diede al mondo un metro comune.

Il punto importante di quella storia è che i fusi orari furono inventati per risolvere un problema di coordinamento, dalle organizzazioni che quel problema ce l’avevano. Non sono mai stati una descrizione di dove si trova il sole.

## Che cosa contiene davvero un fuso

Il registro autorevole è il **database dei fusi orari IANA**, chiamato anche tzdata o database di Olson. È un file di testo, aggiornato più volte l’anno, e ogni sistema operativo, browser e linguaggio di programmazione che usate ne sta leggendo una versione.

Per ogni fuso registra:

- un identificativo, come `America/New_York` o `Asia/Kathmandu`
- lo scarto da UTC valido in ciascun periodo della storia di quel fuso
- le regole su quando quello scarto cambia, se cambia
- una sigla per ogni periodo, dove esiste

Gli identificativi seguono la convenzione `Area/Località`, e la località è una città rappresentativa anziché un paese, perché i paesi si dividono, si uniscono e cambiano le proprie regole a prescindere dai confini. `America/Argentina/Buenos_Aires` esiste perché le province argentine un tempo tenevano ore diverse fra loro.

Notate che cosa un fuso non è: non è uno scarto. `America/New_York` non è «UTC-5». È un fuso il cui scarto vale UTC-5 per una parte dell’anno e UTC-4 per il resto, che restò su UTC-5 tutto l’anno durante la Seconda guerra mondiale e che seguiva regole diverse prima del 1966. Salvare «UTC-5» e chiamarlo New York è di gran lunga il difetto di fusi orari più diffuso nel software.

## Le regole cambiano, e non gradualmente

Nel 2016 la Turchia ha abbandonato l’ora legale con circa tre settimane di preavviso ed è rimasta stabilmente su UTC+3. Nel 2018 la Corea del Nord ha spostato gli orologi di 30 minuti per riallinearsi con il Sud. Nel 2022 l’Iran ha abolito l’ora legale; lo stesso anno il Messico l’ha eliminata per quasi tutto il paese. L’Egitto l’ha reintrodotta nel 2023 dopo averla abolita nel 2014.

Ognuno di questi episodi è stato una pubblicazione di tzdata, e ognuno ha rotto tutti i sistemi con una tabella di scarti scritta a mano. È per questo che il motore dietro ogni pagina di questo sito legge gli scarti dalla copia di tzdata dell’ambiente di esecuzione invece che da qualcosa salvato qui. Una ricompilazione recepisce le regole nuove; non c’è nulla da modificare.

## Perché gli scarti non sono tutti di ore intere

Circa un quinto della popolazione mondiale vive con uno scarto che non è un numero intero di ore rispetto a UTC. L’India è a UTC+05:30, scelto come unico fuso di compromesso per un paese abbastanza largo da giustificarne due. Il Nepal è a UTC+05:45, e quei quarantacinque minuti servono anche ad affermare l’indipendenza dall’ora indiana. Le isole Chatham sono a UTC+12:45. Terranova a UTC-03:30.

Il software che dà per scontato che gli scarti siano di ore intere non si limita ad arrotondare: produce risposte sbagliate di 30 o 45 minuti per centinaia di milioni di persone, che è esattamente l’ordine di grandezza di errore che si scopre durante la chiamata e non prima.

## I due giorni all’anno in cui l’ora locale non è una funzione

L’ora legale crea due discontinuità annuali, e sono la ragione per cui «convertire questa ora locale» è più difficile di quanto sembri.

**Spostare avanti cancella un’ora.** A New York, nel giorno del cambio, alle 01:59:59 segue immediatamente le 03:00:00. L’ora locale 02:30 non si verifica. Se qualcuno la digita, non esiste alcun istante corretto da restituire: solo politiche su che cosa restituire al suo posto.

**Spostare indietro ripete un’ora.** L’01:30 si verifica due volte, una con l’ora legale e una, un’ora dopo, con l’ora solare. Un’ora locale da sola è davvero ambigua; bisogna sapere a quale delle due si riferiva, e quasi nessuna interfaccia lo chiede.

Ogni strumento di questo sito risolve entrambi i casi in modo esplicito e vi dice che cosa ha fatto. Sceglierne uno in silenzio è il modo in cui una voce di calendario finisce spostata di un’ora senza che nessuno se ne accorga fino alla chiamata.

## Che cosa significa in pratica

Dal meccanismo discendono tre regole, e coprono quasi tutto ciò che va storto:

1. **Salvate istanti, non ore locali.** Una marca temporale in UTC non è ambigua. Un’ora locale è una marca temporale più un fuso più una politica per i due giorni scomodi.
2. **Salvate l’identificativo del fuso, non lo scarto.** `Europe/London` sopravvive a un cambio di regole; `UTC+0` no, ed è comunque sbagliato per metà anno.
3. **Convertite al momento di mostrare, usando la tzdata dell’ambiente.** Non al momento di salvare, e mai da una tabella che mantenete voi.

Il motivo per cui questo sito continua a scrivere «all’ultima compilazione» a proposito degli scarti, e calcola le ore correnti nel vostro browser, è esattamente lo stesso. Quelle regole non sono nostre da congelare.
