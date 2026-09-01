import type { PageCopy } from '../types.ts';

/**
 * Testi in italiano. L’inglese è il contratto: il controllo dei tipi fallisce se manca un campo.
 */
export const copy: PageCopy = {
  tools: {
    converter: {
      title: 'Convertitore di fusi orari',
      metaTitle: 'Convertitore di fusi orari, per ogni data',
      description:
        'Converti qualsiasi fuso orario in un altro, per qualsiasi data. Tiene conto dell’ora legale e degli scarti di mezz’ora e di 45 minuti.',
      summary:
        'Scegli due fusi e una data: la conversione è esatta, anche nei due giorni all’anno in cui il cambio dell’ora rende un orario locale impossibile oppure ambiguo.',
      faqs: [
        {
          question: 'Questo convertitore tiene conto dell’ora legale?',
          answer:
            'Sì, e anche dei due giorni scomodi. Gli scarti arrivano dal database IANA attraverso il browser, quindi una conversione nel giorno del cambio usa lo scarto che valeva davvero in quel momento, non quello di oggi. Se inserisci un orario locale che non è mai esistito, o uno che si è verificato due volte, il convertitore te lo dice invece di sceglierne uno in silenzio.',
        },
        {
          question: 'Perché la differenza oraria fra due città cambia durante l’anno?',
          answer:
            'Perché i due luoghi cambiano l’ora raramente nella stessa data, e alcuni non la cambiano affatto. New York è 5 ore indietro rispetto a Londra per quasi tutto l’anno, ma 4 per due settimane a marzo, perché gli Stati Uniti spostano le lancette due o tre settimane prima dell’Europa. Converti sempre rispetto a una data precisa, mai rispetto a uno scarto ricordato a memoria.',
        },
        {
          question: 'Fra quali fusi orari posso convertire?',
          answer:
            'Fra tutti quelli del database IANA — oltre 400 — compresi gli scarti di mezz’ora e di 45 minuti su cui quasi tutti i convertitori inciampano. L’India a UTC+05:30, il Nepal a UTC+05:45 e le isole Chatham a UTC+12:45 sono trattati con esattezza, senza arrotondare all’ora più vicina.',
        },
        {
          question: 'Serve JavaScript?',
          answer:
            'Per il convertitore dal vivo sì. Tutto il resto — scarti, date dei cambi d’ora, tabelle di riferimento ora per ora e ogni spiegazione — fa parte della pagina già generata e funziona anche con JavaScript disattivato.',
        },
        {
          question: 'Quello che scrivo qui viene inviato da qualche parte?',
          answer:
            'No. Ogni calcolo avviene nel tuo browser. Non c’è alcun backend, nessuna analisi, nessun cookie e nessuno script di terze parti. I fusi che scegli compaiono nell’indirizzo, così puoi condividere o salvare una conversione: è l’unico posto in cui finiscono.',
        },
      ],
      sections: [
        {
          heading: 'Perché le conversioni di fuso orario vanno storte',
          paragraphs: [
            'Quasi ogni errore di calendario nasce da una di quattro cause, e qui vengono trattate tutte e quattro invece di essere arrotondate via.',
            'Lo scarto non è una costante. «New York è cinque ore indietro rispetto a Londra» è vero per circa dieci mesi all’anno. Per tre settimane in primavera e una in autunno sono quattro ore, perché le due regioni cambiano l’ora in date diverse. Un convertitore che memorizza uno scarto fisso per città sbaglia proprio in quei giorni, e sono esattamente i giorni in cui si fissa la riunione di cui poi ci si pente.',
            'Non tutti gli scarti sono di ore intere. L’India è 5 ore e 30 minuti avanti rispetto a UTC. Il Nepal 5 ore e 45 minuti. Le isole Chatham 12 ore e 45 minuti, e l’isola di Lord Howe si sposta di soli 30 minuti quando entra nell’ora legale. Circa un quinto del mondo vive con uno scarto che non è un numero intero di ore.',
            'Alcuni orari locali non esistono. Quando le lancette vanno avanti, un’ora sparisce. A New York, nel giorno del cambio, dopo le 01:59:59 arrivano subito le 03:00:00: le 02:30 non esistono mai. Chiedi a quasi qualunque strumento di convertire le 02:30 e ti risponderà lo stesso, con sicurezza. Questo ti dice invece che cosa ha fatto.',
            'Alcuni orari locali si verificano due volte. Quando le lancette tornano indietro, un’ora si ripete. L’01:30 arriva una volta con l’ora legale e una seconda volta, un’ora dopo, con l’ora solare. Questo convertitore prende la prima, lo dichiara, e ti mostra la seconda.',
          ],
        },
      ],
    },

    meetingPlanner: {
      title: 'Pianificatore di riunioni',
      metaTitle: 'Pianificatore di riunioni fra fusi orari',
      description:
        'Aggiungi da due a dieci fusi orari e vedi una fascia di 24 ore con l’orario di lavoro ombreggiato. Trova le ore comuni, o scopri che non ce ne sono.',
      summary:
        'Aggiungi i fusi in cui lavora la tua squadra: la fascia qui sotto mostra l’intera giornata in un colpo solo, con l’orario di lavoro ombreggiato, così la sovrapposizione è una forma che si vede, non un conto da fare.',
      faqs: [
        {
          question: 'Quanti fusi orari posso aggiungere?',
          answer:
            'Da due a dieci. Oltre i dieci la fascia smette di leggersi a colpo d’occhio, che è l’unico motivo per usare una fascia invece di un elenco di numeri: il limite è una scelta di progetto, non un vincolo tecnico.',
        },
        {
          question: 'Che cosa conta come orario di lavoro?',
          answer:
            'Quello che imposti tu. Di base va dalle 09:00 alle 18:00 ora locale in ogni fuso, ed entrambi gli estremi sono regolabili. L’ora prima e quella dopo sono ombreggiate più chiare: raggiungibili, ma stai chiedendo un favore.',
        },
        {
          question: 'Perché alcune righe mostrano orari che finiscono per :30 o :45?',
          answer:
            'Perché quei fusi sono davvero sfasati di mezz’ora o di tre quarti d’ora. L’India è UTC+05:30, il Nepal UTC+05:45, le isole Chatham UTC+12:45. Ogni colonna della fascia è lo stesso istante, quindi quelle righe mostrano la lettura locale reale, non una arrotondata.',
        },
        {
          question: 'E se non c’è alcuna sovrapposizione?',
          answer:
            'Il pianificatore lo dice chiaramente, invece di proporre un compromesso che nessuno ha accettato. Los Angeles e Mumbai non condividono un solo minuto di una giornata 09:00–18:00, e nessuna ombreggiatura lo cambia: qualcuno deve spostarsi. Allargare la giornata o dividere la riunione in due sono le opzioni oneste.',
        },
        {
          question: 'Il piano sopravvive a un ricaricamento della pagina?',
          answer:
            'Sì. I fusi, la data e l’orario di lavoro finiscono nell’indirizzo, quindi puoi salvare un piano fra i preferiti o inviarlo a qualcuno: vedrà esattamente quello che vedi tu. L’elenco dei fusi resta anche nel tuo browser, così il pianificatore ricorda la squadra la volta dopo.',
        },
        {
          question: 'Tiene conto dell’ora legale?',
          answer:
            'Sì, alla data che scegli. Scegli una data di marzo o di ottobre e vedrai le righe scorrere una rispetto all’altra, perché è ciò che accade davvero: i fusi cambiano l’ora in giorni diversi.',
        },
      ],
      sections: [
        {
          heading: 'Come si legge la fascia',
          paragraphs: [
            'Ogni colonna è un istante. Leggendo una colonna dall’alto in basso vedi che ora segna l’orologio in ciascun luogo nello stesso momento: proprio quello che un elenco di scarti costringe a calcolare a mente, e proprio quello che si sbaglia.',
            'Tre tonalità: l’orario di lavoro porta un bordo superiore colorato, l’ora prima e quella dopo sono più chiare, il resto resta piatto. Il bordo conta quanto il riempimento: la distinzione non si regge mai sul solo colore, quindi resta leggibile anche se non riesci a separare quei due blu.',
          ],
        },
        {
          heading: 'Quando non c’è sovrapposizione',
          paragraphs: [
            'Alcune squadre non ne hanno proprio. Una giornata 09:00–18:00 a Los Angeles e la stessa a Mumbai non condividono nulla: la giornata di Mumbai finisce prima che Los Angeles si svegli. New York e Sydney sono ancora più curiose: condividono esattamente un’ora da novembre a marzo, quando il divario è di 16 ore, e assolutamente niente da aprile a ottobre, quando si restringe a 14. Le stesse due città, risposta opposta, e l’unica cosa cambiata è la data.',
            'Quando succede, il pianificatore lo dice invece di ombreggiare qualcosa e sperare. Le scelte realistiche sono allargare la giornata da un lato, alternare chi si prende la chiamata scomoda, o smettere di incontrarsi in diretta. Fingere che le 22:00 vadano bene è il modo in cui le persone si esauriscono in silenzio.',
          ],
        },
      ],
    },

    worldClock: {
      title: 'Orologio mondiale',
      metaTitle: 'Orologio mondiale: fuso orario New York, Tokyo, Australia e altre città',
      description:
        'Scopri che ore sono a Tokyo o l’ora esatta a Miami. Ora locale dal vivo in 80 grandi città, con fuso orario Italia e altri continenti.',
      summary:
        'Ora locale dal vivo in 80 città, dall’orologio più avanti del pianeta al più indietro: cerca per filtrare e fissa le città che consulti spesso, restano in cima.',
      faqs: [
        {
          question: 'Quanto sono precisi questi orologi?',
          answer:
            'Leggono l’orologio del tuo dispositivo e applicano lo scarto che il browser ricava dal database IANA, quindi sono precisi quanto la tua macchina. Se l’orologio del computer è sbagliato, ogni orologio qui è sbagliato della stessa quantità: nulla in questa pagina arriva da un server.',
        },
        {
          question: 'Posso tenere le mie città in cima?',
          answer:
            'Sì. Fissa una città e passa in testa alla griglia, e ci resta anche alla visita successiva. Le città fissate vivono solo nel tuo browser: nulla viene inviato altrove e nessun cookie viene impostato.',
        },
        {
          question: 'Perché alcune città mostrano una data diversa?',
          answer:
            'Perché è così. Quando a New York è lunedì sera, a Tokyo è già martedì mattina. La data sotto ciascun orologio è la data locale di quella città, non la tua.',
        },
        {
          question: 'Perché Mumbai e Kathmandu mostrano orari che finiscono per :30 e :45?',
          answer:
            'L’India viaggia a UTC+05:30 e il Nepal a UTC+05:45. Sono gli scarti reali, non errori di arrotondamento: circa un quinto del mondo vive con uno scarto che non è un numero intero di ore.',
        },
      ],
      sections: [],
    },

    timeDifference: {
      title: 'Differenza oraria',
      metaTitle: 'Differenza oraria tra Italia e Australia, Giappone e altri fusi',
      description:
        'Calcola la differenza oraria Italia Giappone o tra qualsiasi altro luogo. La differenza attuale fra due fusi orari e ogni data in cui cambia l’ora.',
      summary:
        'Scegli due luoghi e vedrai quanto distano adesso, più le date esatte del prossimo anno in cui quel divario cambia: è la parte che quasi tutti gli strumenti tralasciano.',
      faqs: [
        {
          question: 'Perché la differenza non è uguale tutto l’anno?',
          answer:
            'Perché i due luoghi cambiano l’ora in date diverse, oppure uno dei due non la cambia affatto. New York e Londra distano 5 ore per quasi tutto l’anno, 4 per le tre settimane di marzo dopo il cambio statunitense e prima di quello europeo, e di nuovo 4 per la settimana di fine ottobre dopo il ritorno all’ora solare in Europa e prima di quello negli Stati Uniti.',
        },
        {
          question: 'Fra quali luoghi la differenza non cambia mai?',
          answer:
            'Fra qualunque coppia in cui nessuno dei due osserva l’ora legale: India e Giappone, per esempio, distano stabilmente 3 ore e 30 minuti. Anche le coppie all’interno dello stesso blocco normativo sono stabili: tutti i fusi dell’Unione europea cambiano nello stesso istante, quindi Lisbona e Atene restano esattamente a 2 ore di distanza tutto l’anno.',
        },
        {
          question: 'Come viene calcolata la differenza?',
          answer:
            'Chiedendo al browser lo scarto di ciascun fuso nello stesso istante e sottraendo. Questo significa che è corretta nel momento in cui la guardi, anche nel mezzo di un cambio d’ora, invece di riportare un numero memorizzato che era giusto il mese scorso.',
        },
        {
          question: 'Che cosa vuol dire una differenza negativa?',
          answer:
            'Che il secondo luogo è indietro rispetto al primo. La pagina scrive «avanti» o «indietro» a parole proprio per questo: il segno meno sulle differenze orarie viene letto al contrario da circa metà delle persone.',
        },
      ],
      sections: [],
    },

    workingHoursOverlap: {
      title: 'Sovrapposizione degli orari di lavoro',
      metaTitle: 'Orari di lavoro comuni fra team distribuiti',
      description:
        'Trova le ore esatte che una squadra distribuita condivide, mostrate sull’orologio locale di ciascuno — o scopri onestamente che non ce ne sono.',
      summary:
        'Aggiungi i fusi in cui lavora la tua squadra e ottieni le finestre esatte in cui tutti sono disponibili, sull’orologio di ciascuno — e una risposta chiara quando non ce ne sono.',
      faqs: [
        {
          question: 'Che cosa conta come orario di lavoro?',
          answer:
            'Di base dalle 09:00 alle 18:00 ora locale per tutti, con entrambi gli estremi regolabili. Ogni fuso viene trattato allo stesso modo di proposito, invece di codificare assunzioni su quali paesi comincino presto: una squadra che lavora davvero dalle 10:00 alle 19:00 dovrebbe dirlo.',
        },
        {
          question: 'E se non c’è sovrapposizione?',
          answer:
            'Te lo diciamo, insieme alle finestre più vicine in cui il maggior numero di persone rientra nel proprio orario. Los Angeles e Mumbai non condividono un minuto di una giornata 09:00–18:00, e nessuna disposizione della griglia lo cambia. Le opzioni oneste sono allargare la giornata da un lato, alternare chi si prende la chiamata scomoda, o lavorare in modo asincrono.',
        },
        {
          question: 'In che cosa si differenzia dal pianificatore di riunioni?',
          answer:
            'Il pianificatore mostra l’intera giornata come una fascia, così ne cogli la forma. Questo strumento risponde con precisione alla domanda più stretta: quali minuti sono condivisi e come si leggono sull’orologio di ciascuno. Usa il pianificatore per esplorare, questo per decidere.',
        },
        {
          question: 'Tiene conto dell’ora legale?',
          answer:
            'Sì, per oggi. Le finestre di sovrapposizione si spostano di un’ora quando una parte ha già cambiato l’ora e l’altra no: per questo la stessa squadra ha quattro ore in comune a febbraio e tre a marzo.',
        },
      ],
      sections: [],
    },

    unixTimestamp: {
      title: 'Convertitore di timestamp Unix',
      metaTitle: 'Convertitore timestamp Unix in data',
      description:
        'Converti un timestamp Unix in una data leggibile e viceversa, in qualsiasi fuso. Riconosce secondi e millisecondi e mostra un contatore dal vivo.',
      summary:
        'Incolla un timestamp Unix per leggerlo come data, oppure scegli una data per ottenere il timestamp: il convertitore riconosce se il numero è in secondi o in millisecondi e ti dice quale ha assunto.',
      faqs: [
        {
          question: 'Secondi o millisecondi: come fa a saperlo?',
          answer:
            'Dalla grandezza. Un timestamp da 1e11 in su viene trattato come millisecondi, perché 1e11 secondi corrispondono all’anno 5138 e nulla di reale ci arriva. L’unità riconosciuta compare accanto al risultato invece di essere applicata in silenzio: sbagliarla è un errore di un fattore 1000 che ti fa atterrare nel 1970.',
        },
        {
          question: 'Che cos’è un timestamp Unix?',
          answer:
            'Il numero di secondi trascorsi dal 1º gennaio 1970 alle 00:00:00 UTC, senza contare i secondi intercalari. È un unico numero senza fuso orario, ed è esattamente per questo che i sistemi lo usano: due macchine in qualunque punto della Terra che leggono lo stesso timestamp concordano sullo stesso istante.',
        },
        {
          question: 'Un timestamp può essere negativo?',
          answer:
            'Sì. Tutto ciò che precede il 1970 è negativo. L’allunaggio dell’Apollo 11 vale circa -14.182.940. Questo convertitore gestisce i valori negativi in entrambe le direzioni.',
        },
        {
          question: 'Che cosa succede nel 2038?',
          answer:
            'I sistemi che conservano il conteggio in un intero a 32 bit con segno esauriscono lo spazio alle 03:14:07 UTC del 19 gennaio 2038. Il secondo successivo va in overflow su un numero negativo, che quei sistemi leggono come dicembre 1901. Quasi tutte le piattaforme moderne sono passate ai 64 bit anni fa; restano esposti i sistemi embedded e quelli legacy.',
        },
        {
          question: 'Il fuso orario influisce sul timestamp?',
          answer:
            'Sul timestamp no: è sempre contato a partire da un istante UTC. Il fuso decide soltanto come quell’istante viene mostrato come data e ora, e quale lettura locale riporta a quale numero.',
        },
      ],
      sections: [],
    },

    durationCalculator: {
      title: 'Calcolatore di durata',
      metaTitle: 'Calcolatore di durata fra fusi orari',
      description:
        'Calcola il tempo fra due date e ore, ciascuna nel proprio fuso. Gestisce l’ora legale: un giorno da 23 ore viene riportato come 23 ore.',
      summary:
        'Imposta un inizio e una fine — ciascuno nel proprio fuso, se differiscono — e ottieni il tempo davvero trascorso, compresi i giorni lunghi 23 o 25 ore.',
      faqs: [
        {
          question: 'Perché a volte un giorno risulta di 23 o 25 ore?',
          answer:
            'Perché lo era. Nel giorno in cui le lancette vanno avanti, da mezzanotte a mezzanotte passano 23 ore; nel giorno in cui tornano indietro ne passano 25. Questo calcolatore riduce entrambi gli estremi a istanti assoluti prima di sottrarre, quindi riporta il tempo davvero trascorso e non quello che suggerisce il calendario.',
        },
        {
          question: 'I due estremi possono stare in fusi diversi?',
          answer:
            'Sì, ed è proprio il punto. Un volo che parte da Tokyo alle 17:00 e atterra a San Francisco alle 09:30 della stessa mattina è durato nove ore e mezza, non meno sette e mezza. Imposta ciascun estremo nel proprio fuso e i conti tornano.',
        },
        {
          question: 'Sono inclusi i secondi intercalari?',
          answer:
            'No. I browser non li espongono: l’orologio di JavaScript ignora del tutto i secondi intercalari, quindi un intervallo che ne attraversa uno risulta più corto di un secondo. Su tutta la storia di UTC parliamo di 27 secondi in totale, il che conta per la navigazione satellitare e per nulla di ciò che misurerai qui.',
        },
        {
          question: 'E se la fine precede l’inizio?',
          answer:
            'Te lo diciamo, e riportiamo comunque il valore assoluto. Una durata negativa di solito è un errore di battitura, e capovolgere il segno in silenzio lo nasconderebbe.',
        },
      ],
      sections: [
        {
          heading: 'Perché l’aritmetica del calendario non è quella dell’orologio',
          paragraphs: [
            '«Un giorno dopo» e «24 ore dopo» sono istruzioni diverse, e due volte l’anno danno risposte diverse. Se un processo notturno è programmato per le 02:30 ora locale, in una mattina d’autunno gira due volte e in una mattina di primavera non gira affatto. Se invece è programmato ogni 86.400 secondi, si allontana di un’ora dalle 02:30.',
            'Nessuno dei due comportamenti è un difetto: rispondono a domande diverse. I guai cominciano quando il codice fa una cosa e la persona si aspettava l’altra. Questo calcolatore risponde sempre alla domanda dell’orologio — quanto tempo è passato davvero — e mostra accanto i giorni di calendario.',
          ],
        },
      ],
    },

    countdown: {
      title: 'Conto alla rovescia',
      metaTitle: 'Conto alla rovescia per data e fuso orario',
      description:
        'Conta alla rovescia verso qualsiasi momento in qualsiasi fuso e condividilo come link. Nessun account, nessun archivio: tutto vive nell’indirizzo.',
      summary:
        'Scegli un momento e un fuso, e il conto alla rovescia qui sotto ci corre incontro: vive tutto nell’indirizzo, quindi si condivide copiando la barra degli indirizzi.',
      faqs: [
        {
          question: 'Come condivido un conto alla rovescia?',
          answer:
            'Impostalo e copia la barra degli indirizzi: ogni campo è nell’indirizzo. Chi lo apre vede lo stesso conto alla rovescia verso lo stesso istante, scandito dall’orologio del proprio dispositivo. Non c’è account, non c’è alcun record salvato e non c’è nulla su un server, perché non c’è un server.',
        },
        {
          question: 'Chi lo riceve lo vede nel proprio fuso orario?',
          answer:
            'Vede lo stesso conto alla rovescia, perché un conto alla rovescia misura la distanza da un istante e quella distanza è uguale ovunque. La data e l’ora di arrivo sono mostrate nel fuso che hai scelto, così tutti capiscono a quale momento locale ci si riferisce.',
        },
        {
          question: 'Che cosa succede quando arriva a zero?',
          answer:
            'Dice che il momento è passato e si ferma. Non comincia a contare in avanti: se ti serve il tempo trascorso da un evento, il calcolatore di durata risponde a quella domanda come si deve.',
        },
        {
          question: 'Posso contare verso un orario che non esiste?',
          answer:
            'Se scegli un orario locale dentro un salto in avanti dell’ora legale, il conto alla rovescia si sposta all’istante equivalente dopo il cambio e te lo dice. È la stessa politica che segue ogni strumento di questo sito.',
        },
      ],
      sections: [
        {
          heading: 'Perché tutto il conto alla rovescia sta nel link',
          paragraphs: [
            'Quasi tutti gli strumenti per il conto alla rovescia chiedono di creare un account, così possono tenere il tuo conto sul loro server e mostrarti una pubblicità accanto. Qui non c’è un server, quindi lo stato deve stare dove il link può portarlo — e si rivela meglio per tutti. Nulla a cui iscriversi, nulla da cancellare dopo, nulla che smetta di funzionare quando un’azienda chiude.',
            'Vale la pena sapere una cosa: poiché il titolo viaggia nell’indirizzo, tratta un link ricevuto da uno sconosciuto come tratteresti qualsiasi altro link. Il titolo viene ripulito di tutto ciò che non è testo semplice e mostrato sempre come testo, mai come marcatura.',
          ],
        },
      ],
    },

    utcTime: {
      title: 'Ora UTC',
      metaTitle: 'Ora UTC adesso, tempo universale coordinato',
      description:
        'L’ora UTC corrente, che scorre dal vivo, più che cos’è davvero UTC, in cosa differisce da GMT e rispetto a cosa si misura ogni altro scarto.',
      summary:
        'UTC è l’orologio di riferimento rispetto a cui è definito ogni altro fuso orario: non si sposta mai per l’ora legale, e la lettura qui sotto è l’orologio del tuo dispositivo espresso in UTC.',
      faqs: [
        {
          question: 'Che cos’è UTC?',
          answer:
            'Il tempo universale coordinato è il riferimento rispetto a cui è definito ogni altro fuso orario. Non è un fuso in cui viva qualcuno: è la linea di base. Ogni scarto che vedi, da UTC-12 a UTC+14, è una distanza da questo orologio.',
        },
        {
          question: 'UTC è la stessa cosa di GMT?',
          answer:
            'Nell’uso quotidiano mostrano la stessa lettura, ma sono cose diverse. GMT è un fuso orario, definito dalla posizione del sole sul meridiano di Greenwich, e il Regno Unito lo abbandona ogni estate. UTC è uno standard di tempo, tenuto da circa 450 orologi atomici e mai spostato per l’ora legale. Se intendi «il riferimento», dì UTC.',
        },
        {
          question: 'Perché si abbrevia UTC e non CUT?',
          answer:
            'Perché non ha vinto né l’acronimo inglese né quello francese. Gli anglofoni volevano CUT per «coordinated universal time», i francofoni TUC per «temps universel coordonné», e l’Unione internazionale delle telecomunicazioni si è fermata su UTC: non corrisponde a nessuna delle due lingue e quindi offende entrambe allo stesso modo.',
        },
        {
          question: 'UTC osserva l’ora legale?',
          answer:
            'Mai. È tutto il suo senso. UTC non si sposta, ed è per questo che i server, l’aviazione, la navigazione e ogni sistema distribuito in cui due macchine devono concordare su quando è successo qualcosa lo usano al posto di un fuso locale.',
        },
        {
          question: 'E i secondi intercalari?',
          answer:
            'A UTC è stato inserito di tanto in tanto un secondo intercalare per restare entro 0,9 secondi dalla rotazione effettiva della Terra: 27 dal 1972, l’ultimo alla fine del 2016. Nel 2022 la Conferenza generale dei pesi e delle misure ha votato per smettere di aggiungerli entro il 2035. Il tuo browser non espone i secondi intercalari, quindi non lo fa nemmeno questa pagina.',
        },
      ],
      sections: [
        {
          heading: 'Perché tutto si misura da qui',
          paragraphs: [
            'Prima del 1884 ogni città teneva il proprio orologio, regolato sul proprio mezzogiorno. Ha funzionato finché non sono arrivate le ferrovie: a quel punto due città a sessanta chilometri di distanza che differivano di dodici minuti hanno smesso di essere una curiosità e sono diventate un rischio di collisione. La Conferenza internazionale del meridiano scelse Greenwich come meridiano di riferimento, e il sistema moderno degli scarti discende da lì.',
            'UTC ha sostituito il tempo medio di Greenwich come standard tecnico nel 1972. La differenza pesa più di quanto sembri: GMT è definito dalla Terra, che oscilla, mentre UTC è definito da atomi di cesio, che non lo fanno. I due vengono tenuti entro un secondo l’uno dall’altro a mano.',
            'Se stai salvando un timestamp in un database, registrando un evento o programmando qualcosa su cui due macchine devono concordare, salvalo in UTC e converti solo al momento di mostrarlo. Salvare l’ora locale è il modo in cui i sistemi finiscono con un’ora che capita due volte l’anno e un ticket di assistenza in tinta.',
          ],
        },
      ],
    },

    dstChanges: {
      title: 'Cambi dell’ora legale',
      metaTitle: 'Cambi dell’ora legale: quando cambia l’ora negli USA e nel mondo',
      description:
        'Scopri quando cambia l’ora negli USA o l’ora legale Giappone. Ogni cambio d’ora previsto quest’anno e il prossimo, con date esatte e scarti.',
      summary:
        'Ogni data qui sotto arriva dal database IANA, con il momento locale esatto in cui il cambio entra in vigore — e le città che non spostano mai le lancette sono elencate a parte.',
      faqs: [
        {
          question: 'Quali paesi hanno abolito l’ora legale?',
          answer:
            'La Russia nel 2014, la Turchia nel 2016, l’Iran nel 2022 e il Messico nel 2022 per quasi tutto il territorio; il Brasile nel 2019, dopo decenni di utilizzo. Giappone, India, Cina e quasi tutta l’Africa e il Sud-Est asiatico non l’hanno mai adottata. Circa un terzo del mondo la osserva; il resto segue con interesse la discussione semestrale.',
        },
        {
          question: 'L’Unione europea ha ancora in programma di abolirla?',
          answer:
            'Il Parlamento europeo ha votato nel 2019 per porre fine ai cambi stagionali, ma la direttiva si è arenata: gli Stati membri non sono riusciti ad accordarsi se restare in ora legale o in ora solare tutto l’anno, e un mosaico frammenterebbe i fusi del mercato unico. Finché la questione non si risolve, valgono le date di questa pagina.',
        },
        {
          question: 'Perché l’isola di Lord Howe si sposta di soli 30 minuti?',
          answer:
            'Perché ha deciso che un’ora era troppo. Lord Howe, al largo della costa orientale australiana, passa da UTC+10:30 a UTC+11:00: è l’unico cambio d’ora legale di mezz’ora al mondo. È anche il motivo per cui qualsiasi libreria che dia per scontato uno spostamento di un’ora sbaglia in silenzio per circa 380 persone.',
        },
        {
          question: 'A che ora cambiano davvero le lancette?',
          answer:
            'Dipende. Gli Stati Uniti cambiano alle 02:00 ora locale, l’Unione europea all’01:00 UTC — cioè tutti i fusi europei cambiano nello stesso istante ma a un’ora locale diversa. L’Australia cambia alle 02:00 locali, il Cile alle 24:00. La colonna dell’ora locale mostra l’ultima lettura prima di ciascun cambio.',
        },
        {
          question: 'Ogni quanto viene aggiornata questa pagina?',
          answer:
            'Viene ricostruita ogni mese, e inoltre il 1º marzo, il 1º aprile, il 1º ottobre e il 1º novembre, così qualsiasi modifica al database IANA viene recepita prima delle date che riguarda. I governi annunciano questi cambi con un preavviso che va da un anno a due settimane.',
        },
      ],
      sections: [],
    },
  },

  hubs: {
    convert: {
      title: 'Conversioni di fuso orario',
      metaTitle: 'Conversioni di fuso orario fra città',
      description:
        'Tutte le conversioni fra città e fra sigle di questo sito, ciascuna con tabella ora per ora, date dell’ora legale e le ore in cui puoi chiamare.',
      summary:
        'Ogni conversione porta con sé una tabella ora per ora, le date dell’ora legale di entrambe le città e le ore in cui una chiamata è davvero possibile.',
    },
    cities: {
      title: 'Ora attuale per città',
      metaTitle: 'Ora attuale per città: fuso orario Italia, Australia, New York',
      description:
        'Ora locale, fuso orario Tokyo, scarto da UTC e date dell’ora legale per 80 città. Cerca l’ora esatta a Tokyo o a Sydney.',
      summary:
        'Ogni pagina porta un orologio dal vivo, le date esatte dell’ora legale di quel fuso, alba e tramonto calcolati dalle coordinate della città e le conversioni verso i grandi snodi.',
    },
    guides: {
      title: 'Guide',
      metaTitle: 'Guide ai fusi orari, a UTC e all’ora legale',
      description:
        'Guide su come funzionano i fusi orari, che cos’è UTC, perché esiste l’ora legale e come gestire tutto questo nel codice senza sbagliare.',
      summary:
        'Come funzionano davvero i fusi orari: il meccanismo, la storia e i modi precisi in cui il software sbaglia. Scritte per essere lette una volta e ricordate, non per posizionarsi.',
    },
  },

  generated: {
    hourByHour: 'Ora per ora',
    daylightSaving: 'Ora legale',
    whenYouCanTalk: 'Quando potete davvero parlare',
    reference: 'Riferimento',
    zoneFacts: 'Dati sul fuso',
    sunriseSunset: 'Alba e tramonto',
    againstHubs: 'Rispetto ai grandi snodi',
    convertTo: 'Converti in',
    exampleNote:
      'Scarti e date sono calcolati in fase di build dal database IANA. Gli orari dal vivo sono generati nel tuo browser.',
    sunNote:
      'Calcolati dalla latitudine e dalla longitudine della città con l’algoritmo solare NOAA — nessuna API, nessuna chiamata di rete.',
    noDstNote:
      'Questa città non osserva l’ora legale. Il suo scarto da UTC è lo stesso in ogni giorno dell’anno.',
    ambiguousPanelHeading: 'Queste lettere significano più di una cosa',
    ambiguousPanelBody:
      'Se intendevi una delle altre, lo scarto qui sotto per te è sbagliato — ed è esattamente così che le riunioni finiscono all’ora sbagliata.',
    abbreviationTableNote:
      'Calcolato in una data in cui questa sigla è davvero in vigore: usare oggi sarebbe sbagliato per metà dell’anno.',
  },
};

export default copy;
