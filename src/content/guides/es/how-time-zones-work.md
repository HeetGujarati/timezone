---
title: "Cómo funcionan de verdad las zonas horarias"
description: "Las zonas horarias son un artefacto político superpuesto a un problema geográfico. Aquí está el mecanismo y por qué el software se equivoca."
summary: "Una zona horaria no es una franja del globo: es un conjunto de reglas con nombre sobre lo que ha marcado, marca y está previsto que marque un reloj en un lugar concreto. Esa distinción es todo el asunto."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 1
keywords:
  ['cómo funcionan las zonas horarias', 'zonas horarias explicadas', 'qué es una zona horaria', 'base de datos iana']
related: ['what-utc-really-is', 'why-est-is-ambiguous', 'time-zones-in-code']
---

Pregunta a casi cualquiera qué es una zona horaria y te describirá una franja vertical en un mapa: el mundo dividido en veinticuatro porciones iguales, separadas por una hora, gobernadas por la longitud. Ese modelo es ordenado, fácil de recordar y equivocado de una manera que acabará costándote una reunión.

Una zona horaria es un **conjunto de reglas con nombre**, mantenido por un gobierno, sobre lo que marcan los relojes en un territorio concreto. Las reglas pueden cambiar. Cambian por motivos políticos, por motivos económicos y, de vez en cuando, con quince días de aviso. La longitud es donde empezó la idea; no es donde terminó.

## De dónde salió la idea

Antes de la década de 1880 cada pueblo mantenía su propia hora, fijada por el mediodía local: el momento en que el sol cruzaba el meridiano de encima. Bristol iba diez minutos por detrás de Londres, y a nadie le importaba, porque nada viajaba lo bastante rápido como para que diez minutos contaran.

El ferrocarril cambió eso. Un horario que dice que un tren sale a las 10:15 no sirve de nada si las 10:15 significan cosas distintas en cada extremo de la línea, y ya en los años cuarenta del siglo XIX las compañías ferroviarias británicas habían impuesto sencillamente la hora de Londres a toda su red. Estados Unidos siguió en 1883, con los ferrocarriles partiendo el país en cuatro zonas por decisión propia. La Conferencia Internacional del Meridiano de 1884 convirtió Greenwich en el meridiano de origen y dio al mundo una referencia común desde la que medir.

Lo importante de esa historia es que las zonas horarias se inventaron para resolver un problema de coordinación, y las inventaron las organizaciones que tenían ese problema. Nunca fueron una descripción de dónde está el sol.

## Qué contiene realmente una zona

El registro autorizado es la **base de datos de zonas horarias IANA**, también llamada tzdata o base de Olson. Es un fichero de texto, se actualiza varias veces al año, y todos los sistemas operativos, navegadores y lenguajes de programación que usas están leyendo alguna versión de él.

De cada zona guarda:

- un identificador, como `America/New_York` o `Asia/Kathmandu`
- el desfase respecto a UTC que se aplicó en cada periodo de la historia de esa zona
- las reglas de cuándo cambia ese desfase, si es que cambia
- una abreviatura para cada periodo, cuando existe

Los identificadores siguen el convenio `Área/Localidad`, y la localidad es una ciudad representativa en lugar de un país, porque los países se dividen, se unen y cambian sus reglas al margen de sus fronteras. `America/Argentina/Buenos_Aires` existe porque las provincias argentinas llegaron a mantener horas distintas entre sí.

Fíjate en lo que una zona no es: no es un desfase. `America/New_York` no es «UTC-5». Es una zona cuyo desfase es UTC-5 parte del año y UTC-4 el resto, que estuvo en UTC-5 todo el año durante la Segunda Guerra Mundial y que usaba otro juego de reglas antes de 1966. Guardar «UTC-5» y llamarlo Nueva York es, con diferencia, el error de zonas horarias más común del software.

## Las reglas cambian, y no poco a poco

En 2016 Turquía abandonó el horario de verano con unas tres semanas de aviso y se quedó en UTC+3 de forma permanente. En 2018 Corea del Norte movió sus relojes 30 minutos para volver a alinearse con el Sur. En 2022 Irán abolió el horario de verano; ese mismo año México lo suprimió en casi todo el país. Egipto lo reinstauró en 2023 tras haberlo abolido en 2014.

Cada uno de esos cambios fue una publicación de tzdata, y cada uno rompió todos los sistemas con una tabla de desfases escrita a mano. Por eso el motor que hay detrás de cada página de este sitio lee los desfases de la copia de tzdata del entorno de ejecución y no de nada guardado aquí. Una recompilación recoge las reglas nuevas; no hay nada que editar.

## Por qué no todos los desfases son horas enteras

Alrededor de una quinta parte de la población mundial vive con un desfase que no es un número entero de horas respecto a UTC. India está en UTC+05:30, elegido como zona única de compromiso para un país lo bastante ancho como para justificar dos. Nepal está en UTC+05:45, con esos cuarenta y cinco minutos en parte para afirmar su independencia de la hora india. Las islas Chatham están en UTC+12:45. Terranova, en UTC-03:30.

El software que da por hecho que los desfases son horas enteras no se limita a redondear: produce respuestas equivocadas por 30 o 45 minutos para cientos de millones de personas, que es exactamente el tamaño de error que se descubre en la llamada y no antes.

## Los dos días al año en que la hora local no es una función

El horario de verano crea dos discontinuidades anuales, y son la razón de que «convertir esta hora local» sea más difícil de lo que parece.

**Adelantar borra una hora.** En Nueva York, el día del cambio, a las 01:59:59 le siguen inmediatamente las 03:00:00. La hora local 02:30 no ocurre. Si alguien la escribe, no hay ningún instante correcto que devolver: solo políticas sobre qué devolver en su lugar.

**Atrasar repite una hora.** La 01:30 ocurre dos veces, una en horario de verano y otra una hora después en horario estándar. Una hora local por sí sola es genuinamente ambigua; hace falta saber a qué aparición se refería, y casi ninguna interfaz lo pregunta.

Todas las herramientas de este sitio resuelven ambos casos de forma explícita y te dicen qué hicieron. Elegir uno en silencio es como una entrada de calendario acaba desviada una hora sin que nadie se entere hasta la llamada.

## Qué significa esto en la práctica

Del mecanismo se derivan tres reglas, y cubren casi todo lo que sale mal:

1. **Guarda instantes, no horas locales.** Una marca temporal en UTC no es ambigua. Una hora local es una marca temporal más una zona más una política para los dos días incómodos.
2. **Guarda el identificador de zona, no el desfase.** `Europe/London` sobrevive a un cambio de reglas; `UTC+0` no, y además está equivocado la mitad del año.
3. **Convierte al mostrar, usando la tzdata del entorno.** No al guardar, y nunca desde una tabla que mantengas tú.

La razón de que este sitio insista en «según la última compilación» al hablar de desfases, y calcule las horas actuales en tu navegador, es exactamente la misma. Las reglas no son nuestras para congelarlas.
