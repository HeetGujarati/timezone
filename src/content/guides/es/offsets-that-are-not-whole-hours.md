---
title: 'Los desfases de UTC que no son horas enteras'
description: 'La India, Nepal, Terranova y las islas Chatham van en medias horas y en cuartos. Aquí está la lista completa y lo que se rompe en el software por su causa.'
summary: 'Cerca de una quinta parte del mundo vive en un desfase que no es un número entero de horas respecto de UTC. El software que supone lo contrario no se equivoca un poco con esa gente: se equivoca en 30 o 45 minutos, que es peor.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 5
keywords:
  [
    'husos horarios de media hora',
    'desfase utc 45 minutos',
    'desfase huso horario india',
    'huso horario de nepal',
  ]
related: ['half-hour-offsets-explained', 'time-zones-in-code', 'how-time-zones-work']
---

El modelo mental de veinticuatro husos de una hora es erróneo de una manera cara: produce código que se equivoca con aplomo en 30 o 45 minutos para muchísimo más de mil millones de personas. Un error de una hora entera al menos parece un error. Uno de 45 minutos parece una errata, y se publica.

## La lista completa

**Desfases en :30**

| Desfase   | Dónde                                                          |
| --------- | -------------------------------------------------------------- |
| UTC-09:30 | Islas Marquesas                                                |
| UTC-03:30 | Terranova y Labrador                                           |
| UTC+03:30 | Irán                                                           |
| UTC+04:30 | Afganistán                                                     |
| UTC+05:30 | India, Sri Lanka                                               |
| UTC+06:30 | Myanmar, islas Cocos                                           |
| UTC+09:30 | Australia central — Territorio del Norte, Australia Meridional |
| UTC+10:30 | Isla Lord Howe (hora estándar)                                 |

**Desfases en :45**

| Desfase   | Dónde                                                        |
| --------- | ------------------------------------------------------------ |
| UTC+05:45 | Nepal                                                        |
| UTC+08:45 | Sudeste de Australia Occidental (Eucla, de forma no oficial) |
| UTC+12:45 | Islas Chatham (hora estándar)                                |

Solo la India son 1.400 millones de personas. Añada Irán, Afganistán, Myanmar, Sri Lanka y Nepal y ya pasa de la quinta parte del planeta, antes de contar Australia o Canadá.

## El otro tipo de desfase inusual

Los desfases que no son horas enteras son la rareza conocida. Otras dos importan lo mismo.

**El rango es de 26 horas, no de 24.** Kiritimati, en Kiribati, está en UTC+14; las islas Baker y Howland, en UTC-12. Son 26 horas, lo que significa que hay momentos en que tres fechas distintas del calendario están en uso a la vez en algún punto de la Tierra. Cualquier código que suponga que una ventana de dos días cubre todos los husos se equivoca dos veces al día.

**El horario de verano no siempre es una hora.** La isla Lord Howe, una isla australiana pequeña con una población fija de unas 380 personas, cambia 30 minutos: UTC+10:30 en invierno y UTC+11:00 en verano. Es el único lugar de la Tierra que lo hace y el mejor caso de prueba para una biblioteca de fechas: cualquier implementación que fije un salto de 60 minutos se equivoca allí y en ningún otro sitio, lo que significa que superará todas las demás pruebas que usted escriba.

## Qué se rompe

**Redondear a la hora más próxima.** El fallo más común. El código que calcula un desfase en horas como número entero trunca la India a +5 sin decir nada, lo que son 30 minutos de error para todos los usuarios del país.

**Guardar desfases como enteros.** Una columna declarada como recuento de horas no puede representar Katmandú. Esto suele descubrirse cuando los datos ya están dentro.

**Interfaces de rejilla construidas sobre columnas horarias.** Cualquier calendario o planificador que reparta el día en 24 celdas iguales y suponga que la hora local de cada huso cae en un límite de celda colocará mal los husos de media hora y de 45 minutos. La banda del planificador de reuniones de este sitio usa instantes como columnas en vez de horas locales, de modo que una fila +05:45 muestra 09:45 en la columna donde una fila UTC muestra 04:00, que es la verdad y no una mentira más ordenada.

**Aritmética de duraciones a través de un cambio estacional de 30 minutos.** Suponer que una transición de horario de verano son exactamente 3.600.000 milisegundos da la respuesta equivocada en la isla Lord Howe, y solo allí.

## Cómo hacerlo bien

El arreglo es el mismo que arregla casi todos los errores de husos horarios: **nunca calcule usted un desfase.** Pregunte a la plataforma.

Todo entorno de ejecución moderno incluye la base de datos de la IANA y le dirá el desfase de un huso en un instante dado, en minutos y correctamente, también para Katmandú y Lord Howe. En JavaScript eso es `Intl.DateTimeFormat` con `timeZoneName: 'longOffset'`, o una comparación de la lectura de reloj del huso contra UTC, que es el camino que sigue el motor de este sitio porque se mantiene exacto incluso con los desfases de tiempo medio local por debajo del minuto en datos anteriores a 1900.

Después, atiéngase a tres reglas:

1. **Los desfases son minutos**, nunca horas. Si una variable se llama `offsetHours`, ya es un error.
2. **Pruebe contra Katmandú y Lord Howe.** Rompen las dos suposiciones que todo lo demás le deja conservar.
3. **Nunca redondee un huso horario.** Si una pantalla tiene que ser aproximada, dígalo; no mueva en silencio el reloj de un usuario 30 minutos para facilitar una maquetación.

## Un ejemplo resuelto: lo que 45 minutos le hacen a una rejilla

Tome un planificador de reuniones que reparta el día en 24 columnas, una por hora, y sombree la jornada laboral de cada participante. La implementación ingenua calcula cada fila desplazando la fila base según el desfase del huso en horas.

Para Londres frente a Nueva York funciona: la fila de Nueva York es la de Londres corrida cinco celdas a la derecha. Para Londres frente a Katmandú no funciona. Katmandú va 5 horas y 45 minutos por delante, es decir 5,75 celdas, y tres cuartos de celda no existen. La implementación redondea —normalmente a 6— y ahora toda lectura de esa fila va 15 minutos adelantada.

El error es lo bastante pequeño para sobrevivir a una revisión y lo bastante grande para importar: una reunión de las 09:00 que la rejilla presenta como las 09:00 para Katmandú es allí realmente a las 08:45, y quien se conecta llega quince minutos tarde a su propio día.

El arreglo consiste en dejar de tratar las columnas como horas. Haga que cada columna sea un _instante_ y pregunte a la plataforma qué marca el reloj local de cada huso en ese instante. Una fila +05:45 mostrará entonces 09:45 donde una fila UTC muestra 04:00: visiblemente no alineada con la rejilla, que es la representación honesta. El planificador de reuniones de este sitio hace exactamente eso, y el borde irregular de la fila de Katmandú es una virtud.

## Los desfases históricos son aún más extraños

Antes de la normalización, los desfases eran tiempo solar medio local y precisos al segundo. La base de datos de la IANA los registra.

Los Países Bajos estuvieron en UTC+00:19:32,13 de 1909 a 1937. Liberia estuvo en UTC-00:44:30 hasta 1972. Pregunte a un entorno de ejecución por el desfase de `Europe/Amsterdam` en una fecha de 1920 y le dará el valor exacto, con segundos incluidos.

Por eso la función de desfase que sostiene este sitio calcula en segundos y solo redondea a minutos en la capa de presentación. Un motor que guardara minutos perdería en silencio 32 segundos de historia neerlandesa, cosa que nadie notaría y que seguiría estando mal.
