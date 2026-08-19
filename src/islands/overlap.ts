import {
  getWorkingHoursOverlap,
  nearestWorkableWindows,
  type ZoneWorkingHours,
} from '~/lib/time/overlap.ts';
import { isKnownZone, toDisplayZone } from '~/data/zones.ts';
import { formatTime, readFormatContext } from './lib/format.ts';
import { parseIntParam, readParam, syncUrl } from './lib/params.ts';

/**
 * Working-hours overlap for a distributed team.
 *
 * Where the meeting planner shows the whole day as a shape, this answers the
 * narrower question precisely: which minutes, and what does that look like on each
 * person's clock. When the answer is "none", it says so and offers the nearest
 * workable windows instead of shading in a compromise nobody agreed to.
 */

const MAX_ZONES = 8;
const MIN_ZONES = 2;

function labelFor(timeZone: string): string {
  const parts = timeZone.split('/');
  return (parts[parts.length - 1] ?? timeZone).replaceAll('_', ' ');
}

class OverlapFinder extends HTMLElement {
  #zones: string[] = [];
  #startHour = 9;
  #endHour = 18;

  #list!: HTMLElement;
  #results!: HTMLElement;

  connectedCallback(): void {
    const list = this.querySelector('[data-role="zone-list"]');
    const results = this.querySelector('[data-role="results"]');
    const adder = this.querySelector('[data-role="add-zone"]');

    if (
      !(list instanceof HTMLElement) ||
      !(results instanceof HTMLElement) ||
      !(adder instanceof HTMLSelectElement)
    ) {
      return;
    }

    this.#list = list;
    this.#results = results;
    this.#zones = this.#initialZones();
    this.#readHours();

    adder.addEventListener('change', () => {
      const chosen = toDisplayZone(adder.value);
      if (chosen !== null && !this.#zones.includes(chosen) && this.#zones.length < MAX_ZONES) {
        this.#zones.push(chosen);
        this.#render();
      }
      adder.selectedIndex = 0;
    });

    for (const control of this.querySelectorAll(
      '[data-role="start-hour"], [data-role="end-hour"]',
    )) {
      control.addEventListener('change', () => {
        this.#readHours();
        this.#render();
      });
    }

    this.#render();
  }

  #initialZones(): string[] {
    const fromUrl = (readParam(new URLSearchParams(window.location.search), 'zones') ?? '')
      .split(',')
      .map((entry) => toDisplayZone(entry.trim()))
      .filter((entry): entry is string => entry !== null);

    if (fromUrl.length >= MIN_ZONES) return fromUrl.slice(0, MAX_ZONES);

    return [...this.querySelectorAll('[data-zone]')]
      .map((element) => (element instanceof HTMLElement ? (element.dataset['zone'] ?? '') : ''))
      .filter(isKnownZone);
  }

  #readHours(): void {
    const start = this.querySelector('[data-role="start-hour"]');
    const end = this.querySelector('[data-role="end-hour"]');
    if (start instanceof HTMLSelectElement)
      this.#startHour = parseIntParam(start.value, 0, 23) ?? 9;
    if (end instanceof HTMLSelectElement) this.#endHour = parseIntParam(end.value, 1, 24) ?? 18;
  }

  #dayStart(): number {
    const now = new Date();
    return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  }

  #render(): void {
    const context = readFormatContext(this);
    const zones: ZoneWorkingHours[] = this.#zones.map((timeZone) => ({
      timeZone,
      startHour: this.#startHour,
      endHour: this.#endHour,
    }));

    const start = this.#dayStart();
    const result = getWorkingHoursOverlap(zones, start);

    this.#renderZoneList();
    syncUrl({
      zones: this.#zones.join(','),
      start: String(this.#startHour),
      end: String(this.#endHour),
    });

    const heading = document.createElement('p');
    heading.className = 'text-[length:var(--text-sm)] text-[var(--color-text-muted)]';

    if (result.none) {
      heading.textContent = this.dataset['noneLabel'] ?? 'No shared working hours.';
      const nearest = nearestWorkableWindows(zones, start).slice(0, 3);
      const list = document.createElement('ul');
      list.className = 'mt-3 space-y-2 text-[length:var(--text-sm)]';

      for (const window of nearest) {
        const item = document.createElement('li');
        item.className = 'border-b border-[var(--color-rule)] pb-2';
        const times = this.#zones
          .map((zone) => `${labelFor(zone)} ${formatTime(window.start, zone, context)}`)
          .join(' \u00b7 ');
        item.textContent = times;
        list.append(item);
      }

      this.#results.replaceChildren(heading, list);
      return;
    }

    heading.textContent = `${result.totalMinutes} ${this.dataset['minutesLabel'] ?? 'minutes'}`;

    const list = document.createElement('ul');
    list.className = 'mt-3 space-y-3';

    for (const window of result.windows) {
      const item = document.createElement('li');
      item.className = 'rounded-[var(--radius-md)] border border-[var(--color-rule)] p-3';

      const duration = document.createElement('p');
      duration.className = 'text-[length:var(--text-sm)] font-semibold';
      duration.textContent = `${Math.floor(window.durationMinutes / 60)}h ${window.durationMinutes % 60}m`;
      item.append(duration);

      const perZone = document.createElement('dl');
      perZone.className = 'mt-2 grid gap-1 text-[length:var(--text-sm)] sm:grid-cols-2';

      for (const zone of this.#zones) {
        const row = document.createElement('div');
        row.className = 'flex justify-between gap-3';

        const name = document.createElement('dt');
        name.className = 'text-[var(--color-text-muted)]';
        name.textContent = labelFor(zone);

        const value = document.createElement('dd');
        value.className = 'tabular';
        value.textContent = `${formatTime(window.start, zone, context)}\u2013${formatTime(window.end, zone, context)}`;

        row.append(name, value);
        perZone.append(row);
      }

      item.append(perZone);
      list.append(item);
    }

    this.#results.replaceChildren(heading, list);
  }

  #renderZoneList(): void {
    const removeLabel = this.dataset['removeLabel'] ?? 'Remove';

    this.#list.replaceChildren(
      ...this.#zones.map((timeZone) => {
        const item = document.createElement('li');
        item.className =
          'flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-rule)] px-2 py-1 text-[length:var(--text-sm)]';
        item.dataset['zone'] = timeZone;

        const label = document.createElement('span');
        label.textContent = labelFor(timeZone);
        item.append(label);

        if (this.#zones.length > MIN_ZONES) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'text-[var(--color-text-muted)] hover:text-[var(--color-signal)]';
          button.setAttribute('aria-label', `${removeLabel} ${labelFor(timeZone)}`);
          button.textContent = '\u00d7';
          button.addEventListener('click', () => {
            this.#zones = this.#zones.filter((entry) => entry !== timeZone);
            this.#render();
          });
          item.append(button);
        }

        return item;
      }),
    );
  }
}

if (!customElements.get('overlap-finder')) {
  customElements.define('overlap-finder', OverlapFinder);
}
