---
title: "Qué es UTC en realidad y en qué se diferencia de GMT"
description: "UTC es un estándar mantenido por relojes atómicos. GMT es una zona horaria que mantiene la Tierra. Casi siempre coinciden, y la diferencia importa."
summary: "UTC no es una zona horaria. Es el estándar de referencia contra el que se define cada zona, mantenido por unos 450 relojes atómicos, y nunca cambia por el horario de verano: exactamente por eso lo usan los sistemas."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 2
keywords: ['qué es utc', 'utc y gmt', 'tiempo universal coordinado', 'utc explicado']
related: ['how-time-zones-work', 'iso-8601-explained', 'time-zones-in-code']
---

La gente usa «UTC» y «GMT» como si fueran lo mismo. Casi siempre no pasa nada, porque casi siempre marcan la misma hora. Pero son objetos de distinta naturaleza, y esa diferencia explica por qué uno de los dos es lo correcto para guardar en tu base de datos y el otro no.

## UTC es un estándar, no un lugar

El tiempo universal coordinado lo mantiene la Oficina Internacional de Pesas y Medidas a partir de una media ponderada de unos 450 relojes atómicos repartidos por unas 85 instituciones de todo el mundo. Esos relojes miden la frecuencia de resonancia de átomos de cesio-133, estable hasta aproximadamente un segundo en 100 millones de años.

La hora local de nadie es UTC por ley. Incluso el Reino Unido, que se asienta sobre el meridiano de origen, está en UTC+1 siete meses al año. UTC es el punto fijo desde el que se describe cualquier hora local: el cero de la regla, no una marca en el mapa.

La propiedad más importante para quien construye software: **UTC nunca se desplaza por el horario de verano.** No tiene variación estacional, ni historia política, ni excepciones. Esa es toda la razón de que la aviación, la navegación, la liquidación financiera y absolutamente todos los sistemas distribuidos lo usen.

## GMT es una zona horaria con historial laboral

La hora media de Greenwich es el tiempo solar medio en el Real Observatorio de Greenwich. Está definida por la rotación de la Tierra, que no es un instrumento de precisión: el planeta bambolea, se frena de forma desigual y de vez en cuando se acelera.

Desde 1884 hasta 1972, GMT fue el estándar de tiempo del mundo. Lo sustituyó UTC precisamente porque los relojes atómicos resultaron ser mejor referencia que un planeta. GMT sobrevive como nombre de una zona horaria: la que el Reino Unido usa en invierno y la que varios países de África occidental usan todo el año.

Así que: **UTC nunca aplica horario de verano. GMT, tal como lo usa el Reino Unido, sí** —Gran Bretaña lo abandona cada marzo por el British Summer Time y vuelve cada octubre. Si un colega británico dice «las 3 de la tarde GMT» en julio, casi seguro se refiere a las 3 BST, que son las 2 UTC. Es un error lo bastante frecuente como para que valga la pena preguntar en vez de suponer.

## Por qué se abrevia UTC

No ganó ni el acrónimo inglés ni el francés. Los angloparlantes proponían CUT, de «coordinated universal time». Los francófonos proponían TUC, de «temps universel coordonné». La Unión Internacional de Telecomunicaciones se decidió por UTC, que no coincide con ninguno de los dos idiomas y por tanto ofende a ambos por igual. A su manera, un resultado diplomático perfecto.

## Los segundos intercalares y su próxima abolición

La Tierra no gira a ritmo constante. Para que UTC no se aleje del tiempo solar, se han ido insertando segundos adicionales: 27 entre 1972 y 2016. Durante un segundo intercalar, un reloj UTC marca 23:59:60, una hora real que casi ningún software sabe representar.

Los segundos intercalares han provocado caídas reales. En 2012 uno de ellos tumbó Reddit, los servicios de Mozilla y varios sistemas de reservas de aerolíneas, todos por el mismo fallo del núcleo de Linux. En 2017 el DNS de Cloudflare se rompió porque un cálculo de duración se volvió negativo al cruzar la inserción.

En noviembre de 2022, la Conferencia General de Pesas y Medidas votó dejar de añadir segundos intercalares antes de 2035. A partir de ahí se permitirá que UTC se separe del tiempo solar, y el problema se revisará cuando la brecha resulte incómoda, probablemente dentro de un siglo.

Tu navegador no expone los segundos intercalares. El reloj de JavaScript hace como si nunca hubieran existido, así que un intervalo que atraviese uno se informa un segundo más corto. Para casi cualquier propósito es el intercambio correcto; si haces navegación por satélite, ya lo sabías.

## Qué hacer en la práctica

**Guarda las marcas temporales en UTC.** No en la zona del usuario, ni en la del servidor, ni en aquella donde el negocio tenga la sede. Un instante en UTC es inequívoco, ordenable e inmune a que un gobierno cambie de idea.

**Convierte a hora local en el momento de mostrarla**, con la zona de quien lee y la copia de la base IANA del entorno.

**Di UTC cuando quieras decir UTC.** Escribir «GMT» en una especificación invita a que alguien lo lea como hora local británica, y en verano eso está desviado una hora. «12:00 UTC» tiene exactamente un significado todos los días del año.

**Usa el sufijo Z de ISO 8601.** `2026-03-08T14:30:00Z` es UTC y no se puede leer de otra forma. `2026-03-08T14:30:00` es una hora local en una zona sin especificar, es decir, no es una marca temporal en absoluto.

## La familia de escalas de tiempo

UTC es una de varias escalas emparentadas, y las diferencias importan de vez en cuando.

**TAI** — Tiempo Atómico Internacional. La escala atómica en bruto, sin segundos intercalares. Ahora mismo TAI va 37 segundos por delante de UTC, y la brecha crece con cada segundo insertado. Los satélites GPS funcionan sobre una escala desplazada respecto a TAI.

**UT1** — la rotación real de la Tierra, medida contra cuásares lejanos. Es a lo que perseguían los segundos intercalares de UTC. UTC se mantiene dentro de 0,9 segundos de UT1; o se mantenía, hasta la decisión de 2035.

**Tiempo GPS** — arrancó alineado con UTC en enero de 1980 y desde entonces ignora los segundos intercalares. Ahora va 18 segundos por delante de UTC. Los receptores lo corrigen; los sistemas que leen tiempo GPS en bruto, a veces no.

**Tiempo Unix** — la cuenta de segundos desde 1970, que finge que los segundos intercalares no existen repitiendo un segundo en vez de contarlo. Eso hace que no sea del todo una cuenta de segundos transcurridos, sutileza que ha mordido a quienes miden duraciones a través de una inserción.

Para casi todo el software, UTC es la respuesta correcta y lo demás es anecdótico. Para cualquier cosa que implique satélites, marcas temporales de negociación de alta frecuencia o instrumentación científica, esas distinciones soportan peso.

## Por qué «hora UTC» es redundante y aun así lo escribimos

La T es de «time», así que «hora UTC» viene a ser «hora tiempo universal coordinado». Los puristas protestan.

Las páginas de este sitio dicen «hora UTC» de todos modos, en encabezados y títulos, porque es lo que la gente busca y lo que teclea. Hay una versión de la corrección que te cuesta el lector, y la pedantería sobre un acrónimo está de lleno en ella. En el cuerpo del texto, donde quien lee ya está aquí, es simplemente UTC.
