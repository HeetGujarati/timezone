---
title: 'Perché EST è ambiguo e che cosa usare al suo posto'
description: 'IST significa tre cose diverse. CST quattro. Le sigle dei fusi non sono identificativi, e trattarle come tali produce difetti veri.'
summary: 'Le sigle dei fusi orari sono etichette informali, senza un ente che le governi e senza garanzia di unicità. IST è India, Irlanda e Israele; CST è America, Cina e Cuba. Usate invece gli identificativi IANA.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 10
keywords: ['est ambiguo', 'sigle fusi orari', 'significato ist', 'fuso cst']
related: ['how-time-zones-work', 'time-zones-in-code', 'what-utc-really-is']
---

Un invito di calendario dice «14:00 IST». A seconda di chi l’ha mandato, sono le 08:30 UTC, le 13:00 UTC o le 12:00 UTC. Nulla nella stringa dice quale, e tutte e tre le letture sono un uso corretto.

Le sigle dei fusi sono informali. Nessun ente di normazione le assegna, nessuno ne garantisce l’unicità e diverse sono attivamente contese. Vanno bene in una conversazione fra persone che condividono il contesto, e sono insicure ovunque altrove.

## Le collisioni che contano

**IST** — tre significati, tutti in uso:

| Significato          | Scarto    | Fuso                          |
| -------------------- | --------- | ----------------------------- |
| Indian Standard Time | UTC+05:30 | `Asia/Kolkata`                |
| Irish Standard Time  | UTC+01:00 | `Europe/Dublin` (solo estate) |
| Israel Standard Time | UTC+02:00 | `Asia/Jerusalem`              |

India e Irlanda distano quattro ore e mezza. Una riunione fissata nell’IST sbagliato non è un po’ in anticipo: sbaglia quasi un’intera giornata di lavoro.

**CST** — quattro significati:

| Significato                          | Scarto    | Fuso                 |
| ------------------------------------ | --------- | -------------------- |
| Central Standard Time (Nord America) | UTC-06:00 | `America/Chicago`    |
| China Standard Time                  | UTC+08:00 | `Asia/Shanghai`      |
| Cuba Standard Time                   | UTC-05:00 | `America/Havana`     |
| Central Standard Time (Australia)    | UTC+09:30 | `Australia/Adelaide` |

Chicago e Shanghai distano quattordici ore.

**PST** — Pacific Standard Time a UTC-08:00 e Philippine Standard Time a UTC+08:00. Esattamente sedici ore di distanza, il che significa che un errore finisce in un altro giorno di calendario.

**BST** — British Summer Time a UTC+01:00 e Bangladesh Standard Time a UTC+06:00.

**EST** — Eastern Standard Time in Nord America a UTC-05:00, e storicamente la sigla che l’Australia usava per i suoi stati orientali a UTC+10:00 prima che si affermasse AEST. Documenti australiani più vecchi usano ancora la forma nuda.

## L’altro problema: le sigle sono stagionali

Anche dove una sigla è unica, nomina solo metà anno.

`America/New_York` è EST da novembre a marzo ed EDT da marzo a novembre. Quindi «EST» a luglio non descrive alcun orologio esistente: in quel periodo il fuso è su EDT. La gente lo scrive lo stesso, intendendo «ora di New York», e un sistema che lo prende alla lettera sbaglia di un’ora per sette mesi.

Ecco perché «EST» è la sigla più maltrattata di internet: viene usata come nome di un luogo, mentre è il nome di una stagione in quel luogo.

## La maggior parte dei fusi non ha alcuna sigla

I fusi del mondo anglofono hanno per lo più sigle in lettere. La maggior parte dei fusi no.

Tokyo, Shanghai e San Paolo non hanno una sigla in lettere nei dati ICU che qualunque locale inglese utilizza: vengono riportati come «GMT+9», «GMT+8» e «GMT-3». Vedrete scritto «JST» per il Giappone, e si capisce, ma è convenzione e non dato.

Il che apre una tentazione ovvia a chiunque costruisca uno strumento per i fusi: riempire i vuoti. Inventare «JST» perché sembra plausibile, «BRT» per il Brasile, qualcosa per Kathmandu. Questo sito, di proposito, non lo fa. Dove nessuna locale porta lettere, mostra lo scarto: perché l’unica promessa che fa è che i dati vengano dal database IANA e non da una congettura, e una sigla inventata è esattamente quel tipo di falsità plausibile che rende inaffidabile un’opera di consultazione.

## Che cosa usare al suo posto

**Gli identificativi IANA.** `America/New_York`, `Asia/Kolkata`, `Europe/Dublin`. Sono unici, stabili, e nominano un luogo con la sua storia di regole invece di una stagione.

Sopravvivono anche ai cambi di regole. Quando la Turchia abolì l’ora legale nel 2016, `Europe/Istanbul` continuò a significare Turchia. Ogni pezzo di codice appeso a «EET» o «EEST» andò cambiato.

**Quando scrivete per esseri umani**, nominate la città e lo scarto: «14:00 a Mumbai (UTC+05:30)». Chi legge, ovunque sia, può agire senza sapere a quale IST vi riferivate.

**Negli inviti di calendario**, lasciate che sia il calendario ad allegare il fuso. Ogni calendario moderno salva un identificativo di fuso insieme all’evento e converte per ciascun invitato. Digitare una sigla nel titolo manda all’aria proprio quello.

**Nelle interfacce e nei dati**, usate ISO 8601 con uno scarto esplicito o `Z`, e portate l’identificativo separatamente quando dovete sapere _dove_ e non solo _quale scarto_.

## Quando vi tocca interpretarne una

Se avete ricevuto una sigla e non potete chiedere, usate il contesto:

- Chi l’ha mandata? Un’azienda indiana intende l’India, una irlandese l’Irlanda.
- Quale scarto renderebbe sensato l’orario proposto per loro? Nessuno fissa una chiamata alle 03:00.
- Compare una città nel messaggio? Una città risolve tutto.

E se la cosa conta — una chiamata con un cliente, una scadenza, una finestra di rilascio — chiedete. Dieci secondi di «è India o Irlanda?» costano meno dell’alternativa, e la persona a cui chiedete se lo è probabilmente domandato pure lei.

## Le sigle che sono sicure

Non tutte sono contese. Alcune sono uniche nella pratica e ragionevolmente sicure in un testo, anche se mai nel codice:

- **UTC** — un solo significato, per definizione
- **CEST** — Central European Summer Time, unica
- **AEDT** / **AEST** — Australian Eastern, non ambigua da quando è stato adottato il prefisso A
- **NZDT** / **NZST** — Nuova Zelanda
- **JST** — Giappone, per convenzione e non per dato; ICU non la porta per nessuna locale inglese

Notate lo schema: le sicure sono quelle con un prefisso di paese o continente. «Eastern Standard Time» era destinata a collidere, perché più di un continente ha un est.

## Che cosa dice il database IANA sulle sigle

Il database le sigle le registra, in un campo per ciascun periodo di fuso, ma le tratta come informali. La sua stessa documentazione osserva che non sono uniche, non sono standardizzate e in alcuni casi furono inventate da chi mantiene il database dove una sigla locale non esisteva.

Diverse sono state rimosse nel tempo perché erano invenzioni. Fusi che un tempo portavano codici di tre lettere inventati oggi riportano una forma numerica come `+0545`, proprio perché una sigla inventata è peggio di uno scarto onesto.

Quel giudizio editoriale — che un’invenzione plausibile valga meno dell’ammissione di un’assenza — è lo stesso che applica questo sito. Per questo la colonna delle sigle in una pagina su Tokyo riporta UTC+9 e non JST.
