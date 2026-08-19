import type { PageCopy } from '../types.ts';
/**
 * Copia en español. El inglés es el contrato: la comprobación de tipos falla si falta un campo.
 */
export const copy: PageCopy = {
  tools: {
    converter: {
      title: 'Conversor de zonas horarias',
      metaTitle: 'Conversor de zonas horarias',
      description:
        'Convierte cualquier zona horaria a otra en cualquier fecha. Tiene en cuenta el horario de verano y los desfases de media hora y de 45 minutos.',
      summary:
        'Elige dos zonas y una fecha, y la conversión será exacta, incluso en los dos días del año en que el cambio de hora vuelve una hora local imposible o ambigua.',
      faqs: [
        {
          question: '¿Este conversor tiene en cuenta el horario de verano?',
          answer:
            'Sí, y también los dos días complicados. Los desfases proceden de la base de datos IANA a través del navegador, así que una conversión en la fecha del cambio usa el desfase que realmente regía en ese momento, no el de hoy. Si introduces una hora local que nunca existió, o una que ocurrió dos veces, el conversor lo dice en lugar de elegir una en silencio.',
        },
        {
          question: '¿Por qué cambia la diferencia horaria entre dos ciudades a lo largo del año?',
          answer:
            'Porque rara vez cambian la hora en la misma fecha, y algunas no la cambian nunca. Nueva York está 5 horas por detrás de Londres casi todo el año, pero 4 durante dos semanas de marzo, porque Estados Unidos adelanta sus relojes dos o tres semanas antes que Europa. Convierte siempre contra una fecha concreta, no contra un desfase recordado.',
        },
        {
          question: '¿Entre qué zonas horarias puedo convertir?',
          answer:
            'Entre todas las de la base de datos IANA: más de 400, incluidos los desfases de media hora y de 45 minutos con los que fallan casi todos los conversores. India en UTC+05:30, Nepal en UTC+05:45 y las islas Chatham en UTC+12:45 se calculan con exactitud, sin redondear a la hora más cercana.',
        },
        {
          question: '¿Necesito JavaScript?',
          answer:
            'Para el conversor en vivo, sí. Todo lo demás — desfases, fechas de cambio de hora, tablas de referencia hora por hora y todas las explicaciones — forma parte de la página ya generada y funciona con JavaScript desactivado.',
        },
        {
          question: '¿Se envía a algún sitio lo que escribo aquí?',
          answer:
            'No. Todos los cálculos ocurren en tu navegador. No hay servidor, ni analítica, ni cookies, ni scripts de terceros. Las zonas que eliges aparecen en la URL para que puedas compartir o guardar una conversión, y ese es el único lugar al que van.',
        },
      ],
      sections: [
        {
          heading: 'Por qué salen mal las conversiones de zona horaria',
          paragraphs: [
            'Casi todos los errores de programación de reuniones vienen de cuatro sitios, y aquí se tratan los cuatro en lugar de redondearlos.',
            'El desfase no es constante. «Nueva York está cinco horas por detrás de Londres» es cierto unos diez meses al año. Durante unas tres semanas cada primavera y una cada otoño son cuatro horas, porque las dos regiones cambian la hora en fechas distintas. Un conversor que guarda un desfase fijo por ciudad se equivoca justo esos días, y son precisamente los días en que se reserva la reunión de la que uno se arrepiente.',
            'No todos los desfases son horas enteras. India está 5 horas y 30 minutos por delante de UTC. Nepal, 5 horas y 45 minutos. Las islas Chatham, 12 horas y 45 minutos, y la isla de Lord Howe se mueve solo 30 minutos cuando empieza su horario de verano. Casi una quinta parte del mundo vive con un desfase que no es una hora entera.',
            'Algunas horas locales no existen. Cuando los relojes se adelantan, desaparece una hora. En Nueva York, el día del cambio, después de las 01:59:59 llegan directamente las 03:00:00: las 02:30 nunca ocurren. Pídele a casi cualquier herramienta que convierta las 02:30 y responderá igualmente, con toda seguridad. Esta te dice lo que hizo.',
            'Algunas horas locales ocurren dos veces. Cuando los relojes se atrasan, una hora se repite. La 01:30 llega una vez en horario de verano y otra, una hora después, en horario estándar. Este conversor toma la primera, lo indica, y te muestra la segunda.',
          ],
        },
      ],
    },
    meetingPlanner: {
      title: 'Planificador de reuniones',
      metaTitle: 'Planificador de reuniones entre zonas',
      description:
        'Añade entre dos y diez zonas y verás una franja de 24 horas con la jornada sombreada. Encuentra las horas comunes, o descubre que no hay ninguna.',
      summary:
        'Añade las zonas en las que trabaja tu equipo y la franja de abajo muestra el día entero de una vez, con la jornada laboral sombreada: la coincidencia es una forma que se ve, no una suma que se hace.',
      faqs: [
        {
          question: '¿Cuántas zonas horarias puedo añadir?',
          answer:
            'Entre dos y diez. Más de diez y la franja deja de leerse de un vistazo, que es justo la razón de usar una franja en lugar de una lista de números. El límite es una decisión de diseño, no técnica.',
        },
        {
          question: '¿Qué cuenta como jornada laboral?',
          answer:
            'Lo que tú decidas. Por defecto va de 09:00 a 18:00 hora local en cada zona, y ambos extremos son ajustables. La hora anterior y la posterior se sombrean más claras: son alcanzables, pero estás pidiendo un favor.',
        },
        {
          question: '¿Por qué algunas filas muestran horas terminadas en :30 o :45?',
          answer:
            'Porque esas zonas están realmente desfasadas media hora o tres cuartos. India es UTC+05:30, Nepal UTC+05:45, las islas Chatham UTC+12:45. Cada columna de la franja es el mismo instante, así que esas filas muestran la lectura local real, no una redondeada.',
        },
        {
          question: '¿Y si no hay ninguna coincidencia?',
          answer:
            'El planificador lo dice claramente en lugar de sugerir un término medio que nadie ha aceptado. Los Ángeles y Bombay no comparten ni un minuto de una jornada de 09:00 a 18:00, y ningún sombreado lo cambia: alguien tiene que moverse. Ampliar la jornada o partir la reunión en dos son las opciones honestas.',
        },
        {
          question: '¿El plan sobrevive a una recarga de la página?',
          answer:
            'Sí. Tus zonas, la fecha y el horario laboral se escriben en la URL, así que puedes guardar el plan o enviárselo a alguien y verá exactamente lo mismo que tú. La lista de zonas también se guarda en tu navegador para que el planificador recuerde a tu equipo.',
        },
        {
          question: '¿Tiene en cuenta el horario de verano?',
          answer:
            'Sí, en la fecha que elijas. Escoge una fecha de marzo o de octubre y verás filas desplazarse unas respecto a otras, porque eso es lo que ocurre de verdad: las zonas cambian la hora en días distintos.',
        },
      ],
      sections: [
        {
          heading: 'Cómo leer la franja',
          paragraphs: [
            'Cada columna es un instante. Al leer una columna de arriba abajo ves lo que marca el reloj en cada sitio en ese mismo momento, que es justo lo que una lista de desfases obliga a calcular mentalmente y lo que la gente se equivoca.',
            'Tres tonos: la jornada laboral lleva un borde superior de color, la hora anterior y posterior van más claras, y el resto queda plano. El borde importa tanto como el relleno: la distinción nunca depende solo del color, así que se sigue leyendo aunque no distingas esos dos azules.',
          ],
        },
        {
          heading: 'Cuando no hay ninguna coincidencia',
          paragraphs: [
            'Algunos equipos no tienen ninguna. Una jornada de 09:00 a 18:00 en Los Ángeles y la misma en Bombay no comparten nada: la jornada de Bombay termina antes de que Los Ángeles se despierte. Nueva York y Sídney son aún más curiosos: comparten exactamente una hora de noviembre a marzo, cuando la diferencia es de 16 horas, y absolutamente nada de abril a octubre, cuando se reduce a 14. Las mismas dos ciudades, respuesta opuesta, y lo único que ha cambiado es la fecha.',
            'Cuando eso pasa, el planificador lo dice en vez de sombrear algo y confiar en la suerte. Las opciones realistas son ampliar la jornada de un lado, alternar quién se lleva la llamada incómoda, o dejar de reunirse en directo. Fingir que las 22:00 está bien es como la gente se quema en silencio.',
          ],
        },
      ],
    },
    worldClock: {
      title: 'Reloj mundial',
      metaTitle: 'Reloj mundial: hora en 80 ciudades',
      description:
        'Hora local en vivo en 80 ciudades importantes, ordenadas de este a oeste. Busca cualquier ciudad, fija las que te interesan y observa cómo cambia la fecha.',
      summary:
        'Hora local en vivo en 80 ciudades, del reloj más adelantado del planeta al más atrasado. Busca para filtrar y fija las ciudades que consultas a menudo: se quedan arriba.',
      faqs: [
        {
          question: '¿Qué precisión tienen estos relojes?',
          answer:
            'Leen el reloj de tu dispositivo y le aplican el desfase que tu navegador obtiene de la base de datos IANA, así que son tan precisos como tu propia máquina. Si el reloj de tu ordenador va mal, todos los de esta página van mal en la misma medida: aquí nada viene de un servidor.',
        },
        {
          question: '¿Puedo mantener mis ciudades arriba?',
          answer:
            'Sí. Fija cualquier ciudad y pasará al principio de la cuadrícula y seguirá ahí en tu próxima visita. Las ciudades fijadas viven solo en tu navegador; no se envía nada a ningún sitio ni se instala ninguna cookie.',
        },
        {
          question: '¿Por qué algunas ciudades muestran otra fecha?',
          answer:
            'Porque la tienen. Cuando en Nueva York es lunes por la tarde, en Tokio ya es martes por la mañana. La fecha bajo cada reloj es la fecha local de esa ciudad, no la tuya.',
        },
        {
          question: '¿Por qué Bombay y Katmandú muestran horas terminadas en :30 y :45?',
          answer:
            'India funciona con UTC+05:30 y Nepal con UTC+05:45. Son los desfases reales, no errores de redondeo: alrededor de una quinta parte del mundo vive con un desfase que no es una hora entera.',
        },
      ],
      sections: [],
    },
    timeDifference: {
      title: 'Diferencia horaria',
      metaTitle: 'Diferencia horaria entre dos zonas',
      description:
        'Consulta la diferencia actual entre dos lugares y todas las fechas del próximo año en que esa diferencia cambia porque uno de ellos mueve sus relojes.',
      summary:
        'Elige dos lugares y verás a qué distancia están ahora mismo, más las fechas exactas del próximo año en que esa distancia cambia, que es la parte que casi todas las herramientas omiten.',
      faqs: [
        {
          question: '¿Por qué la diferencia no es la misma todo el año?',
          answer:
            'Porque los dos lugares cambian la hora en fechas distintas, o uno de ellos no la cambia. Nueva York y Londres están a 5 horas casi todo el año, a 4 durante las tres semanas de marzo posteriores al cambio estadounidense y anteriores al europeo, y a 4 de nuevo durante la semana de finales de octubre posterior al cambio europeo y anterior al estadounidense.',
        },
        {
          question: '¿Qué lugares mantienen siempre la misma diferencia?',
          answer:
            'Cualquier par en el que ninguno aplique horario de verano: India y Japón, por ejemplo, están permanentemente a 3 horas y 30 minutos. Los pares dentro del mismo bloque regulador también son estables: todas las zonas de la Unión Europea cambian en el mismo instante, así que Lisboa y Atenas mantienen exactamente 2 horas todo el año.',
        },
        {
          question: '¿Cómo se calcula la diferencia?',
          answer:
            'Pidiéndole al navegador el desfase de cada zona en el mismo instante y restando. Eso significa que es correcta en el momento en que la miras, incluso en mitad de un cambio de hora, en lugar de leer un número guardado que era cierto el mes pasado.',
        },
        {
          question: '¿Qué significa una diferencia negativa?',
          answer:
            'Que el segundo lugar va por detrás del primero. La página dice «por delante» o «por detrás» con palabras precisamente por eso: los signos negativos en las diferencias horarias los lee al revés cerca de la mitad de la gente.',
        },
      ],
      sections: [],
    },
    workingHoursOverlap: {
      title: 'Coincidencia de jornadas laborales',
      metaTitle: 'Coincidencia de jornadas en equipos',
      description:
        'Encuentra las horas exactas que comparte un equipo distribuido, expresadas en el reloj de cada persona, o descubre con honestidad que no hay ninguna.',
      summary:
        'Añade las zonas en las que trabaja tu equipo y obtendrás las franjas exactas en las que todos están disponibles, en el reloj de cada uno, y un aviso claro cuando no hay ninguna.',
      faqs: [
        {
          question: '¿Qué cuenta como jornada laboral?',
          answer:
            'Por defecto, de 09:00 a 18:00 hora local para todos, y ambos extremos son ajustables. Trata a propósito todas las zonas por igual en lugar de dar por hecho qué países empiezan temprano: un equipo que trabaja de 10:00 a 19:00 debería decirlo.',
        },
        {
          question: '¿Y si no hay coincidencia?',
          answer:
            'Se te avisa, y además se muestran las franjas más próximas en las que hay más gente dentro de su jornada. Los Ángeles y Bombay no comparten ni un minuto de una jornada de 09:00 a 18:00; ninguna disposición de la cuadrícula lo cambia. Las opciones honestas son ampliar la jornada de un lado, alternar quién asume la llamada incómoda, o trabajar de forma asíncrona.',
        },
        {
          question: '¿En qué se diferencia del planificador de reuniones?',
          answer:
            'El planificador muestra el día entero como una franja para que veas su forma. Esta herramienta responde a la pregunta concreta: qué minutos se comparten y qué marcan esos minutos en el reloj de cada uno. Usa el planificador para explorar y esta para decidir.',
        },
        {
          question: '¿Tiene en cuenta el horario de verano?',
          answer:
            'Sí, para hoy. Las franjas se desplazan una hora cuando un lado cambia sus relojes y el otro todavía no, que es la razón por la que el mismo equipo puede tener cuatro horas comunes en febrero y tres en marzo.',
        },
      ],
      sections: [],
    },
    unixTimestamp: {
      title: 'Conversor de marcas de tiempo Unix',
      metaTitle: 'Conversor de marcas de tiempo Unix',
      description:
        'Convierte una marca de tiempo Unix a fecha y al revés, en cualquier zona horaria. Detecta si está en segundos o milisegundos y muestra un contador en vivo.',
      summary:
        'Pega una marca de tiempo Unix para leerla como fecha, o elige una fecha para obtener la marca: el conversor detecta si tu número está en segundos o milisegundos y te dice cuál ha supuesto.',
      faqs: [
        {
          question: '¿Segundos o milisegundos? ¿Cómo lo sabe?',
          answer:
            'Por el tamaño. Una marca de 1e11 o más se trata como milisegundos, porque 1e11 segundos es el año 5138 y nada real llega ahí. La unidad detectada se muestra junto al resultado en lugar de aplicarse en silencio, porque equivocarse es un error de factor 1000 que te deja en 1970.',
        },
        {
          question: '¿Qué es una marca de tiempo Unix?',
          answer:
            'El número de segundos transcurridos desde el 1 de enero de 1970 a las 00:00:00 UTC, sin contar los segundos intercalares. Es un único número sin zona horaria asociada, y por eso lo usan los sistemas: dos máquinas en cualquier punto del planeta que lean la misma marca coinciden en el mismo instante.',
        },
        {
          question: '¿Puede ser negativa una marca de tiempo?',
          answer:
            'Sí. Todo lo anterior a 1970 es negativo. El alunizaje del Apolo 11 está en torno a -14 182 940. Este conversor admite valores negativos en ambos sentidos.',
        },
        {
          question: '¿Qué pasa en 2038?',
          answer:
            'Los sistemas que guardan la cuenta en un entero de 32 bits con signo se quedan sin espacio a las 03:14:07 UTC del 19 de enero de 2038. El segundo siguiente desborda a un número negativo, que esos sistemas leen como diciembre de 1901. Las plataformas modernas pasaron a 64 bits hace años; los sistemas embebidos y heredados son los que siguen expuestos.',
        },
        {
          question: '¿La zona horaria afecta a la marca de tiempo?',
          answer:
            'A la marca en sí, no: siempre se cuenta desde un instante UTC. La zona solo decide cómo se muestra ese instante como fecha y hora, y qué lectura local se convierte en qué número.',
        },
      ],
      sections: [],
    },
    durationCalculator: {
      title: 'Calculadora de duración',
      metaTitle: 'Calculadora de duración entre zonas',
      description:
        'Calcula el tiempo entre dos fechas y horas, cada una en su propia zona. Trata bien el cambio de hora, así que un día de 23 horas se informa como 23 horas.',
      summary:
        'Fija un inicio y un final —cada uno en su zona horaria si difieren— y obtendrás el tiempo que realmente transcurrió, incluidos los días que duran 23 o 25 horas.',
      faqs: [
        {
          question: '¿Por qué a veces un día sale de 23 o 25 horas?',
          answer:
            'Porque lo fue. El día en que los relojes se adelantan, de medianoche a medianoche hay 23 horas; el día en que se atrasan, 25. Esta calculadora resuelve ambos extremos a instantes absolutos antes de restar, así que informa del tiempo que pasó de verdad y no del que sugiere el calendario.',
        },
        {
          question: '¿Los dos extremos pueden estar en zonas distintas?',
          answer:
            'Sí, y esa es la idea. Un vuelo que sale de Tokio a las 17:00 y aterriza en San Francisco a las 09:30 de esa misma mañana duró nueve horas y media, no menos siete y media. Pon cada extremo en su zona y la aritmética cuadra.',
        },
        {
          question: '¿Se incluyen los segundos intercalares?',
          answer:
            'No. Los navegadores no los exponen: el reloj de JavaScript los ignora por completo, así que un intervalo que atraviese uno se informa con un segundo de menos. En toda la historia de UTC son 27 segundos en total, algo que importa para la navegación por satélite y para nada de lo que vayas a medir aquí.',
        },
        {
          question: '¿Y si el final es anterior al inicio?',
          answer:
            'Se te dice, y aun así se informa de la magnitud. Una duración negativa suele ser una errata, y cambiar el signo en silencio la ocultaría.',
        },
      ],
      sections: [
        {
          heading: 'Por qué la aritmética del calendario no es la del reloj',
          paragraphs: [
            '«Un día después» y «24 horas después» son instrucciones distintas, y dos veces al año dan respuestas distintas. Si una tarea nocturna está programada a las 02:30 hora local, se ejecuta dos veces una mañana de otoño y ninguna una mañana de primavera. Si está programada cada 86 400 segundos, se aleja una hora de las 02:30.',
            'Ninguno de los dos comportamientos es un fallo: responden a preguntas distintas. El problema empieza cuando el código hace uno y la persona esperaba el otro. Esta calculadora responde siempre a la pregunta del reloj —cuánto tiempo pasó realmente— y muestra los días de calendario al lado.',
          ],
        },
      ],
    },
    countdown: {
      title: 'Cuenta atrás',
      metaTitle: 'Cuenta atrás para cualquier fecha',
      description:
        'Cuenta atrás hasta cualquier momento en cualquier zona horaria y compártela como enlace. Sin cuenta y sin almacenamiento: todo vive en la URL.',
      summary:
        'Elige un momento y una zona, y la cuenta atrás de abajo corre hacia él. Todo vive en la URL, así que copiar la barra de direcciones es la forma de compartirla.',
      faqs: [
        {
          question: '¿Cómo comparto una cuenta atrás?',
          answer:
            'Configúrala y copia la barra de direcciones: todos los campos están en la URL. Quien la abra verá la misma cuenta atrás hacia el mismo instante, medida con el reloj de su propio dispositivo. No hay cuenta de usuario, ni registro guardado, ni nada almacenado en un servidor, porque no hay servidor.',
        },
        {
          question: '¿La otra persona la ve en su propia zona horaria?',
          answer:
            'Ve la misma cuenta atrás, porque una cuenta atrás mide la distancia hasta un instante y esa distancia es la misma en todas partes. La fecha y la hora de destino se muestran en la zona que elegiste, para que todo el mundo vea a qué momento local se refiere.',
        },
        {
          question: '¿Qué pasa cuando llega a cero?',
          answer:
            'Dice que ese momento ya pasó y se detiene. No empieza a contar hacia arriba: si quieres el tiempo transcurrido desde un evento, la calculadora de duración responde a eso como es debido.',
        },
        {
          question: '¿Puedo contar hacia una hora que no existe?',
          answer:
            'Si eliges una hora local dentro del salto de primavera, la cuenta atrás se mueve al instante equivalente posterior al cambio y te lo dice. Es la misma política que aplican todas las herramientas de este sitio.',
        },
      ],
      sections: [
        {
          heading: 'Por qué la cuenta atrás entera está en el enlace',
          paragraphs: [
            'Casi todas las herramientas de cuenta atrás te piden crear una cuenta para poder guardarla en su servidor y enseñarte un anuncio al lado. Aquí no hay servidor, así que el estado tiene que vivir en algún sitio que el enlace pueda transportar, y resulta ser mejor para todos. Nada que registrar, nada que borrar después, nada que deje de funcionar cuando una empresa cierre.',
            'Lo único que conviene saber: como el título viaja en la URL, trata un enlace de cuenta atrás de un desconocido igual que cualquier otro enlace. Al título se le quita todo lo que no sea texto plano y se muestra como texto, nunca como marcado.',
          ],
        },
      ],
    },
    utcTime: {
      title: 'Hora UTC',
      metaTitle: 'Hora UTC actual en tiempo real',
      description:
        'La hora UTC actual, en tiempo real, además de qué es realmente UTC, en qué se diferencia de GMT y contra qué se mide el desfase de las demás zonas.',
      summary:
        'UTC es el reloj de referencia contra el que se define cualquier otra zona horaria: nunca se mueve por el horario de verano, y lo de abajo es el reloj de tu dispositivo expresado en él.',
      faqs: [
        {
          question: '¿Qué es UTC?',
          answer:
            'El Tiempo Universal Coordinado es la referencia contra la que se define cualquier otra zona horaria. No es una zona en la que viva nadie: es la línea base. Cada desfase que ves, de UTC-12 a UTC+14, es una distancia respecto a este reloj.',
        },
        {
          question: '¿UTC es lo mismo que GMT?',
          answer:
            'En el día a día marcan lo mismo, pero son cosas distintas. GMT es una zona horaria, definida por la posición del sol en el meridiano de Greenwich, y el Reino Unido la abandona cada verano. UTC es un patrón de tiempo, mantenido por unos 450 relojes atómicos y nunca ajustado por el horario de verano. Si te refieres a «la referencia», di UTC.',
        },
        {
          question: '¿Por qué se abrevia UTC y no CUT?',
          answer:
            'Porque no ganó ni el acrónimo inglés ni el francés. Los angloparlantes querían CUT, de «coordinated universal time»; los francófonos, TUC, de «temps universel coordonné»; y la Unión Internacional de Telecomunicaciones se quedó con UTC, que no coincide con ninguno de los dos idiomas y por tanto ofende a ambos por igual.',
        },
        {
          question: '¿UTC aplica el horario de verano?',
          answer:
            'Nunca. Ese es justamente su propósito. UTC no se mueve, y por eso lo usan los servidores, la aviación, el transporte marítimo y todo sistema distribuido que necesite que dos máquinas coincidan en cuándo ocurrió algo.',
        },
        {
          question: '¿Y los segundos intercalares?',
          answer:
            'A UTC se le han insertado a veces segundos intercalares para mantenerlo dentro de 0,9 segundos de la rotación real de la Tierra: 27 desde 1972, el último a finales de 2016. En 2022, la Conferencia General de Pesas y Medidas votó dejar de añadirlos antes de 2035. Tu navegador no expone los segundos intercalares, así que esta página tampoco.',
        },
      ],
      sections: [
        {
          heading: 'Por qué todo se mide desde aquí',
          paragraphs: [
            'Antes de 1884, cada localidad tenía su propio reloj, ajustado a su propio mediodía. Funcionó hasta que llegó el ferrocarril; en ese momento, que dos poblaciones separadas por sesenta kilómetros discreparan en doce minutos dejó de ser una curiosidad y pasó a ser un riesgo de colisión. La Conferencia Internacional del Meridiano eligió Greenwich como meridiano de origen, y el sistema moderno de desfases se deriva de ahí.',
            'UTC sustituyó al Tiempo Medio de Greenwich como patrón técnico en 1972. La diferencia importa más de lo que parece: GMT lo define la Tierra, que se bambolea, mientras que UTC lo definen átomos de cesio, que no. A los dos se les mantiene a menos de un segundo de distancia a mano.',
            'Si vas a guardar una marca de tiempo en una base de datos, registrar un evento o programar cualquier cosa en la que dos máquinas deban coincidir, guárdalo en UTC y conviértelo al mostrarlo. Guardar la hora local es como los sistemas acaban con una hora que ocurre dos veces al año y un ticket de soporte a juego.',
          ],
        },
      ],
    },
    dstChanges: {
      title: 'Cambios de horario de verano',
      metaTitle: 'Cambios de horario de verano por año',
      description:
        'Todos los cambios de hora previstos para este año y el siguiente, con fechas exactas, la hora local del cambio y el desfase a cada lado.',
      summary:
        'Todas las fechas proceden de la base de datos IANA, con el momento local exacto en que cada cambio entra en vigor, y las ciudades que nunca mueven sus relojes aparte.',
      faqs: [
        {
          question: '¿Qué países han abolido el horario de verano?',
          answer:
            'Rusia lo dejó en 2014, Turquía en 2016, Irán en 2022, México en 2022 para casi todo el país y Brasil en 2019 tras décadas de uso. Japón, India, China y casi toda África y el Sudeste Asiático no lo han usado nunca. Alrededor de un tercio del mundo lo aplica; el resto observa la discusión semestral con interés.',
        },
        {
          question: '¿La Unión Europea sigue con la idea de abolirlo?',
          answer:
            'El Parlamento Europeo votó en 2019 acabar con los cambios estacionales de hora, pero la directiva se estancó: los Estados miembros no se pusieron de acuerdo sobre si quedarse en horario de verano permanente o de invierno permanente, y un mosaico fragmentaría las zonas horarias del mercado único. Hasta que eso se resuelva, los cambios de esta página siguen en pie.',
        },
        {
          question: '¿Por qué la isla de Lord Howe se mueve solo 30 minutos?',
          answer:
            'Porque decidió que una hora era demasiado. Lord Howe, frente a la costa este de Australia, pasa de UTC+10:30 a UTC+11:00: el único cambio de media hora del mundo. También es la razón por la que cualquier biblioteca de fechas que dé por hecho un cambio de una hora se equivoca, en silencio, para unas 380 personas.',
        },
        {
          question: '¿A qué hora se cambian los relojes?',
          answer:
            'Depende. Estados Unidos cambia a las 02:00 hora local; la Unión Europea, a la 01:00 UTC, lo que significa que todas sus zonas cambian en el mismo instante pero a una hora local distinta. Australia cambia a las 02:00 locales y Chile a las 24:00. La columna de hora local muestra la última lectura antes de cada cambio.',
        },
        {
          question: '¿Con qué frecuencia se actualiza esta página?',
          answer:
            'Se reconstruye cada mes, y además el 1 de marzo, abril, octubre y noviembre, para que cualquier cambio en la base de datos IANA se recoja antes de las fechas a las que afecta. Los gobiernos anuncian estos cambios con entre un año y quince días de antelación.',
        },
      ],
      sections: [],
    },
  },

  hubs: {
    convert: {
      title: 'Conversiones de zona horaria',
      metaTitle: 'Conversiones de zona horaria',
      description:
        'Todas las conversiones entre ciudades y abreviaturas, cada una con tabla hora por hora, fechas de cambio de hora y las horas para llamar.',
      summary:
        'Cada conversión incluye una tabla hora por hora, las fechas de cambio de hora de ambas ciudades y las horas en las que realmente se puede llamar.',
    },
    cities: {
      title: 'Hora actual por ciudad',
      metaTitle: 'Hora actual por ciudad y continente',
      description:
        'Hora local, desfase respecto a UTC y fechas de cambio de hora para 80 ciudades de todos los continentes habitados.',
      summary:
        'Cada página incluye un reloj en vivo, las fechas exactas de cambio de hora de esa zona, el orto y el ocaso calculados a partir de las coordenadas de la ciudad, y conversiones a los grandes centros.',
    },
    guides: {
      title: 'Guías',
      metaTitle: 'Guías sobre zonas horarias y UTC',
      description:
        'Guías sobre cómo funcionan las zonas horarias, qué es UTC, por qué existe el horario de verano y cómo manejarlo todo en código sin equivocarse.',
      summary:
        'Cómo funcionan de verdad las zonas horarias: el mecanismo, la historia y las formas concretas en que el software se equivoca. Escritas para leerse una vez y recordarse, no para posicionar.',
    },
  },

  generated: {
    hourByHour: 'Hora por hora',
    daylightSaving: 'Horario de verano',
    whenYouCanTalk: 'Cuándo podéis hablar de verdad',
    reference: 'Referencia',
    zoneFacts: 'Datos de la zona',
    sunriseSunset: 'Orto y ocaso',
    againstHubs: 'Frente a los grandes centros',
    convertTo: 'Convertir a',
    exampleNote:
      'Los desfases y las fechas se calculan al compilar a partir de la base de datos IANA. Las horas en vivo se generan en tu navegador.',
    sunNote:
      'Calculados a partir de la latitud y la longitud de la ciudad con el algoritmo de posición solar de la NOAA: sin API y sin llamadas de red.',
    noDstNote:
      'Esta ciudad no aplica el horario de verano. Su desfase respecto a UTC es el mismo todos los días del año.',
    ambiguousPanelHeading: 'Estas letras significan más de una cosa',
    ambiguousPanelBody:
      'Si te referías a otra de ellas, el desfase de abajo no es el tuyo, y así es exactamente como se reservan reuniones a la hora equivocada.',
    abbreviationTableNote:
      'Calculado en una fecha en la que esta abreviatura está realmente vigente: usar el día de hoy sería incorrecto medio año.',
  },
};

export default copy;
