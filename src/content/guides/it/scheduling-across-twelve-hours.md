---
title: "Fissare riunioni con dodici ore di scarto"
description: "Quando due squadre non condividono alcuna ora lavorativa, la soluzione è strutturale e non un calendario più astuto. Ecco che cosa funziona davvero."
summary: "Uno scarto di dodici ore non ha una buona ora di riunione, e nessuna sfumatura di griglia lo cambia. Le squadre che se la cavano smettono di cercarla e cambiano invece il modo di lavorare."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 4
keywords: ['fissare riunioni fra fusi orari', 'squadra remota fusi orari', 'dodici ore di differenza', 'lavoro asincrono']
related: ['how-to-run-a-global-standup', 'why-daylight-saving-exists', 'how-time-zones-work']
---

San Francisco e Bengaluru distano dodici ore e mezzo. Una giornata dalle 09:00 alle 18:00 nell'una finisce prima che cominci nell'altra. Non esiste una disposizione astuta del calendario che produca un'ora lavorativa comune, perché non ce n'è nessuna da trovare.

La maggior parte delle squadre lo scopre provandoci lo stesso, accordandosi sulle 21:00 per una parte e poi covandoci rancore in silenzio per diciotto mesi. Quel che segue è ciò che fanno invece le squadre che se la cavano bene.

## Prima di tutto, siate onesti con l'aritmetica

Prima di trattare, calcolate i numeri veri, perché spesso sono peggiori di quanto si presume — e ogni tanto migliori.

La differenza non è fissa. New York e Sydney distano 16 ore nell'inverno boreale e 14 nell'estate boreale, perché entrambe adottano l'ora legale in stagioni opposte. Quell'oscillazione di due ore è la differenza fra «un'ora in comune» e «nessuna», e arriva senza che nessuno cambi nulla.

Due città che mantengono lo stesso scarto tutto l'anno — India e Giappone, poniamo — hanno una differenza che si può imparare a memoria. Due città in cui una sola adotta l'ora legale hanno una differenza che si sposta due volte l'anno. Due città che l'adottano entrambe ma in date diverse hanno una differenza sbagliata per circa quattro settimane l'anno.

## Le quattro opzioni oneste

Sono solo quattro, e ogni assetto praticabile ne è una combinazione.

**1. Una parte si sposta in modo permanente.** La giornata lavorativa di qualcuno slitta di due o tre ore. Funziona, è stabile, ed è equo solo se accompagnato da qualcosa in cambio: una giornata centrale più corta, un compenso o una scelta vera. Imporlo alla squadra più giovane è il modo in cui comincia il ricambio del personale.

**2. Alternare il disagio.** La chiamata scomoda ruota: questo mese è presto per Bengaluru, il prossimo tardi per San Francisco. Più equo in linea di principio, più difficile in pratica, perché richiede che qualcuno tenga il conto e lo faccia rispettare. Funziona al meglio con poche riunioni di alto valore.

**3. Sovrapporsi di proposito e in modo stretto.** Entrambe le parti si impegnano a essere disponibili per un'ora precisa, vicino a un'estremità della propria giornata, e nient'altro viene fissato attraverso lo scarto. Tutto ciò che accade in quell'ora sono decisioni; tutto il resto si scrive.

**4. Smettere di riunirsi.** Lo scarto diventa un pregio: il lavoro si consegna alla fine di ciascuna giornata e si riprende all'inizio dell'altra. È l'unica opzione che regge oltre due sedi, ed è quella che richiede il maggior cambiamento nel modo in cui la squadra lavora davvero.

## Che cosa richiede una buona consegna

L'opzione quattro è il punto in cui le squadre a dodici ore di distanza prosperano o si sfaldano, e la differenza sta quasi tutta nello scritto.

**Le decisioni si mettono per iscritto, con il loro ragionamento.** Non «abbiamo deciso di usare Postgres», ma «abbiamo scelto Postgres invece di DynamoDB perché gli schemi di interrogazione sono relazionali e il costo operativo di un secondo archivio dati supera il guadagno in velocità di scrittura». La seconda versione sopravvive a una consegna; la prima genera una riunione.

**Le domande si pongono con abbastanza contesto da poter essere risolte mentre dormite.** «Che ne pensi dello schema?» costa un giro completo di ventiquattr'ore. «Lo schema deve reggere X e Y; l'opzione A fa meglio X, la B fa meglio Y; propendo per A per via di Z — dimmi entro la tua mattina se non sei d'accordo» si risolve in un ciclo.

**Gli ostacoli si segnalano prima della consegna, non al momento della consegna.** Il peggior schema in una squadra asincrona è scoprire alle 09:00 che l'altra parte era bloccata ieri alle 17:00 e non ha detto nulla per undici ore.

**Lo stato è visibile senza chiedere.** Una lavagna, un canale, un documento — qualsiasi cosa risponda a «che cosa è successo mentre dormivo» senza richiedere che qualcuno sia sveglio.

## La trappola della riunione ricorrente

Se comunque fissate una chiamata ricorrente attraverso uno scarto ampio, sappiate che andrà alla deriva. Quando una parte cambia gli orologi e l'altra no, una riunione ancorata a un calendario si sposta di un'ora sull'altro. Due volte l'anno, per qualche settimana, atterra dove nessuno aveva acconsentito.

I programmi di calendario lo gestiscono correttamente quando l'evento è memorizzato con un fuso — che è un altro argomento per scegliere esplicitamente un fuso di ancoraggio, dirlo nell'invito e lasciare che il calendario di tutti gli altri faccia la conversione.

L'altra trappola è la riunione fissata quando la squadra stava in tre fusi e ancora attiva ora che ne occupa sei. Le riunioni a scarto ampio accumulano partecipanti per cui l'orario è molto peggiore che per il gruppo originario, e nessuno propone mai di spostarla, perché spostarla è la scomodità di qualcun altro.

## Quando davvero non c'è nulla

Los Angeles e Mumbai non condividono un solo minuto di una giornata dalle 09:00 alle 18:00, in nessuna stagione. Se la vostra squadra copre quello scarto e ha bisogno di decisioni sincrone, qualcuno sta lavorando fuori dalla propria giornata: l'unica domanda è chi, quanto spesso e se ha acconsentito.

Questo è un problema di direzione più che di calendario, e gli strumenti non possono risolverlo. Quel che gli strumenti possono fare è impedirvi di scoprirlo nell'invito.

## Una nota sull'equità

L'assetto che si afferma è di solito quello che fa comodo a chi ha più potere nell'organizzazione, e di solito si afferma senza che nessuno lo decida.

Fate attenzione allo schema in cui la squadra più nuova, più giovane o più lontana si prende sempre l'ora scomoda. Di rado è una decisione; è l'accumulo di piccole impostazioni implicite, ciascuna ragionevole per conto suo. Una volta stabilito, è invisibile a chi ne trae vantaggio e visibilissimo a tutti gli altri.

La contromisura pratica è mettere per iscritto chi sostiene il costo, riesaminarlo a scadenze fisse e trattarlo come una vera voce di bilancio anziché come buona volontà. Le date del cambio dell'ora legale sono un promemoria comodo per quel riesame, dato che i numeri si muovono comunque allora.
