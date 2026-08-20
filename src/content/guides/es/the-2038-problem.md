---
title: 'El problema del 2038, explicado como corresponde'
description: 'A las 03:14:07 UTC del 19 de enero de 2038, el tiempo Unix de 32 bits con signo se desborda. Esto es lo que se rompe de verdad y lo que ya está arreglado.'
summary: 'Los sistemas que guardan el tiempo como una cuenta de segundos de 32 bits con signo se quedan sin espacio en enero de 2038 y saltan a diciembre de 1901. Casi todas las plataformas modernas lo arreglaron hace años; la exposición está hoy en lo embebido, lo heredado y los datos serializados.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 6
keywords: ['problema 2038', 'bug del año 2038', 'desbordamiento timestamp unix', 'y2038']
related: ['time-zones-in-code', 'iso-8601-explained', 'what-utc-really-is']
---

A las 03:14:07 UTC del 19 de enero de 2038, el número de segundos transcurridos desde el 1 de enero de 1970 llega a 2 147 483 647. Es el mayor valor que cabe en un entero de 32 bits con signo. Un segundo después salta a −2 147 483 648, que esos sistemas leen como 13 de diciembre de 1901.

Es un problema real con una fecha firme, lo que lo vuelve raro entre los problemas de software.

## Por qué 32 bits

El tiempo Unix se diseñó a comienzos de los años setenta, cuando un entero de 32 bits era el tamaño de palabra natural y 68 años de margen parecían generosos. El tipo `time_t` en aquellos sistemas era un entero de 32 bits con signo, y esa elección se propagó a C, a todos los lenguajes que envolvieron C, a formatos de fichero, a protocolos de red y a esquemas de base de datos.

El signo es lo que da al desbordamiento su síntoma característico. Una cuenta de 32 bits sin signo duraría hasta 2106; una con signo parte su rango alrededor de 1970, así que el desbordamiento aterriza en 1901 y no en cero.

## Lo que ya ha pasado

El problema del 2038 lleva años fallando en producción, porque el software calcula fechas futuras de forma rutinaria.

- Los cálculos de hipotecas a treinta años empezaron a cruzar la frontera en 2008.
- Fechas de caducidad de certificados, tiempos de vida de caché y trabajos programados han tropezado con él repetidamente.
- En 2006, un fallo en el tiempo de espera de base de datos por defecto de AOLserver —fijado en mil millones de segundos, algo que estuvo bien hasta que dejó de estarlo— tumbó el software cuando la caducidad calculada se desbordó.

El patrón es que el fallo llega mucho antes que la fecha, en el código que mira más lejos.

## Lo que ya está arreglado

La situación es bastante mejor de lo que sugiere el pánico.

- **Sistemas de 64 bits**: `time_t` tiene 64 bits en prácticamente toda plataforma de 64 bits. Eso se agota dentro de unos 292 000 millones de años.
- **Linux en 32 bits**: el núcleo 5.6 (marzo de 2020) introdujo `time_t` de 64 bits en arquitecturas de 32 bits, y las distribuciones principales han publicado el espacio de usuario correspondiente.
- **JavaScript**: usa un flotante de doble precisión para milisegundos, válido unos 275 000 años a cada lado de 1970. Nunca ha tenido este problema.
- **Java**: `Instant` usa una cuenta de segundos de 64 bits más nanosegundos.
- **Python**: los enteros son de precisión arbitraria; la restricción es la biblioteca C de la plataforma.
- **PostgreSQL, MySQL 8.0.28 y posteriores, SQL Server**: almacenamiento de marcas temporales de 64 bits.

## Dónde sigue la exposición

**Sistemas embebidos.** Controladores industriales, dispositivos médicos, electrónica de vehículos, contadores y sensores; muchos diseñados para vidas de servicio de 20 o 30 años, muchos sin vía de actualización, muchos ya desplegados. Aquí está el grueso del riesgo real, y no hay ningún registro central.

**El tipo `TIMESTAMP` de MySQL anterior a 8.0.28.** Es una cuenta de segundos de 32 bits y su máximo documentado es 2038-01-19 03:14:07. `DATETIME` nunca estuvo afectado. Hay muchísimos datos de producción en el tipo de columna afectado.

**Datos serializados y formatos de fichero.** Todo lo que escribió un campo de tiempo de 32 bits sigue siendo un campo de 32 bits por moderno que sea quien lo lee. Formatos de archivo antiguos, protocolos binarios y estructuras en disco arrastran la restricción hacia adelante.

**Compilaciones de 32 bits todavía en servicio.** Algunos enrutadores, decodificadores y aparatos de vida larga ejecutan espacio de usuario de 32 bits contra un núcleo sin parchear.

## Qué hacer al respecto

**Audita los tipos de almacenamiento.** Busca columnas `int(11)` que guarden marcas temporales, `TIMESTAMP` de MySQL en versiones antiguas y cualquier formato binario con un campo de tiempo de 32 bits. Ahí es donde los datos sobreviven al código.

**Prueba con fechas posteriores a 2038.** Pon un dato de prueba en 2040 y ejecuta tu batería. Casi todos los fallos de 2038 son triviales de reproducir en cuanto alguien lo intenta.

**Prefiere enteros de 64 bits o cadenas ISO 8601.** Un `BIGINT` de milisegundos o una columna `TIMESTAMPTZ` no tiene un horizonte que merezca pensarse. Una cadena ISO 8601 no tiene ninguno, a costa de tamaño y velocidad de comparación.

**No vuelvas a guardar fechas en nada de 32 bits, nunca.** El ahorro de espacio es irrelevante en hardware moderno y el horizonte ya cae dentro de la vida útil del software corriente.

## Los otros horizontes de fecha

2038 es el cercano, no el único.

- **2036**: el campo de era de 32 bits de NTP da la vuelta el 7 de febrero. NTPv4 lo maneja, pero los despliegues varían.
- **2106**: se desbordan las cuentas de segundos de 32 bits sin signo.
- **2262**: se desbordan las cuentas de _nanosegundos_ de 64 bits, que es `time.Time` de Go en su representación de nanosegundos y el `datetime64[ns]` por defecto de pandas.

Ese último está más cerca de lo que parece para quien escribe código de procesamiento de datos, y es el mismo error a otra escala: una unidad lo bastante fina para ser útil, en una anchura que en su momento pareció generosa.

## Cómo revisar tus propios sistemas

Cuatro comprobaciones, en orden creciente de esfuerzo.

**Revisa los tipos de columna de tu base de datos.** En PostgreSQL, `SELECT column_name, data_type FROM information_schema.columns WHERE data_type LIKE '%timestamp%'` te dice lo que tienes; `timestamp with time zone` es de 64 bits y está a salvo. En MySQL, busca columnas `TIMESTAMP` en servidores anteriores a 8.0.28: esas son las expuestas, y `DATETIME` nunca lo estuvo.

**Adelanta un reloj.** En un contenedor desechable, pon la fecha del sistema en 2040 y ejecuta tu batería de pruebas. Es tosco y encuentra una cantidad sorprendente, porque casi ningún fallo de 2038 es sutil una vez pasada la frontera.

**Busca tipos de tiempo de 32 bits.** En C y C++, cualquier `int` o `long` explícito que contenga un valor de tiempo en un destino de 32 bits. En esquemas de serialización, cualquier campo de tiempo de 4 bytes. En el código de aplicación, cualquier punto donde una marca temporal se convierta a entero de 32 bits para guardarla o transmitirla.

**Prueba el futuro lejano en los datos de prueba, no solo el cercano.** Una prueba que usa «ahora más un día» pasará hasta 2038 y luego fallará un martes. Una prueba que usa una fecha explícita de 2040 falla hoy, mientras hay alguien disponible para arreglarlo.

## Qué no hacer

No «resuelvas» esto pasándote a enteros de 32 bits sin signo. Compra 68 años, pierde la capacidad de representar cualquier fecha anterior a 1970 y traslada la misma conversación a quien mantenga el sistema en 2106. La diferencia entre 4 y 8 bytes no vale una segunda migración.

No des por hecho que un lenguaje moderno te protege. El código de aplicación puede ser perfectamente seguro mientras los datos que lee los escribió algo que no lo era: los formatos de fichero y los protocolos de red arrastran la restricción a través de cada reescritura.
