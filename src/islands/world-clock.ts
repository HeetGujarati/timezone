import { readStoredJson, writeStoredJson } from './lib/params.ts';

/**
 * World clock search and pinning.
 *
 * Every city is already in the prerendered HTML — this element filters what is
 * already there rather than fetching or building rows, so the page is complete and
 * indexable without JavaScript and the search is instant with it.
 */

const STORAGE_KEY = 'meridiem-pinned-cities';
const MAX_PINS = 24;

function validatePins(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  return value
    .filter(
      (entry): entry is string => typeof entry === 'string' && /^[a-z0-9-]{2,40}$/.test(entry),
    )
    .slice(0, MAX_PINS);
}

/** Fold accents so "sao paulo" finds "São Paulo" and "zurich" finds "Zürich". */
function fold(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

class WorldClock extends HTMLElement {
  #pins: string[] = [];
  #rows: HTMLElement[] = [];

  connectedCallback(): void {
    const search = this.querySelector('[data-role="search"]');
    const empty = this.querySelector('[data-role="empty"]');

    this.#rows = [...this.querySelectorAll('[data-city]')].filter(
      (element): element is HTMLElement => element instanceof HTMLElement,
    );
    this.#pins = readStoredJson(STORAGE_KEY, validatePins) ?? [];

    for (const row of this.#rows) {
      const button = row.querySelector('[data-role="pin"]');
      if (button instanceof HTMLButtonElement) {
        button.hidden = false;
        button.addEventListener('click', () => this.#togglePin(row.dataset['city'] ?? ''));
      }
    }

    if (search instanceof HTMLInputElement) {
      search.addEventListener('input', () => {
        const query = fold(search.value.trim());
        let visible = 0;
        for (const row of this.#rows) {
          const haystack = fold(row.dataset['search'] ?? '');
          const matches = query === '' || haystack.includes(query);
          row.hidden = !matches;
          if (matches) visible += 1;
        }
        if (empty instanceof HTMLElement) empty.hidden = visible > 0;
      });
    }

    this.#applyPins();
  }

  #togglePin(slug: string): void {
    if (slug === '') return;
    this.#pins = this.#pins.includes(slug)
      ? this.#pins.filter((entry) => entry !== slug)
      : [...this.#pins, slug].slice(0, MAX_PINS);
    writeStoredJson(STORAGE_KEY, this.#pins);
    this.#applyPins();
  }

  /**
   * Pinned cities move to the top by CSS order rather than by moving DOM nodes,
   * so the reading order a screen reader follows stays the visual order.
   */
  #applyPins(): void {
    for (const row of this.#rows) {
      const slug = row.dataset['city'] ?? '';
      const pinned = this.#pins.includes(slug);
      row.style.order = pinned ? '0' : '1';
      row.dataset['pinned'] = String(pinned);

      const button = row.querySelector('[data-role="pin"]');
      if (button instanceof HTMLButtonElement) {
        button.setAttribute('aria-pressed', String(pinned));
        const label = pinned ? this.dataset['unpinLabel'] : this.dataset['pinLabel'];
        if (label !== undefined) button.setAttribute('aria-label', `${label}: ${slug}`);
      }
    }
  }
}

if (!customElements.get('world-clock')) {
  customElements.define('world-clock', WorldClock);
}
