---
title: 'Organizar reuniones con doce horas de diferencia'
description: 'Cuando dos equipos no comparten ninguna hora de trabajo, el arreglo es estructural y no un calendario más ingenioso. Esto es lo que de verdad funciona.'
summary: 'Una diferencia de doce horas no tiene una buena hora de reunión, y ningún sombreado de rejilla lo cambia. Los equipos que lo llevan bien dejan de buscarla y cambian su forma de trabajar.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 4
keywords:
  [
    'organizar reuniones entre husos horarios',
    'equipo remoto husos horarios',
    'diferencia de doce horas',
    'trabajo asíncrono',
  ]
related: ['how-to-run-a-global-standup', 'why-daylight-saving-exists', 'how-time-zones-work']
---

San Francisco y Bengaluru están a doce horas y media. Una jornada de 09:00 a 18:00 en una termina antes de que empiece en la otra. No existe una disposición ingeniosa del calendario que produzca una hora laboral compartida, porque no hay ninguna que encontrar.

La mayoría de los equipos lo descubre intentándolo igualmente, acordando las 21:00 para un lado y guardándole rencor en silencio durante dieciocho meses. Lo que sigue es lo que hacen, en su lugar, los equipos que lo llevan bien.

## Primero, sea honesto con la aritmética

Antes de negociar, calcule los números reales, porque suelen ser peores de lo que la gente supone, y de vez en cuando mejores.

La diferencia no es fija. Nueva York y Sídney están a 16 horas en el invierno boreal y a 14 en el verano boreal, porque ambas aplican horario de verano en estaciones opuestas. Ese vaivén de dos horas es la diferencia entre «una hora compartida» y «ninguna», y llega sin que nadie cambie nada.

Dos ciudades que mantienen el mismo desfase todo el año —la India y Japón, por ejemplo— tienen una diferencia que se puede memorizar. Dos ciudades donde solo una aplica horario de verano tienen una diferencia que se mueve dos veces al año. Dos ciudades que lo aplican ambas pero en fechas distintas tienen una diferencia que es errónea unas cuatro semanas al año.

## Las cuatro opciones honestas

Solo hay cuatro, y todo arreglo viable es una combinación de ellas.

**1. Un lado se desplaza de forma permanente.** La jornada de alguien se corre dos o tres horas. Funciona, es estable y solo es justo si viene con algo a cambio: una jornada central más corta, una compensación o una elección real. Imponérselo al equipo con menos antigüedad es como empieza la rotación de personal.

**2. Alternar la molestia.** La llamada incómoda rota: este mes es temprano para Bengaluru, el siguiente tarde para San Francisco. Más justo en principio, más difícil en la práctica, porque exige que alguien lleve la cuenta y lo haga cumplir. Funciona mejor con un número pequeño de reuniones de alto valor.

**3. Solaparse a propósito y de forma estrecha.** Ambos lados se comprometen a estar disponibles una hora concreta, cerca de un extremo de su jornada, y no se programa nada más a través del hueco. Todo lo que ocurre en esa hora son decisiones; todo lo demás se escribe.

**4. Dejar de reunirse.** El hueco pasa a ser una ventaja: el trabajo se entrega al final de cada jornada y se retoma al comienzo de la otra. Es la única opción que escala más allá de dos ubicaciones, y la que más cambios exige en la forma real de trabajar del equipo.

## Qué exige entregar bien el relevo

La opción cuatro es donde los equipos con doce horas de separación prosperan o se rompen, y la diferencia está casi por entero en la escritura.

**Las decisiones se escriben, con su razonamiento.** No «decidimos usar Postgres», sino «elegimos Postgres frente a DynamoDB porque los patrones de consulta son relacionales y el coste operativo de un segundo almacén de datos supera el rendimiento de escritura que ganaríamos». La segunda versión sobrevive a un relevo; la primera genera una reunión.

**Las preguntas se hacen con contexto suficiente para responderlas mientras usted duerme.** «¿Qué te parece el esquema?» cuesta un día entero de ida y vuelta. «El esquema tiene que soportar X e Y; la opción A hace mejor X, la B hace mejor Y; me inclino por A por Z; dime si discrepas antes de tu mañana» se resuelve en un ciclo.

**Los bloqueos se señalan antes del relevo, no en él.** El peor patrón de un equipo asíncrono es descubrir a las 09:00 que el otro lado estaba atascado ayer a las 17:00 y no dijo nada durante once horas.

**El estado es visible sin preguntar.** Un tablero, un canal, un documento: cualquier cosa que responda a «qué pasó mientras dormía» sin exigir que alguien esté despierto.

## La trampa de la reunión periódica

Si aun así programa una llamada periódica a través de un hueco amplio, sepa que se desplazará. Cuando un lado cambia sus relojes y el otro no, una reunión anclada a un calendario se corre una hora en el otro. Dos veces al año, durante unas semanas, aterriza donde nadie acordó.

El software de calendario lo maneja bien cuando el evento se guarda con un huso, lo que es otro argumento para elegir un huso de anclaje de forma explícita, decirlo en la invitación y dejar que el calendario de los demás haga la conversión.

La otra trampa es la reunión que se programó cuando el equipo estaba en tres husos y sigue viva ahora que está en seis. Las reuniones de hueco amplio acumulan asistentes para quienes la hora es mucho peor que para el grupo original, y nadie propone moverla nunca, porque moverla es la incomodidad de otro.

## Cuando de verdad no hay nada

Los Ángeles y Bombay no comparten ni un minuto de una jornada de 09:00 a 18:00, en ninguna estación. Si su equipo abarca ese hueco y necesita decisiones síncronas, alguien está trabajando fuera de su jornada; la única pregunta es quién, con qué frecuencia y si aceptó hacerlo.

Eso es un problema de gestión, no de agenda, y las herramientas no pueden resolverlo. Lo que sí pueden hacer es evitar que usted lo descubra en la invitación.

## Una nota sobre la equidad

El arreglo que acaba imponiéndose suele ser el que conviene a quien tiene más poder dentro de la organización, y suele imponerse sin que nadie lo decida.

Vigile el patrón por el cual el equipo más nuevo, con menos antigüedad o más alejado se lleva siempre la hora incómoda. Rara vez es una decisión; es la acumulación de pequeños valores por omisión, cada uno razonable por separado. Una vez establecido, resulta invisible para quienes se benefician y muy visible para todos los demás.

La contramedida práctica es escribir quién asume el coste, revisarlo con una periodicidad fija y tratarlo como una partida presupuestaria real y no como buena voluntad. Las fechas de cambio de horario de verano son un recordatorio cómodo para esa revisión, ya que los números se mueven entonces de todas formas.
