---
title: "La línea internacional de cambio de fecha y por qué se dobla"
description: "La línea de cambio de fecha no es un meridiano. Zigzaguea alrededor de países que prefieren no quedar partidos en dos, y se ha movido."
summary: "La línea internacional de cambio de fecha sigue el meridiano 180° solo de forma aproximada: rodea Kiribati, Rusia y las Aleutianas, y algunos países se han desplazado ellos mismos al otro lado por razones comerciales."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 11
keywords: ['línea internacional de cambio de fecha', 'línea de cambio de fecha explicada', 'huso horario de kiribati', 'día antes día después']
related: ['how-time-zones-work', 'offsets-that-are-not-whole-hours', 'what-utc-really-is']
---

Si navega usted hacia el oeste desde Los Ángeles durante el tiempo suficiente, gana una hora aproximadamente cada quince grados de longitud, y tras veinticuatro ganancias de esas quedaría un día entero desfasado respecto de quienes dejó atrás. La línea internacional de cambio de fecha es donde se devuelve ese día.

No es, sin embargo, una línea. Es una frontera negociada que se curva alrededor de los países a los que de otro modo partiría por la mitad.

## Por dónde pasa realmente

La línea sigue a grandes rasgos el meridiano 180° a través del Pacífico, elegido en 1884 por ser el más nítidamente opuesto a Greenwich y por atravesar muy poca tierra. Después traza cuatro desvíos importantes:

**Al norte, rodeando las Aleutianas.** Se desplaza al este para que toda Alaska conserve la misma fecha en lugar de partir la cadena de islas.

**Alrededor de Rusia.** Una curva hacia el oeste mantiene Chukotka en el lado asiático.

**Al este, rodeando Kiribati.** El desvío mayor y el más interesante. Kiribati queda a ambos lados del meridiano 180° y, hasta 1995, el país estuvo repartido entre dos fechas: sus islas occidentales iban un día por delante de las orientales. Las oficinas del gobierno en Tarawa compartían solo cuatro días laborables por semana con las de las islas de la Línea. En 1995 Kiribati desplazó la línea hacia el este, puso a todo el país en la misma fecha y empujó la frontera hasta los 150° oeste: un abombamiento de unos 2.000 kilómetros. Con ello Kiribati obtuvo además el huso horario más adelantado de la Tierra, UTC+14, y con él el primer amanecer del año 2000, que el gobierno promocionó con entusiasmo.

**Al sur, rodeando Samoa y Tonga.** El propio salto de Samoa en 2011 es el mejor ejemplo moderno de que la línea es un instrumento económico y no geográfico.

## El día que le falta a Samoa

Hasta 2011, Samoa se situaba en el lado americano de la línea, tres horas por detrás de Sídney pero también un día. Sus principales socios comerciales habían pasado de los Estados Unidos a Australia y Nueva Zelanda, y llevar un día de desfase significaba solo cuatro días laborables compartidos por semana: el viernes de Samoa era el sábado de Australia, y el domingo de Samoa era el lunes de Australia.

A medianoche del 29 de diciembre de 2011, Samoa saltó directamente al 31 de diciembre. **El 30 de diciembre de 2011 no existió en Samoa.** Nadie cumplió años, ningún contrato venció y el país pasó de UTC-11 a UTC+13.

Tokelau, administrado por Nueva Zelanda, dio el mismo salto esa misma noche.

Samoa había hecho lo contrario en 1892, pasando del lado asiático al americano a instancias de los comerciantes estadounidenses, y repitiendo dos veces el 4 de julio para lograrlo, lo que se presentó como una cortesía hacia la comunidad estadounidense.

## La franja de 26 horas

Por culpa de esos desvíos, los desfases del mundo abarcan más de veinticuatro horas:

- **UTC+14** — Kiritimati (isla de Navidad), Kiribati. El reloj más adelantado de la Tierra
- **UTC+13** — Samoa, Tonga y las islas Fénix de Kiribati
- **UTC-11** — Samoa Americana, Niue
- **UTC-12** — las islas Baker y Howland, territorios deshabitados de los Estados Unidos

Son 26 horas de amplitud, y de ahí se sigue algo que conviene interiorizar: **hay momentos en que tres fechas distintas del calendario están en uso simultáneamente en algún punto de la Tierra**. Durante unas dos horas cada día, Kiritimati está en una fecha, casi todo el mundo en la siguiente y la isla Baker en la anterior.

Cualquier código que suponga que una ventana de dos días cubre todos los husos se equivoca durante esos intervalos. Cualquier pregunta del tipo «qué día es a escala mundial» carece de respuesta.

Kiritimati y la isla Baker distan unos 2.100 kilómetros y 26 horas de reloj. En principio, se podría ver dos veces la misma puesta de sol.

## Qué significa esto en la práctica

**Convertir cruzando la línea cambia la fecha, no solo la hora.** Tokio el lunes por la tarde es Los Ángeles el lunes por la mañana; Auckland el lunes por la mañana es Honolulú el domingo por la tarde. Todas las páginas de conversión de este sitio marcan el cambio de día de forma explícita justo por eso: una hora acertada en el día equivocado es una clase especial de error.

**«Mañana» no es un concepto global.** Un plazo de «fin del día del viernes» designa instantes distintos para personas distintas, y ante un público auténticamente mundial la distancia entre el primer viernes que acaba y el último supera un día. Diga «23:59 UTC del viernes» si se refiere a un único momento.

**La línea se mueve.** No a menudo, pero es una frontera política y ha cambiado en la memoria de los vivos, dos veces en este siglo. Todo sistema con una idea fija de por dónde pasa acabará equivocándose. La base de datos de la IANA registra esos cambios; para eso está.

## Cruzarla en la práctica

Los vuelos sobre el Pacífico producen horas de llegada que parecen errores y no lo son.

Un vuelo que sale de Tokio a las 17:00 del lunes y dura nueve horas aterriza en Los Ángeles a las 10:00 del **lunes**, siete horas antes de despegar según el reloj. En sentido contrario, un vuelo que sale de Los Ángeles el lunes por la tarde llega a Tokio el miércoles por la mañana, habiéndose saltado el martes casi por completo.

Ninguno es una paradoja. El vuelo duró nueve horas en ambos sentidos; solo cambiaron las etiquetas. Por eso mismo la calculadora de duraciones de este sitio resuelve ambos extremos a instantes antes de restar: la diferencia entre dos lecturas de reloj a uno y otro lado de la línea carece de sentido, mientras que la diferencia entre dos instantes es siempre el tiempo realmente transcurrido.

La consecuencia práctica para quien construya programas de reservas o de logística: **nunca calcule una duración restando horas locales**. Acierta casi siempre, y eso es lo que lo hace peligroso.

## Qué lado va «por delante»

La convención despista porque invierte la intuición del mapa. Los países justo al _oeste_ de la línea —Nueva Zelanda, Fiyi, Kiribati— son los primeros en ver cada día nuevo. Los que quedan justo al _este_ —Hawái, Samoa Americana— son los últimos.

Así, Auckland va casi un día completo por delante de Honolulú pese a estar a unos 7.000 kilómetros, y ambas ciudades están en fechas distintas durante la mayor parte de cada ciclo de veinticuatro horas.

La regla que ayuda: la línea es donde _empieza_ el día, y el día barre luego el globo hacia el oeste hasta regresar a la línea veinticuatro horas después, cuando comienza el siguiente. Kiritimati, en UTC+14, es el primer lugar habitado que alcanza cualquier fecha dada. La isla Baker, en UTC-12, es el último.
