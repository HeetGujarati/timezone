import { getOffsetMinutes, getZoneAbbreviation, formatOffsetShort } from '~/lib/time/offset.ts';
import { findDstTransitions } from '~/lib/time/dst.ts';
import { isKnownZone, toDisplayZone } from '~/data/zones.ts';
import { formatDate, formatTime, readFormatContext } from './lib/format.ts';
import { readParam, syncUrl } from './lib/params.ts';
import { describeDifferenceFrom } from './lib/difference.ts';

/**
 * Difference between two zones, and the dates that difference changes.
 *
 * The changes list is the part worth having: "New York is 5 hours behind London" is
 * only true for about ten months of the year, and the two weeks it is wrong are
 * exactly the weeks people schedule things badly.
 */
class ZoneDifference extends HTMLElement {
  #from!: HTMLSelectElement;
  #to!: HTMLSelectElement;
  #timer: number | undefined;

  connectedCallback(): void {
    const from = this.querySelector('[data-role="from"]');
    const to = this.querySelector('[data-role="to"]');
    if (!(from instanceof HTMLSelectElement) || !(to instanceof HTMLSelectElement)) return;

    this.#from = from;
    this.#to = to;
    this.#applyUrlState();

    for (const control of [from, to]) {
      control.addEventListener('change', () => this.#update());
    }

    const swap = this.querySelector('[data-role="swap"]');
    if (swap instanceof HTMLButtonElement) {
      swap.hidden = false;
      swap.addEventListener('click', () => {
        const previous = this.#from.value;
        this.#from.value = this.#to.value;
        this.#to.value = previous;
        this.#update();
      });
    }

    this.#update();
    this.#timer = window.setInterval(() => this.#renderClocks(), 1000);
  }

  disconnectedCallback(): void {
    if (this.#timer !== undefined) window.clearInterval(this.#timer);
  }

  #applyUrlState(): void {
    const params = new URLSearchParams(window.location.search);
    for (const [key, select] of [
      ['from', this.#from],
      ['to', this.#to],
    ] as const) {
      const raw = readParam(params, key);
      const resolved = raw !== null && isKnownZone(raw) ? toDisplayZone(raw) : null;
      if (resolved !== null) select.value = resolved;
    }
  }

  #update(): void {
    const fromZone = this.#from.value;
    const toZone = this.#to.value;
    if (!isKnownZone(fromZone) || !isKnownZone(toZone)) return;

    this.#renderClocks();
    this.#renderChanges(fromZone, toZone);
    syncUrl({ from: fromZone, to: toZone });
  }

  #renderClocks(): void {
    const context = readFormatContext(this);
    const now = Date.now();
    const fromZone = this.#from.value;
    const toZone = this.#to.value;
    if (!isKnownZone(fromZone) || !isKnownZone(toZone)) return;

    const difference = getOffsetMinutes(toZone, now) - getOffsetMinutes(fromZone, now);

    this.#set('headline', describeDifferenceFrom(this, difference, context.locale));
    this.#set('from-time', formatTime(now, fromZone, context));
    this.#set('from-date', formatDate(now, fromZone, context));
    this.#set(
      'from-zone',
      `${getZoneAbbreviation(fromZone, now)} \u00b7 ${formatOffsetShort(getOffsetMinutes(fromZone, now))}`,
    );
    this.#set('to-time', formatTime(now, toZone, context));
    this.#set('to-date', formatDate(now, toZone, context));
    this.#set(
      'to-zone',
      `${getZoneAbbreviation(toZone, now)} \u00b7 ${formatOffsetShort(getOffsetMinutes(toZone, now))}`,
    );
  }

  /**
   * Every date in the next twelve months where the gap between the two zones
   * changes, because one of them shifts and the other does not.
   */
  #renderChanges(fromZone: string, toZone: string): void {
    const list = this.querySelector('[data-role="changes"]');
    const empty = this.querySelector('[data-role="changes-empty"]');
    if (!(list instanceof HTMLElement)) return;

    const context = readFormatContext(this);
    const now = Date.now();
    const year = new Date(now).getUTCFullYear();

    const instants = [year, year + 1]
      .flatMap((y) => [
        ...findDstTransitions(fromZone, y).map((t) => t.instant),
        ...findDstTransitions(toZone, y).map((t) => t.instant),
      ])
      .filter((instant) => instant > now)
      .sort((a, b) => a - b);

    const rows: HTMLElement[] = [];
    let previous = getOffsetMinutes(toZone, now) - getOffsetMinutes(fromZone, now);

    for (const instant of instants) {
      const difference = getOffsetMinutes(toZone, instant) - getOffsetMinutes(fromZone, instant);
      if (difference === previous) continue;
      previous = difference;

      const item = document.createElement('li');
      item.className =
        'flex flex-wrap justify-between gap-2 border-b border-[var(--color-rule)] py-2';

      const when = document.createElement('span');
      when.className = 'tabular';
      when.textContent = formatDate(instant, fromZone, context);

      const what = document.createElement('span');
      what.className = 'text-[var(--color-text-muted)]';
      what.textContent = describeDifferenceFrom(this, difference, context.locale);

      item.append(when, what);
      rows.push(item);
      if (rows.length >= 6) break;
    }

    list.replaceChildren(...rows);
    if (empty instanceof HTMLElement) empty.hidden = rows.length > 0;
  }

  #set(role: string, value: string): void {
    const target = this.querySelector(`[data-out="${role}"]`);
    if (target instanceof HTMLElement) target.textContent = value;
  }
}

if (!customElements.get('zone-difference')) {
  customElements.define('zone-difference', ZoneDifference);
}
