---
title: "Accessibilité"
description: "Ce que ce site vise, ce qui est vérifié automatiquement, et quoi faire si quelque chose ne fonctionne pas pour vous."
order: 6
updatedAt: '2026-01-15'
---

Ce site vise le **niveau AA des WCAG 2.2**. Les parties qui peuvent être vérifiées automatiquement le sont à chaque compilation, et la compilation échoue si elles régressent.

## Ce que la compilation impose

- **Contraste des couleurs.** Chaque association de texte est vérifiée face au rapport 4,5:1 et chaque indicateur de focus face au rapport 3:1, en thème clair comme en thème sombre. La palette est lue dans la feuille de style plutôt que recopiée dans le test, si bien que changer une couleur déclenche la vérification.
- **Sémantique du balisage.** Le linter applique des règles d’accessibilité à chaque composant : libellés manquants, ARIA invalide et éléments non interactifs porteurs de gestionnaires font échouer la compilation.
- **Aucun débordement horizontal**, y compris dans la mise en page de droite à gauche en arabe, vérifié dans un vrai navigateur.

## Choix de conception

- **La couleur n’est jamais le seul signal.** Les heures ouvrées du planificateur portent une bordure en plus d’un fond ; les avertissements de changement d’heure sont des mots, pas seulement une teinte ambrée.
- **Les résultats s’annoncent d’eux-mêmes.** Chaque zone de résultat est en `aria-live="polite"`, de sorte qu’une conversion est lue à voix haute quand elle change, au lieu de devoir être cherchée.
- **Chaque champ a un vrai libellé.** Nulle part un texte indicatif ne tient lieu de libellé.
- **Le mouvement respecte votre préférence.** Avec `prefers-reduced-motion`, les animations et le défilement fluide sont désactivés.
- **Cela fonctionne sans JavaScript.** Chaque décalage, chaque date de changement, chaque tableau de référence et chaque explication figurent dans la page prégénérée. Seules les horloges en direct et les outils interactifs ont besoin de scripts, et les commandes qui ne marcheraient pas sans eux sont masquées plutôt qu’affichées inertes.
- **Les heures sont en chasse fixe avec des chiffres tabulaires**, pour que les colonnes s’alignent et qu’un chiffre qui défile ne décale jamais le texte voisin.

## Limites connues

- La bande de 24 heures du planificateur est un tableau large. Elle défile horizontalement dans son propre conteneur au lieu d’être réagencée, car une bande réagencée cesse de se lire comme une forme. La même information figure en texte dans le résumé qui la précède.
- Les tests automatiques ne repèrent qu’une minorité des problèmes d’accessibilité. Si quelque chose ici ne fonctionne pas pour vous, c’est un défaut et nous aimerions le savoir.

## Nous prévenir

Écrivez à l’adresse indiquée sur la [page de contact](/fr/contact/), en précisant la page et ce qui a échoué. Les signalements portant sur les technologies d’assistance sont particulièrement précieux, car ce sont les plus difficiles à vérifier sans avoir la technologie sous la main.
