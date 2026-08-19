---
title: "ISO 8601, o cómo escribir una fecha sin ambigüedad"
description: "03/04/2026 significa dos fechas distintas según quién lo lea. ISO 8601 lo resuelve, y vale la pena conocer sus reglas con exactitud."
summary: "ISO 8601 existe porque 03/04/2026 es marzo en Estados Unidos y abril en el resto del mundo. Escribir 2026-04-03 elimina la ambigüedad, ordena bien como texto y es lo que toda interfaz debería aceptar."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 7
keywords: ['iso 8601', 'formato de fecha estándar', 'formato de marca temporal', 'rfc 3339']
related: ['what-utc-really-is', 'time-zones-in-code', 'the-2038-problem']
---

`03/04/2026` es el 3 de abril en casi todo el mundo y el 4 de marzo en Estados Unidos. No hay forma de saber cuál se quiso decir a partir de la cadena, y ambas lecturas son perfectamente razonables. Cada año esa ambigüedad produce plazos incumplidos, reservas duplicadas y al menos una caída memorable.

ISO 8601 es la norma internacional que la elimina.

## El formato básico

```
2026-04-03T14:30:00Z
```

Leyendo de izquierda a derecha, de la unidad mayor a la menor:

- `2026-04-03` — año, mes, día, cada uno con ceros a la izquierda, siempre en ese orden
- `T` — el separador entre fecha y hora, obligatorio en la forma estricta
- `14:30:00` — horas, minutos, segundos en reloj de 24 horas
- `Z` — el designador de zona. `Z` significa UTC exactamente

El orden es lo esencial. Como los componentes van de lo más significativo a lo menos, **una cadena ISO 8601 se ordena correctamente como texto plano**. `2026-04-03` va antes que `2026-04-10` en una comparación de cadenas simple, cosa que ningún otro formato común consigue. Solo esa propiedad justifica la norma.

## Designadores de zona

Tres formas son válidas, y significan cosas distintas:

| Forma                       | Significado                                                            |
| --------------------------- | ---------------------------------------------------------------------- |
| `2026-04-03T14:30:00Z`      | 14:30 UTC. Sin ambigüedad                                               |
| `2026-04-03T14:30:00+05:45` | 14:30 hora local en una zona 5 h 45 min por delante de UTC. Sin ambigüedad |
| `2026-04-03T14:30:00`       | 14:30 en una zona no especificada. **No es una marca temporal**          |

La tercera forma es la que da problemas. Es una _fecha y hora locales_: una lectura de reloj sin manera de situarla en una línea temporal. Pasarla a través de una frontera de sistema esperando que el otro lado suponga la misma zona que tú es un fallo esperando a un despliegue en otra región.

Fíjate también en lo que un desfase no es: `+05:45` te dice el desfase de Nepal, no que la marca temporal sea de Nepal. Los desfases no son zonas: varias zonas comparten el mismo desfase, y el desfase de una zona cambia. Lleva el identificador aparte si necesitas saber dónde.

## RFC 3339, el perfil que probablemente quieres

ISO 8601 es grande. Permite fechas de semana (`2026-W14-5`), fechas ordinales (`2026-093`), unidades fraccionarias y una forma truncada que omite el siglo. Casi nada de eso es lo que quieres en una interfaz.

RFC 3339 es un perfil endurecido para protocolos de internet. Exige la fecha completa, exige un designador de zona y permite como separador tanto `T` como un espacio. Cuando alguien dice «formato ISO» hablando de una API, casi siempre quiere decir RFC 3339.

**Una regla útil:** acepta todo lo que trague un buen analizador; emite solo RFC 3339 estricto con `Z`.

## Duraciones e intervalos

Menos usados, y conviene conocerlos cuando aparecen.

Las **duraciones** empiezan por `P` de periodo, y `T` separa la parte de fecha de la de hora:

- `P3Y6M4D` — tres años, seis meses, cuatro días
- `PT1H30M` — una hora treinta minutos
- `P1DT12H` — un día doce horas

La `T` no es opcional: `P1M` es un mes, `PT1M` es un minuto. Ese es el fallo clásico con las duraciones ISO 8601.

Los **intervalos** unen dos puntos con una barra: `2026-04-03T14:00Z/2026-04-03T16:00Z`, o un punto y una duración: `2026-04-03T14:00Z/PT2H`.

Los datos estructurados `HowTo` de este sitio usan la sintaxis de duración —`PT2M` para una tarea de dos minutos— porque schema.org especifica duraciones ISO 8601.

## Fechas de semana, y la trampa que esconden

`2026-W14-5` es el viernes de la decimocuarta semana ISO de 2026. Las semanas ISO empiezan en lunes, y la semana 1 es la que contiene el primer jueves de enero.

La consecuencia con la que tropieza la gente: **el año de semana ISO no siempre es el año natural.** El 1 de enero de 2027 cae en la semana ISO 53 de 2026. El código de formato que empareja un número de semana ISO con un año natural produce una fecha equivocada durante unos días cada año, y en casi todos los lenguajes los especificadores de formato se parecen muchísimo (`YYYY` frente a `GGGG`, o `%Y` frente a `%G`).

## Reglas prácticas

1. **Guarda en UTC, emite `Z`.** `2026-04-03T14:30:00Z` tiene exactamente un significado en todas partes.
2. **Nunca emitas una fecha y hora locales sin zona a través de una frontera.** Si no puedes adjuntar una zona, no tienes una marca temporal.
3. **Rellena con ceros todo.** `2026-4-3` no es ISO 8601 válido, aunque la mayoría de los analizadores lo acepte.
4. **Usa los separadores `-` y `:`.** La forma compacta (`20260403T143000Z`) es legal pero hostil, y algunos analizadores la rechazan.
5. **Lleva el identificador de zona aparte** cuando necesites saber _dónde_ y no solo _qué desfase_. `Europe/London` sobrevive a un cambio de reglas; `+01:00` no.

## Trampas al analizar

Incluso con una norma, el análisis es donde las cosas se tuercen.

**El constructor `Date` de JavaScript es incoherente con entradas no ISO.** `new Date('2026-04-03')` se interpreta como medianoche UTC. `new Date('2026-04-03T00:00:00')` —sin designador de zona— se interpreta como medianoche _local_. Las dos difieren en tu desfase, lo que significa que el mismo código produce días distintos según dónde se ejecute. Incluye siempre un designador de zona.

**Los años de dos cifras son ambiguos y deberían rechazarse.** ISO 8601 permite una forma truncada; casi nada debería aceptarla. `26-04-03` podría ser 1926 o 2026, y la ventana deslizante que lo resuelve es una decisión de política escondida dentro de un analizador.

**Los segundos fraccionarios varían en precisión.** `14:30:00.5`, `14:30:00.500` y `14:30:00.500000` son todos válidos y todos el mismo instante. Un analizador que compare cadenas en vez de instantes no estará de acuerdo.

**La coma es legal.** ISO 8601 permite `14:30:00,5` —coma decimal— y de hecho la prefiere. Casi todos los analizadores la rechazan. Si consumes datos de un sistema europeo, prepárate.

**La medianoche tiene dos escrituras.** `24:00:00` de un día es el mismo instante que `00:00:00` del siguiente, y ambas son ISO 8601 válido. Emite la segunda forma; acepta las dos.

## Una nota sobre la ordenación

La ordenabilidad de ISO 8601 solo se sostiene para cadenas con la misma representación de zona. `2026-04-03T14:00:00Z` y `2026-04-03T10:00:00-05:00` son el mismo instante, pero como cadenas la segunda ordena antes.

Si ordenas marcas temporales como texto —en un registro, en un nombre de fichero, en una columna de base de datos tipada como texto— normalízalas todas antes a UTC con `Z`. Si no, el orden es una propiedad del formato y no del tiempo.
