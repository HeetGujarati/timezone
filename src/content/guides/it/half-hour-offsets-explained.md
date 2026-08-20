---
title: "Perché l'India sta mezz'ora fuori da UTC"
description: "Gli scarti di mezz'ora e di 45 minuti non sono incidenti geografici: sono compromessi, affermazioni di indipendenza e una burla burocratica."
summary: "L'India sta su UTC+05:30 perché ha diviso a metà la differenza fra due fusi proposti. Il Nepal sta su UTC+05:45 anche per non essere l'India. Ogni scarto insolito ha una storia, e quasi sempre è politica."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 12
keywords:
  [
    'perché india mezz ora',
    'nepal 45 minuti',
    'fuso orario di mezz ora',
    'storia dell ora standard indiana',
  ]
related: ['offsets-that-are-not-whole-hours', 'how-time-zones-work', 'the-international-date-line']
---

La domanda ovvia sull'ora standard indiana è perché non disti un numero intero di ore da nulla. La risposta è che i fusi orari li decidono i governi, e i governi non ottimizzano per la comodità della vostra libreria di date.

## India: un paese, due fusi naturali, un compromesso

L'India si estende per circa 29 gradi di longitudine, dal Gujarat a ovest all'Arunachal Pradesh a est. Bastano per quasi due ore di tempo solare. Secondo la logica ordinaria dei fusi orari, l'India dovrebbe averne due.

Sotto il dominio britannico di fatto li aveva. L'ora di Bombay e quella di Calcutta erano distinte, separate da circa 39 minuti, e quella di Madras stava nel mezzo come standard ferroviario. Quando l'India unificò dopo l'indipendenza del 1947, scelse un fuso unico a UTC+05:30 — 82,5° est, il meridiano che passa vicino a Mirzapur, quasi esattamente fra i due vecchi standard.

La motivazione fu l'unità nazionale e la semplicità amministrativa, e il prezzo è reale. D'estate in Arunachal Pradesh il sole sorge verso le 04:00 e tramonta verso le 16:00, mentre gli uffici seguono orari fissati per Delhi. L'industria del tè dell'Assam usa da oltre un secolo un'«ora del bagan» non ufficiale, avanti di un'ora, proprio perché l'orologio nazionale non le va bene. Proposte di un secondo fuso indiano riaffiorano ogni pochi anni e vengono respinte ogni volta con le stesse motivazioni.

## Nepal: quarantacinque minuti di sovranità

Il Nepal sta su UTC+05:45. Quindici minuti avanti all'India, ed è l'unico fuso al mondo con quello scarto.

La giustificazione geografica è il Gaurishankar, una montagna a est di Kathmandu usata come riferimento meridiano nazionale. La giustificazione politica è che il Nepal non è l'India, e quindici minuti sono un modo economico e permanente per dirlo. Il Nepal passò da UTC+05:30 a UTC+05:45 nel 1986.

Entrambe le storie sono vere, e i nepalesi vi racconteranno l'una o l'altra a seconda di come ponete la domanda. Ciò che conta nella pratica è che lo scarto è esatto e permanente — il Nepal non adotta l'ora legale — e che moltissimo software sbaglia arrotondandolo a +05:30 o a +06:00.

## Isole Chatham: 45 minuti e ora legale

Le isole Chatham, circa 800 chilometri a est della Nuova Zelanda, stanno su UTC+12:45 d'inverno e UTC+13:45 d'estate. Ci vivono circa 600 persone.

Lo scarto è all'incirca solare: le isole si trovano abbastanza a est della Nuova Zelanda continentale da giustificare quei 45 minuti in più. L'ora legale è ereditata dalla Nuova Zelanda, il che fa di queste isole uno dei due soli luoghi sulla Terra con insieme uno scarto al quarto d'ora e un cambio stagionale.

## Isola di Lord Howe: lo spostamento stagionale di 30 minuti

L'isola di Lord Howe, al largo dell'Australia orientale, con circa 380 abitanti, sta su UTC+10:30 d'inverno e UTC+11:00 d'estate. Si sposta di **trenta minuti**, ed è l'unico luogo sulla Terra a farlo.

La motivazione fu la misura. L'isola voleva un'ora legale allineata alla terraferma del Nuovo Galles del Sud, ma trovò un'ora intera eccessiva per un luogo così piccolo, e nel 1981 divise la differenza. Ne risulta il miglior banco di prova al mondo per il codice che tratta le date: qualunque libreria fissi uno spostamento stagionale di 60 minuti sbaglia sull'isola di Lord Howe e ha ragione ovunque altrove, il che significa che supererà ogni test scriviate, tranne quello.

## Quelli che non ci sono più

**Paesi Bassi: UTC+00:19:32,13.** Dal 1909 al 1937 i Paesi Bassi usarono il tempo medio locale di Amsterdam, specificato al secondo. Fu arrotondato a +00:20 nel 1937 e abbandonato per l'ora dell'Europa centrale nel 1940. La banca dati della IANA lo conserva ancora, ed è per questo che nel motore di questo sito gli scarti si calcolano in secondi anziché in minuti: un ambiente di esecuzione interrogato su una data olandese del 1920 risponderà con quel valore, e arrotondarlo via sarebbe una piccola bugia.

**Liberia: UTC-00:44:30.** Fino al 1972 la Liberia era 44 minuti e 30 secondi dietro Greenwich, l'ultimo paese della Terra con uno scarto che non era un numero intero di minuti.

**Singapore: cinque cambiamenti.** Singapore è stata a +06:55:25, +07:00, +07:20, +07:30, +09:00 e oggi +08:00. Si trova a ovest del meridiano che giustificherebbe +08:00, e ci resta per allinearsi alla Malaysia, che cambiò nel 1982.

## Lo schema

Nessuno di questi scarti riguarda il sole. L'India ha diviso una differenza politica. Il Nepal ha affermato la propria indipendenza. Singapore ha seguito un partner commerciale. Lord Howe ha trovato un compromesso con sé stessa.

Che è poi l'argomento a favore della scelta progettuale sotto ogni pagina di questo sito: **non calcolate mai uno scarto dalla longitudine, e non memorizzatene mai uno in una tabella che mantenete voi**. Interrogate la banca dati della IANA, che registra ciò che ogni governo ha davvero deciso, comprese le decisioni prive di senso astronomico — perché sono proprio quelle in cui vivono i vostri utenti.

## La dichiarazione di trenta minuti della Corea del Nord

Nell'agosto 2015 la Corea del Nord spostò indietro gli orologi di 30 minuti, da UTC+09:00 a UTC+08:30, e chiamò il risultato ora di Pyongyang. La ragione dichiarata era annullare un cambiamento imposto durante l'occupazione giapponese, che aveva allineato la Corea a Tokyo.

L'effetto pratico fu che Corea del Nord e Corea del Sud, che condividevano l'orologio dal 1961, si ritrovarono distanti 30 minuti.

Nel maggio 2018, dopo il vertice intercoreano di Panmunjom, la Corea del Nord tornò a UTC+09:00. L'annuncio lo descrisse come un primo passo pratico verso la riunificazione, e durante i colloqui gli orologi della Casa della Pace avevano mostrato entrambe le ore affiancate.

Due rilasci di tzdata a tre anni di distanza, per un cambiamento che non aveva nulla a che vedere con il sole e tutto con la politica. È il caso normale, non l'eccezione.

## La mezz'ora del Venezuela, e il suo ritorno

Nel dicembre 2007 il Venezuela passò da UTC-04:00 a UTC-04:30, uno spostamento di mezz'ora che il governo presentò come un modo per dare ai bambini più luce sulla via della scuola. Nel maggio 2016 tornò indietro, stavolta presentandolo come misura di risparmio energetico durante una grave crisi elettrica.

Nove anni su uno scarto insolito, poi indietro. Qualunque sistema avesse codificato lo scarto del Venezuela come costante dovette essere modificato due volte.

## La lezione per chiunque memorizzi tempo

Non sono casi limite nel senso di rari. Nel complesso, questa guida ha descritto cambiamenti di scarto in Nepal, Samoa, Tokelau, Corea del Nord, Venezuela, Turchia, Russia, Iran, Messico, Brasile ed Egitto — tutti a memoria d'uomo, la maggior parte negli ultimi vent'anni.

La banca dati della IANA assorbe ciascuno di essi in un rilascio. Una tabella fissata nel codice non ne assorbe nessuno, fallisce in silenzio, e il guasto sembra un errore di pianificazione di una persona anziché un difetto del programma.
