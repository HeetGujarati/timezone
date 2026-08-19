import { buildBand, overlapColumns, type BandRow } from '~/lib/time/band.ts';
import { formatOffsetShort } from '~/lib/time/offset.ts';
import { isKnownZone, toDisplayZone } from '~/data/zones.ts';
import { readFormatContext, formatTime } from './lib/format.ts';
import { parseDateParam, parseIntParam, readParam, readStoredJson, syncUrl, writeStoredJson } from './lib/params.ts';

/**
 * The meeting planner.
 *
 * The band is rebuilt with `createElement` — never by assigning a string of HTML —
 * so a zone label can never become markup. Zone identifiers are validated against
 * the IANA list before they are used, whether they arrived from the URL, from
 * localStorage, or from the select.
 */

const STORAGE_KEY = 'meridiem-planner-zones';
const MAX_ZONES = 10;
const MIN_ZONES = 2;
const HOUR_MS = 3_600_000;

function labelFor(timeZone: string): string {
  const parts = timeZone.split('/');
  return (parts[parts.length - 1] ?? timeZone).replaceAll('_', ' ');
}

function validateStoredZones(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const zones = value.filter((entry): entry is string => typeof entry === 'string' && isKnownZone(entry));
  return zones.length >= MIN_ZONES ? zones.slice(0, MAX_ZONES) : null;
}

class MeetingPlanner extends HTMLElement {
  #zones: string[] = [];
  #workStart = 9;
  #workEnd = 18;
  #startInstant = Date.now();

  #grid!: HTMLElement;
  #summary!: HTMLElement;
  #zoneList!: HTMLElement;
  #adder!: HTMLSelectElement;
  #dateInput!: HTMLInputElement;

  connectedCallback(): void {
    const grid = this.querySelector('[data-role="grid"]');
    const summary = this.querySelector('[data-role="summary"]');
    const zoneList = this.querySelector('[data-role="zone-list"]');
    const adder = this.querySelector('[data-role="add-zone"]');
    const dateInput = this.querySelector('[data-role="date"]');

    if (
      !(grid instanceof HTMLElement) ||
      !(summary instanceof HTMLElement) ||
      !(zoneList instanceof HTMLElement) ||
      !(adder instanceof HTMLSelectElement) ||
      !(dateInput instanceof HTMLInputElement)
    ) {
      return;
    }

    this.#grid = grid;
    this.#summary = summary;
    this.#zoneList = zoneList;
    this.#adder = adder;
    this.#dateInput = dateInput;

    this.#zones = this.#initialZones();
    this.#readWorkingHours();
    this.#startInstant = this.#dayStart(this.#initialDate());
    this.#dateInput.value = new Date(this.#startInstant).toISOString().slice(0, 10);

    adder.addEventListener('change', () => {
      const chosen = toDisplayZone(adder.value);
      if (chosen !== null && this.#zones.length < MAX_ZONES && !this.#zones.includes(chosen)) {
        this.#zones.push(chosen);
        this.#persist();
        this.#render();
      }
      adder.selectedIndex = 0;
    });

    dateInput.addEventListener('change', () => {
      this.#startInstant = this.#dayStart(parseDateParam(dateInput.value) ?? this.#todayIso());
      this.#persist();
      this.#render();
    });

    for (const control of this.querySelectorAll('[data-role="work-start"], [data-role="work-end"]')) {
      control.addEventListener('change', () => {
        this.#readWorkingHours();
        this.#persist();
        this.#render();
      });
    }

    this.#render();
  }

  #todayIso(): string {
    return new Date().toISOString().slice(0, 10);
  }

  #initialDate(): string {
    const fromUrl = parseDateParam(readParam(new URLSearchParams(window.location.search), 'date'));
    return fromUrl ?? this.#todayIso();
  }

  /** Midnight UTC of the chosen day: the band's columns are instants, not local hours. */
  #dayStart(isoDate: string): number {
    return Date.parse(`${isoDate}T00:00:00Z`);
  }

  #initialZones(): string[] {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = (readParam(params, 'zones') ?? '')
      .split(',')
      .map((entry) => toDisplayZone(entry.trim()))
      .filter((entry): entry is string => entry !== null);

    if (fromUrl.length >= MIN_ZONES) return fromUrl.slice(0, MAX_ZONES);

    const stored = readStoredJson(STORAGE_KEY, validateStoredZones);
    if (stored !== null) return stored;

    return [...this.querySelectorAll('[data-zone]')]
      .map((element) => (element instanceof HTMLElement ? (element.dataset['zone'] ?? '') : ''))
      .filter(isKnownZone);
  }

  #readWorkingHours(): void {
    const start = this.querySelector('[data-role="work-start"]');
    const end = this.querySelector('[data-role="work-end"]');
    if (start instanceof HTMLSelectElement) {
      this.#workStart = parseIntParam(start.value, 0, 23) ?? 9;
    }
    if (end instanceof HTMLSelectElement) {
      this.#workEnd = parseIntParam(end.value, 1, 24) ?? 18;
    }
  }

  #persist(): void {
    writeStoredJson(STORAGE_KEY, this.#zones);
    syncUrl({
      zones: this.#zones.join(','),
      date: this.#dateInput.value,
      start: String(this.#workStart),
      end: String(this.#workEnd),
    });
  }

  #render(): void {
    const context = readFormatContext(this);
    const rows = buildBand(
      this.#zones.map((timeZone) => ({ timeZone, label: labelFor(timeZone) })),
      this.#startInstant,
      this.#workStart,
      this.#workEnd,
    );

    this.#grid.replaceChildren(...rows.map((row) => this.#renderRow(row, context.locale, context.hourCycle)));
    this.#renderZoneList();
    this.#renderSummary(rows, context);
  }

  #renderRow(row: BandRow, locale: string, hourCycle: 'h12' | 'h23'): HTMLElement {
    const wrapper = document.createElement('tr');
    wrapper.className = 'border-b border-[var(--color-rule)]';

    const header = document.createElement('th');
    header.scope = 'row';
    header.className = 'sticky start-0 z-10 bg-[var(--color-surface-raised)] py-1 pe-3 text-start font-normal whitespace-nowrap';

    const name = document.createElement('span');
    name.className = 'block text-[length:var(--text-sm)]';
    name.textContent = row.label;

    const offset = document.createElement('span');
    offset.className = 'tabular block text-[length:var(--text-2xs)] text-[var(--color-text-muted)]';
    offset.textContent = formatOffsetShort(row.offsetMinutes);

    header.append(name, offset);
    wrapper.append(header);

    for (const cell of row.cells) {
      const td = document.createElement('td');
      td.className = `tabular border-s border-[var(--color-rule)] px-1 py-1 text-center text-[length:var(--text-2xs)] ${this.#cellClass(cell.state)}`;
      td.textContent = formatTime(cell.instant, row.timeZone, { locale, hourCycle });
      if (cell.dayDelta !== 0) {
        td.title = `${cell.dayDelta > 0 ? '+' : ''}${cell.dayDelta} day`;
      }
      wrapper.append(td);
    }

    return wrapper;
  }

  #cellClass(state: 'working' | 'fringe' | 'asleep'): string {
    if (state === 'working') {
      return 'bg-[var(--color-band-working)] border-t-2 border-t-[var(--color-accent)]';
    }
    if (state === 'fringe') return 'bg-[var(--color-band-fringe)]';
    return 'bg-[var(--color-band-asleep)]';
  }

  #renderZoneList(): void {
    const removeLabel = this.dataset['removeLabel'] ?? 'Remove';

    this.#zoneList.replaceChildren(
      ...this.#zones.map((timeZone) => {
        const item = document.createElement('li');
        item.className =
          'flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-rule)] px-2 py-1 text-[length:var(--text-sm)]';

        const label = document.createElement('span');
        label.textContent = labelFor(timeZone);
        item.append(label);

        if (this.#zones.length > MIN_ZONES) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'text-[var(--color-text-muted)] hover:text-[var(--color-signal)]';
          button.setAttribute('aria-label', `${removeLabel} ${labelFor(timeZone)}`);
          button.textContent = '×';
          button.addEventListener('click', () => {
            this.#zones = this.#zones.filter((entry) => entry !== timeZone);
            this.#persist();
            this.#render();
          });
          item.append(button);
        }

        return item;
      }),
    );
  }

  #renderSummary(rows: BandRow[], context: { locale: string; hourCycle: 'h12' | 'h23' }): void {
    const columns = overlapColumns(rows);
    const noOverlap = this.#summary.querySelector('[data-summary="none"]');
    const hasOverlap = this.#summary.querySelector('[data-summary="window"]');

    if (noOverlap instanceof HTMLElement) noOverlap.hidden = columns.length > 0;
    if (!(hasOverlap instanceof HTMLElement)) return;

    hasOverlap.hidden = columns.length === 0;
    const first = columns[0];
    const last = columns[columns.length - 1];
    if (first === undefined || last === undefined) return;

    const startInstant = this.#startInstant + first * HOUR_MS;
    const endInstant = this.#startInstant + (last + 1) * HOUR_MS;
    const reference = rows[0];
    if (reference === undefined) return;

    const hoursTarget = hasOverlap.querySelector('[data-summary-hours]');
    if (hoursTarget instanceof HTMLElement) hoursTarget.textContent = String(columns.length);

    const rangeTarget = hasOverlap.querySelector('[data-summary-range]');
    if (rangeTarget instanceof HTMLElement) {
      const from = formatTime(startInstant, reference.timeZone, context);
      const to = formatTime(endInstant, reference.timeZone, context);
      rangeTarget.textContent = `${from}–${to} ${labelFor(reference.timeZone)}`;
    }
  }
}

if (!customElements.get('meeting-planner')) {
  customElements.define('meeting-planner', MeetingPlanner);
}
