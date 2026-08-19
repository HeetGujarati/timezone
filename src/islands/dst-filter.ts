/**
 * Filters the daylight-saving table that is already in the page.
 *
 * Nothing is fetched or built — every row is prerendered and indexable, and this
 * only hides the ones that do not match. A reader with JavaScript disabled sees the
 * complete table, which is the right trade for a page whose value is the data.
 */

/** Fold accents so "sao paulo" finds "São Paulo". */
function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

class DstFilter extends HTMLElement {
  connectedCallback(): void {
    const input = document.querySelector('[data-role="filter"]');
    const empty = document.querySelector('[data-role="empty"]');
    if (!(input instanceof HTMLInputElement)) return;

    const rows = [...document.querySelectorAll('[data-search]')].filter(
      (element): element is HTMLElement => element instanceof HTMLElement,
    );

    input.addEventListener('input', () => {
      const query = fold(input.value.trim());
      let visible = 0;

      for (const row of rows) {
        const matches = query === '' || fold(row.dataset['search'] ?? '').includes(query);
        row.hidden = !matches;
        if (matches) visible += 1;
      }

      if (empty instanceof HTMLElement) empty.hidden = visible > 0;
    });
  }
}

if (!customElements.get('dst-filter')) {
  customElements.define('dst-filter', DstFilter);
}

// The table markup is plain HTML, so mount the behaviour on a marker element the
// page does not need to know about.
if (document.querySelector('[data-role="filter"]') !== null) {
  const marker = document.createElement('dst-filter');
  marker.hidden = true;
  document.body.append(marker);
}
