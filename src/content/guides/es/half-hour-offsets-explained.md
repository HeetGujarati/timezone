---
title: "Por qué la India va media hora desfasada de UTC"
description: "Los desfases de media hora y de 45 minutos no son accidentes geográficos: son compromisos, afirmaciones de independencia y una broma burocrática."
summary: "La India va en UTC+05:30 porque partió la diferencia entre dos husos propuestos. Nepal va en UTC+05:45 en parte para no ser la India. Todo desfase inusual tiene una historia, y casi todas son políticas."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 12
keywords: ['por qué india media hora', 'nepal 45 minutos', 'huso horario de media hora', 'historia de la hora estándar de india']
related: ['offsets-that-are-not-whole-hours', 'how-time-zones-work', 'the-international-date-line']
---

La pregunta evidente sobre la hora estándar de la India es por qué no está a un número entero de horas de nada. La respuesta es que los husos horarios los deciden los gobiernos, y los gobiernos no optimizan para la comodidad de su biblioteca de fechas.

## La India: un país, dos husos naturales, un compromiso

La India abarca unos 29 grados de longitud, desde Guyarat al oeste hasta Arunachal Pradesh al este. Eso da para unas dos horas de tiempo solar. Por la lógica ordinaria de los husos horarios, la India debería tener dos.

Bajo el dominio británico prácticamente los tuvo. La hora de Bombay y la de Calcuta iban por separado, con unos 39 minutos de diferencia, y la de Madrás quedaba entre ambas como norma ferroviaria. Cuando la India se unificó tras la independencia en 1947, eligió un único huso en UTC+05:30: 82,5° este, el meridiano que pasa cerca de Mirzapur, casi exactamente entre los dos patrones antiguos.

El razonamiento fue la unidad nacional y la simplicidad administrativa, y el precio es real. En verano el sol sale en Arunachal Pradesh hacia las 04:00 y se pone hacia las 16:00, mientras las oficinas cumplen horarios fijados para Delhi. La industria del té de Assam lleva más de un siglo usando una «hora de Bagan» no oficial, una hora por delante, precisamente porque el reloj nacional no le sirve. Cada pocos años surgen propuestas de un segundo huso indio y cada vez se rechazan con los mismos argumentos.

## Nepal: cuarenta y cinco minutos de soberanía

Nepal está en UTC+05:45. Quince minutos por delante de la India, y el único huso del mundo con ese desfase.

La justificación geográfica es el Gaurishankar, una montaña al este de Katmandú usada como referencia meridiana nacional. La justificación política es que Nepal no es la India, y quince minutos son una forma barata y permanente de decirlo. Nepal pasó de UTC+05:30 a UTC+05:45 en 1986.

Las dos historias son ciertas, y los nepaleses le contarán una u otra según cómo formule la pregunta. Lo que importa en la práctica es que el desfase es exacto y permanente —Nepal no aplica horario de verano— y que muchísimo software se equivoca al redondearlo a +05:30 o a +06:00.

## Islas Chatham: 45 minutos y horario de verano

Las islas Chatham, a unos 800 kilómetros al este de Nueva Zelanda, van en UTC+12:45 en invierno y UTC+13:45 en verano. Allí viven unas 600 personas.

El desfase es aproximadamente solar: las islas quedan lo bastante al este de la Nueva Zelanda continental como para justificar esos 45 minutos de más. El horario de verano lo heredan de Nueva Zelanda, lo que convierte a las islas en uno de los dos únicos lugares de la Tierra con desfase de cuarto de hora y cambio estacional a la vez.

## Isla Lord Howe: el cambio estacional de 30 minutos

La isla Lord Howe, frente a la costa oriental de Australia, con unos 380 habitantes, está en UTC+10:30 en invierno y UTC+11:00 en verano. Cambia **treinta minutos**, y es el único lugar de la Tierra que lo hace.

El motivo fue la moderación. La isla quería un horario de verano acorde con el continente de Nueva Gales del Sur, pero una hora entera le pareció excesiva para un lugar tan pequeño, así que en 1981 partió la diferencia. El resultado es el mejor caso de prueba del mundo para el código que maneja fechas: cualquier biblioteca que fije un salto estacional de 60 minutos se equivoca en la isla Lord Howe y acierta en todas partes, de modo que superará todas las pruebas que usted escriba salvo esa.

## Los que ya no están

**Países Bajos: UTC+00:19:32,13.** De 1909 a 1937 los Países Bajos usaron el tiempo medio local de Ámsterdam, especificado al segundo. En 1937 se redondeó a +00:20 y en 1940 se abandonó en favor de la hora central europea. La base de datos de la IANA aún lo conserva, y por eso el motor de este sitio calcula los desfases en segundos y no en minutos: un entorno de ejecución al que se le pregunte por una fecha neerlandesa de 1920 responderá con ese valor, y redondearlo sería una pequeña mentira.

**Liberia: UTC-00:44:30.** Hasta 1972 Liberia iba 44 minutos y 30 segundos por detrás de Greenwich, el último país de la Tierra con un desfase que no era un número entero de minutos.

**Singapur: cinco cambios.** Singapur ha estado en +06:55:25, +07:00, +07:20, +07:30, +09:00 y ahora +08:00. Queda al oeste del meridiano que justificaría +08:00, y se queda ahí para ir a la par con Malasia, que cambió en 1982.

## El patrón

Ninguno de estos desfases tiene que ver con el sol. La India partió una diferencia política. Nepal afirmó su independencia. Singapur siguió a un socio comercial. Lord Howe llegó a un acuerdo consigo misma.

Que es el argumento a favor de la decisión de diseño que sostiene cada página de este sitio: **nunca calcule un desfase a partir de la longitud, y nunca guarde uno en una tabla que mantenga usted**. Pregunte a la base de datos de la IANA, que registra lo que cada gobierno decidió realmente, incluidas las decisiones que no tienen ningún sentido astronómico, porque son justo esas las que viven sus usuarios.

## La declaración de treinta minutos de Corea del Norte

En agosto de 2015, Corea del Norte atrasó sus relojes 30 minutos, de UTC+09:00 a UTC+08:30, y llamó al resultado hora de Pionyang. La razón declarada fue deshacer un cambio impuesto durante la ocupación japonesa, que había alineado Corea con Tokio.

El efecto práctico fue que Corea del Norte y Corea del Sur, que compartían reloj desde 1961, quedaron separadas por 30 minutos.

En mayo de 2018, tras la cumbre intercoreana de Panmunjom, Corea del Norte volvió a UTC+09:00. El anuncio lo describió como un primer paso práctico hacia la reunificación, y durante las conversaciones los relojes de la Casa de la Paz habían mostrado ambas horas una junto a otra.

Dos publicaciones de tzdata separadas por tres años, para un cambio que nada tenía que ver con el sol y todo con la política. Ese es el caso normal, no la excepción.

## La media hora de Venezuela y su marcha atrás

En diciembre de 2007 Venezuela pasó de UTC-04:00 a UTC-04:30, un desplazamiento de media hora que el gobierno presentó como una forma de dar a los niños más luz de camino a la escuela. En mayo de 2016 volvió atrás, esta vez planteado como medida de ahorro energético durante una grave crisis eléctrica.

Nueve años en un desfase inusual y vuelta atrás. Cualquier sistema que hubiera codificado el desfase de Venezuela como una constante tuvo que cambiarse dos veces.

## La lección para quien almacene tiempo

No son casos límite en el sentido de ser raros. Entre todos, esta guía ha descrito cambios de desfase en Nepal, Samoa, Tokelau, Corea del Norte, Venezuela, Turquía, Rusia, Irán, México, Brasil y Egipto, todos dentro de la memoria de los vivos y la mayoría en las últimas dos décadas.

La base de datos de la IANA absorbe cada uno de ellos en una publicación. Una tabla fija no absorbe ninguno, falla en silencio, y el fallo parece un error de planificación de una persona en lugar de un defecto del programa.
