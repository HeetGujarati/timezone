---
title: Accesibilidad
description: Qué se propone este sitio, qué se comprueba automáticamente y qué hacer si algo no te funciona.
order: 6
updatedAt: '2026-01-15'
---

Este sitio se propone cumplir el **nivel AA de las WCAG 2.2**. Las partes que pueden comprobarse automáticamente se comprueban en cada compilación, y la compilación falla si empeoran.

## Qué exige la compilación

- **Contraste de color.** Cada combinación de texto se contrasta con la relación 4,5:1 y cada indicador de foco con la de 3:1, en el tema claro y en el oscuro. La paleta se lee de la hoja de estilos en lugar de duplicarse en la prueba, así que cambiar un color dispara la comprobación.
- **Semántica del marcado.** El linter aplica reglas de accesibilidad a cada componente: faltas de etiqueta, ARIA inválido y elementos no interactivos con manejadores hacen fallar la compilación.
- **Nada de desbordamiento horizontal**, tampoco en la disposición de derecha a izquierda del árabe, comprobado en un navegador real.

## Decisiones de diseño

- **El color nunca es la única señal.** La jornada laboral del planificador lleva borde además de relleno; los avisos del cambio de hora son palabras, no solo un tono ámbar.
- **Los resultados se anuncian solos.** Cada zona de resultado es `aria-live="polite"`, de modo que una conversión se lee en voz alta al cambiar en vez de haber que buscarla.
- **Cada campo tiene una etiqueta de verdad.** En ningún sitio el marcador de posición hace de etiqueta.
- **El movimiento respeta tu preferencia.** Con `prefers-reduced-motion` activado se desactivan las animaciones y el desplazamiento suave.
- **Funciona sin JavaScript.** Cada desfase, cada fecha de cambio, cada tabla de referencia y cada explicación están en la página ya generada. Solo los relojes en vivo y las herramientas interactivas necesitan scripts, y los controles que no funcionarían sin ellos se ocultan en lugar de mostrarse muertos.
- **Las horas van en monoespaciada con cifras tabulares**, para que las columnas cuadren y un dígito que avanza no desplace el texto de al lado.

## Limitaciones conocidas

- La franja de 24 horas del planificador es una tabla ancha. Se desplaza horizontalmente dentro de su propio contenedor en vez de reorganizarse, porque una franja reorganizada deja de leerse como forma. La misma información está en texto en el resumen que la precede.
- Las pruebas automáticas detectan una minoría de los problemas de accesibilidad. Si algo de aquí no te funciona, es un error y queremos saberlo.

## Cómo avisarnos

Escribe a la dirección de la [página de contacto](/es/contact/) indicando la página y qué falló. Los avisos sobre tecnología de apoyo son especialmente valiosos, porque son lo más difícil de comprobar sin tener esa tecnología delante.
