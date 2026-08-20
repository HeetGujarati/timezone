---
title: 'Husos horarios en el código, una guía práctica'
description: 'Guarde UTC, conserve el identificador del huso, convierta al mostrar, no construya nunca una tabla de desfases. Las reglas y el razonamiento de cada una.'
summary: 'Casi todo error de husos horarios se remonta a uno de cuatro fallos. Esto es lo que hay que hacer en su lugar, en JavaScript, Python, Java, Go y SQL, con el razonamiento y no solo la regla.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 9
keywords:
  [
    'husos horarios en el código',
    'buenas prácticas de fecha y hora',
    'almacenar marcas de tiempo',
    'utc en la base de datos',
  ]
related: ['what-utc-really-is', 'iso-8601-explained', 'the-2038-problem']
---

Casi todo error de husos horarios en producción se remonta a uno de cuatro fallos: guardar una hora local, guardar un desfase en vez de un huso, convertir en la capa equivocada o construir a mano una tabla de desfases. Todo lo que sigue se deduce de evitarlos.

## Regla 1: guarde instantes en UTC

Un instante es un punto en la línea del tiempo. Una hora local es una lectura de reloj, que necesita un huso y una política de desambiguación antes de significar algo.

```sql
-- Bien: un instante
created_at TIMESTAMPTZ NOT NULL

-- Mal: una lectura de reloj sin huso
created_at TIMESTAMP NOT NULL
```

El `TIMESTAMPTZ` de PostgreSQL no guarda un huso: normaliza a UTC al escribir y convierte al leer. Es justo lo que quiere para «cuándo ocurrió esto».

## Regla 2: guarde el identificador del huso, no el desfase

Si necesita saber _dónde_ —para un evento periódico, una preferencia de usuario, el horario de un negocio— guarde `Europe/London`, no `+01:00`.

Un desfase es un hecho sobre un instante. Un huso es un conjunto de reglas que sobrevive a que un gobierno cambie de opinión. Gran Bretaña está en `+00:00` en enero y en `+01:00` en julio; guardar cualquiera de los dos y llamarlo «el huso del usuario» es erróneo la mitad del año.

```sql
event_start_local  TIMESTAMP   NOT NULL,  -- la hora de reloj que eligieron
event_time_zone    TEXT        NOT NULL,  -- 'Europe/London'
event_start_utc    TIMESTAMPTZ NOT NULL   -- instante resuelto, recalculado si cambian las reglas
```

Para un evento periódico, la hora local y el huso son la fuente de verdad; el instante en UTC es un índice derivado. Si cambia tzdata —y cambia varias veces al año— la columna derivada se regenera y las 09:00 del usuario siguen siendo las 09:00.

## Regla 3: convierta en el borde

La lógica de negocio trabaja con instantes. La conversión a una hora local legible ocurre en el último momento posible, en la capa que sabe quién está leyendo.

El corolario importa más: **nunca deje que el huso del propio servidor se filtre en el comportamiento.** Ponga `TZ=UTC` en su entorno de despliegue y trate como defecto cualquier camino de código cuyo resultado dependa de la configuración regional del servidor. Es la clase de fallo que solo aparece cuando alguien despliega en una segunda región.

## Regla 4: no construya nunca una tabla de desfases

Todo entorno de ejecución incluye la base de datos de la IANA. Úsela.

**JavaScript**

```js
// Formatear en un huso
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

// Obtener un desfase sin biblioteca: comparar el reloj del huso con UTC
function offsetMinutes(timeZone, instant) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return (asUtc - Math.floor(instant / 1000) * 1000) / 60000;
}
```

Ponga `hourCycle: 'h23'` de forma explícita. Algunas versiones de ICU informan la medianoche como hora 24 bajo `en-US`, lo que corre la fecha un día y es un error genuinamente desdichado de encontrar.

**Python**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo  # biblioteca estándar desde 3.9

now = datetime.now(timezone.utc)
local = now.astimezone(ZoneInfo("Asia/Kathmandu"))
```

No use nunca `datetime.utcnow()`. Devuelve una fecha ingenua que _parece_ UTC pero no lleva huso, y mezclarla con fechas conscientes lanza una excepción en el peor momento. La llamada correcta es `datetime.now(timezone.utc)`.

**Java**

```java
Instant now = Instant.now();
ZonedDateTime local = now.atZone(ZoneId.of("Asia/Kathmandu"));
```

`java.time` está bien diseñado: `Instant` para puntos en la línea del tiempo, `LocalDateTime` para lecturas de reloj sin huso, `ZonedDateTime` para ambos juntos. El sistema de tipos impone la distinción en la que esta guía insiste.

**Go**

```go
loc, _ := time.LoadLocation("Asia/Kathmandu")
local := time.Now().In(loc)
```

`LoadLocation` lee la tzdata del sistema. En un contenedor vacío no hay ninguna: importe `_ "time/tzdata"` para incrustarla en el binario, o toda consulta de huso caerá en silencio a UTC.

## Los dos días del año

El adelanto borra una hora; el retraso repite una. Elija una política, aplíquela con constancia y diga al usuario qué hizo:

- **Hora local inexistente** (02:30 en la fecha de primavera de EE. UU.): adelantar el tamaño del hueco, de modo que 02:30 pase a 03:30.
- **Hora local ambigua** (01:30 en la fecha de otoño de EE. UU.): tomar la primera ocurrencia, la más temprana.

Esas son las políticas que usa este sitio, y coinciden con el valor por omisión `disambiguation: 'compatible'` de `Temporal` en ECMAScript, algo que vale la pena igualar para que su comportamiento concuerde con la plataforma.

El hueco no siempre es de una hora. La isla Lord Howe se desplaza 30 minutos, así que lea el tamaño de la transición en vez de suponerlo.

## Pruebas

Cuatro casos atrapan casi todo:

1. **Un huso de media hora** — `Asia/Kolkata` (+05:30). Atrapa las suposiciones de horas enteras.
2. **Un huso de 45 minutos** — `Asia/Kathmandu` (+05:45). Atrapa las suposiciones de media hora.
3. **Un huso del hemisferio sur** — `Australia/Sydney`. Atrapa el «verano quiere decir junio».
4. **La isla Lord Howe** — `Australia/Lord_Howe`. Atrapa el salto de 60 minutos fijado en el código, y no lo hará nada más.

Añada una fecha de adelanto y otra de retraso por cada huso en el que estén realmente sus usuarios, y fije la versión de tzdata en la integración continua para que una actualización de la base no haga fallar una compilación por el motivo equivocado.

## Los eventos periódicos son otro problema

Un evento único es un instante. Un evento periódico es una regla, y los dos necesitan almacenamiento distinto.

«Todos los martes a las 09:00 en Europe/London» no es «cada 604800 segundos desde este instante». Ambos divergen en cuanto Gran Bretaña cambia sus relojes: la regla mantiene la reunión a las 09:00 locales, mientras que el intervalo la arrastra a las 08:00 o a las 10:00.

Guarde la regla —hora local, identificador del huso, patrón de repetición— y materialice instantes a partir de ella. Cuando cambie tzdata, regenere los instantes materializados; no los migre. La regla es a lo que el usuario dio su consentimiento.

Los casos incómodos se siguen de las dos discontinuidades anuales. Una reunión a las 02:30 todos los días descubrirá que en un día de primavera esa hora no existe y que en un día de otoño ocurre dos veces. Elija una política, aplíquela con constancia y tenga presente que distintos sistemas de calendario han elegido distintas, razón por la cual el mismo evento periódico puede aparecer con una hora de diferencia en dos calendarios exactamente dos días al año.

## Una nota sobre `Temporal`

La interfaz `Temporal` de ECMAScript sustituye a `Date` por tipos que distinguen instantes, horas de reloj y fechas con huso, al modo de `java.time`. `Temporal.ZonedDateTime` lleva un identificador de huso; `Temporal.Instant` es un punto en la línea del tiempo; `Temporal.PlainDateTime` es una lectura de reloj sin huso, y el sistema de tipos le impide confundirlos.

Su opción `disambiguation` expone justo la política de los dos días al año a la que esta guía vuelve una y otra vez: `'compatible'` (el valor por omisión: adelantar a través de los huecos, tomar la más temprana de un par ambiguo), `'earlier'`, `'later'` y `'reject'`. La última merece considerarse en todo aquello donde quedarse una hora corto en silencio sea peor que un error.
