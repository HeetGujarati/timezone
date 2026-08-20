---
title: 'Cómo hacer una reunión diaria entre muchos husos horarios'
description: 'La reunión diaria síncrona no sobrevive a cuatro husos horarios. Qué la sustituye y cómo lograr que el sustituto funcione de verdad.'
summary: 'Una reunión diaria funciona porque todo el mundo está despierto a la vez. Pasada una amplitud de unas seis horas eso deja de ser cierto, y el arreglo honesto es cambiar el formato en vez de seguir moviendo la hora.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 8
keywords:
  [
    'reunión diaria global',
    'reunión diaria asíncrona',
    'reuniones de equipos distribuidos',
    'reunión diaria remota husos horarios',
  ]
related: ['scheduling-across-twelve-hours', 'how-time-zones-work', 'why-daylight-saving-exists']
---

La reunión diaria es un encuentro síncrono de quince minutos que funciona porque todo el mundo está en su mesa a la misma hora. Reparta el equipo entre cuatro husos horarios y esa premisa se cae. La mayoría responde moviendo la reunión, descubre que ahora le va mal a otra persona y la mueve de nuevo.

La reunión no es lo importante. Lo importante son tres cosas: que todos sepan qué hacen los demás, que los bloqueos salgan a la luz en el plazo de un día y que la gente se sienta un equipo. Las tres se pueden tener sin la reunión, y pasada cierta amplitud tienen que tenerse así.

## Calcule primero su amplitud

Tome el huso más adelantado y el más atrasado del equipo y calcule la diferencia en la fecha _actual_, no de memoria. La respuesta se mueve: un equipo entre Nueva York y Sídney está a 16 horas en el invierno boreal y a 14 en el verano boreal, porque ambos aplican horario de verano en estaciones opuestas.

Después busque la ventana común de 09:00 a 18:00. Ese número decide el formato:

| Ventana común    | Qué funciona                                                               |
| ---------------- | -------------------------------------------------------------------------- |
| 4 horas o más    | Una reunión diaria síncrona, si la quiere                                  |
| 2–4 horas        | Síncrona, pero reserve esa ventana solo para decisiones                    |
| Menos de 2 horas | Reunión escrita, con una llamada síncrona semanal                          |
| Ninguna          | Todo escrito, más un solapamiento deliberado para lo poco que necesita voz |

## La reunión diaria escrita

El formato que sobrevive al contacto con la realidad es una entrada escrita breve por persona, al _comienzo de su propia jornada_, en un único lugar compartido.

Tres consignas:

1. **Qué terminé** — no «estuve con el analizador», sino «el analizador ya trata las comillas anidadas; integrado en #482»
2. **Qué haré ahora** — con detalle suficiente para que alguien vea si se solapa con lo suyo
3. **Qué me bloquea** — y quién puede desbloquearlo, con nombre

La tercera es donde está el valor. En una reunión síncrona, un bloqueo se plantea y se resuelve en los mismos quince minutos. Por escrito hace falta el nombre de quien puede despejarlo, o se queda quieto un ciclo entero de un día.

**Publique al comienzo de su jornada, no al final.** Escrita al final de su jornada, la entrada llega a colegas que ya han terminado la suya: un ciclo entero de retraso adicional. Escrita al principio, llega a quien se va a la cama mientras usted se levanta, que es justo el relevo que quiere.

## Qué conviene mantener síncrono

No todo debe escribirse. Tres cosas necesitan voz de verdad:

- **Decisiones con desacuerdo real.** Un hilo que lleva cuatro rondas sin converger no convergerá en la quinta. Veinte minutos de llamada lo cierran.
- **Cualquier cosa con peso emocional.** Comentarios de mejora, conflictos, malas noticias. La escritura despoja del tono, y quien lee suministra el peor.
- **Una ambigüedad que aún no sabe nombrar.** «Algo no me cuadra en este diseño, pero no sé decir qué» pide una conversación.

Todo lo demás —estado, avance, casi todas las preguntas, casi todas las decisiones— está mejor escrito, porque lo escrito escala y las voces no.

## Hacer que funcione una llamada semanal

La mayoría de los equipos con más de seis horas de amplitud se quedan en una reunión síncrona semanal. Para que valga el coste de quien la toma fuera de su jornada:

**Rótela, y en serio.** Si la misma región se queda siempre con las 22:00, no tiene una rotación, tiene una jerarquía.

**Póngala en un huso fijo y diga cuál.** «Jueves a las 14:00 UTC» es inequívoco y no se desplaza cuando una región cambia sus relojes. «Jueves a las 9 de la mañana del Este» se mueve para todos los demás dos veces al año, y nadie lo espera.

**Tenga un orden del día, enviado con un día de antelación.** Quien se conecta a las 22:00 merece saber si le compensará, y añadir antes lo que le importa.

**Grábela y escriba las decisiones.** Habrá quien se la pierda. El resumen escrito es el producto; la llamada es el procedimiento.

## Los modos de fallo

**La deriva invisible.** Una reunión periódica anclada a la hora local de una región se corre una hora para todos los demás dos veces al año, y puede aterrizar donde nadie acordó. Ancle a UTC o reconfirme tras cada cambio.

**La lista de asistentes que crece.** Una reunión programada cuando el equipo estaba en tres husos sigue viva ahora que está en seis, y para los tres más recientes la hora es mucho peor. Nadie propone moverla, porque moverla es la incomodidad de otro. Revise la lista frente a la amplitud actual dos veces al año: las fechas del cambio de hora son un recordatorio cómodo.

**La reunión escrita que nadie lee.** Si las entradas van a un canal que nadie abre, ha añadido trabajo y ha quitado el único beneficio de la reunión. Alguien tiene que leerlas y responder, al menos al principio, o el hábito muere en menos de un mes.

**Las 07:00 que se volvieron las 06:00.** Alguien aceptó una vez una llamada temprana, como favor. Se volvió permanente, luego el horario de verano la adelantó una hora, y nadie la revisó. Pregunte.

## Qué medir

Si duda de si el cambio funcionó, hay tres señales que vale la pena vigilar, y ninguna es la asistencia a la reunión.

**Tiempo hasta desbloquear.** ¿Cuánto pasa entre que alguien dice que está atascado y otro responde? En una reunión síncrona son minutos. Los equipos asíncronos bien llevados lo dejan por debajo de media jornada. Por encima de un día entero, el formato está fallando.

**Decisiones por semana que necesitaron una llamada.** Si ese número sube, el canal escrito no lleva contexto suficiente y la gente escala a la voz por omisión.

**Quién se conecta fuera de su jornada, y con qué frecuencia.** Llévelo por nombre. Es la cifra que le dice si «rotamos el turno incómodo» es cierto o solo una aspiración.

## Empezar el cambio

Los equipos que cambian con éxito suelen hacerlo de una vez y no por grados, porque una reunión medio escrita es peor que cualquiera de las formas puras: la gente espera a la reunión para decir lo que debería haber escrito.

Anuncie la última reunión síncrona, acuerde el formato escrito y dónde vive, y manténgalo cuatro semanas antes de juzgar. Las dos primeras semanas se sentirán como una pérdida de contacto, porque lo son: la charla informal alrededor de una llamada diaria es valor real y necesita otro sitio adonde ir. Un canal social específico es un mal sustituto, pero es un sustituto, y la alternativa es pedir a la gente que esté despierta a las 22:00 para sostenerlo.
