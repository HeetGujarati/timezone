---
title: Sobre Meridiem
description: Por qué existe este sitio, cómo calcula lo que muestra y qué decide deliberadamente no hacer.
order: 1
updatedAt: '2026-01-15'
---

Meridiem es un conjunto de herramientas de zonas horarias construido sobre un principio: no afirmar nunca un dato horario que no se haya calculado desde la base de datos IANA en el momento de necesitarlo.

## Por qué existe

Casi todas las herramientas de zonas horarias se apoyan en una tabla de desfases guardada. Esa tabla es correcta hasta que un gobierno cambia de opinión —cosa que ocurre varias veces al año— y a partir de ahí queda equivocada en silencio, de una forma que parece un error humano de agenda y no un fallo de software.

Cada desfase, cada fecha de cambio y cada conversión de este sitio proceden de la copia de la base IANA que trae el entorno de ejecución, a través de la interfaz `Intl`. En este código no hay ninguna tabla de desfases. Cuando la base se actualiza, una nueva compilación la recoge y el sitio vuelve a ser correcto sin tocar una línea.

## Cómo está construido

- Todas las páginas están generadas de antemano. No hay servidor, ni base de datos, ni API.
- Las horas actuales absolutas se calculan en tu navegador, nunca en la página. Una página generada de antemano no puede afirmar honestamente que sabe qué hora es ahora, así que no lo intenta.
- Los hechos duraderos —desfases, fechas de cambio, ventanas de coincidencia— se calculan al compilar y se presentan como válidos en esa fecha.
- El sitio se reconstruye cada mes, y además el 1 de marzo, el 1 de abril, el 1 de octubre y el 1 de noviembre, para que las actualizaciones lleguen antes que las fechas a las que afectan.

## Qué hay aquí

Diez herramientas, 80 páginas de ciudades, 1.448 conversiones entre pares de ciudades, 240 conversiones de abreviaturas y doce guías. Cada página generada lleva datos calculados para ese par concreto: la tabla horaria, las fechas del cambio de hora de ambas ciudades y las horas que los dos lugares comparten de verdad.

## Qué decide no hacer

- **Nada de rastreo.** Sin analítica, sin cookies, sin scripts de terceros.
- **Sin cuentas.** Las cuentas atrás y los planes de reunión viven en la URL, así que compartir un enlace es toda la función.
- **Sin datos inventados.** Donde una zona no tiene abreviatura en los datos de IANA se muestra el desfase, no una suposición con buena pinta. Donde no hay reseñas, no se afirma ninguna valoración.
- **Sin llamadas de red en tiempo de ejecución.** El amanecer y el atardecer se calculan a partir de la latitud y la longitud con el algoritmo solar de la NOAA, no se consultan a nadie.

## Correcciones

Si algo de aquí está mal, importa: todo el valor de una obra de consulta es que sea correcta. Los datos de contacto están en la [página de contacto](/es/contact/).
