import { toZonedDateTime } from '~/lib/time/offset.ts';
import { convertWallTime } from '~/lib/time/convert.ts';
import { getZoneAbbreviation, formatOffsetShort } from '~/lib/time/offset.ts';
import { InvalidLocalTimeError } from '~/lib/time/parse.ts';
import { isKnownZone, toDisplayZone } from '~/data/zones.ts';
import {
  readFormatContext,
  formatDate,
  formatTime,
  toDateInputValue,
  toTimeInputValue,
} from './lib/format.ts';
import { parseDateParam, parseTimeParam, readParam, syncUrl } from './lib/params.ts';
import { describeDifferenceFrom } from './lib/difference.ts';

/**
 * The time zone converter.
 *
 * Everything it needs is already in the prerendered HTML — the selects carry every
 * zone, the labels and the notes are server-rendered strings. This element only
 * wires up behaviour, so the page is meaningful before it runs and merely inert.
 *
 * Nothing is ever assigned as HTML. Every value reaches the DOM through
 * `textContent`, which is why the CSP can stay at `script-src 'self'` with no
 * escape hatch.
 */
class TimeConverter extends HTMLElement {
  #from!: HTMLSelectElement;
  #to!: HTMLSelectElement;
  #date!: HTMLInputElement;
  #time!: HTMLInputElement;
  #output!: HTMLElement;
  #note!: HTMLElement;
  #error!: HTMLElement;

  connectedCallback(): void {
    const from = this.querySelector('[data-role="from"]');
    const to = this.querySelector('[data-role="to"]');
    const date = this.querySelector('[data-role="date"]');
    const time = this.querySelector('[data-role="time"]');
    const output = this.querySelector('[data-role="output"]');
    const note = this.querySelector('[data-role="note"]');
    const error = this.querySelector('[data-role="error"]');

    if (
      !(from instanceof HTMLSelectElement) ||
      !(to instanceof HTMLSelectElement) ||
      !(date instanceof HTMLInputElement) ||
      !(time instanceof HTMLInputElement) ||
      !(output instanceof HTMLElement) ||
      !(note instanceof HTMLElement) ||
      !(error instanceof HTMLElement)
    ) {
      return;
    }

    this.#from = from;
    this.#to = to;
    this.#date = date;
    this.#time = time;
    this.#output = output;
    this.#note = note;
    this.#error = error;

    this.#applyUrlState();
    this.#fillNowIfEmpty();

    for (const control of [from, to, date, time]) {
      control.addEventListener('change', () => this.#update());
      control.addEventListener('input', () => this.#update());
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

    const nowButton = this.querySelector('[data-role="now"]');
    if (nowButton instanceof HTMLButtonElement) {
      nowButton.hidden = false;
      nowButton.addEventListener('click', () => {
        this.#fillNow();
        this.#update();
      });
    }

    this.#update();
  }

  /** Prefill from ?from=&to=&date=&time=, rejecting anything unrecognised. */
  #applyUrlState(): void {
    const params = new URLSearchParams(window.location.search);

    const from = readParam(params, 'from');
    const resolvedFrom = from !== null && isKnownZone(from) ? toDisplayZone(from) : null;
    if (resolvedFrom !== null) this.#from.value = resolvedFrom;

    const to = readParam(params, 'to');
    const resolvedTo = to !== null && isKnownZone(to) ? toDisplayZone(to) : null;
    if (resolvedTo !== null) this.#to.value = resolvedTo;

    const date = parseDateParam(readParam(params, 'date'));
    if (date !== null) this.#date.value = date;

    const time = parseTimeParam(readParam(params, 'time'));
    if (time !== null) this.#time.value = time;
  }

  #fillNowIfEmpty(): void {
    if (this.#date.value === '' || this.#time.value === '') this.#fillNow();
  }

  #fillNow(): void {
    const zoned = toZonedDateTime(Date.now(), this.#from.value);
    this.#date.value = toDateInputValue(zoned);
    this.#time.value = toTimeInputValue(zoned);
  }

  #update(): void {
    const context = readFormatContext(this);
    const fromZone = this.#from.value;
    const toZone = this.#to.value;

    if (!isKnownZone(fromZone) || !isKnownZone(toZone)) return;

    try {
      const result = convertWallTime(this.#date.value, this.#time.value, fromZone, toZone);

      this.#error.textContent = '';
      this.#error.hidden = true;

      const timeText = formatTime(result.instant, toZone, context);
      const dateText = formatDate(result.instant, toZone, context);
      const abbreviation = getZoneAbbreviation(toZone, result.instant);
      const offset = formatOffsetShort(result.to.offsetMinutes);

      this.#setOutput({
        time: timeText,
        date: dateText,
        zone: `${abbreviation} · ${offset}`,
        difference: describeDifferenceFrom(this, result.differenceMinutes, context.locale),
      });

      const noteKey =
        result.resolution === 'gap-shifted'
          ? 'gap'
          : result.resolution === 'ambiguous-earlier'
            ? 'ambiguous'
            : null;
      this.#setNote(noteKey, result.shiftedByMinutes);

      syncUrl({ from: fromZone, to: toZone, date: this.#date.value, time: this.#time.value });
    } catch (thrown) {
      const message =
        thrown instanceof InvalidLocalTimeError
          ? thrown.message
          : (this.dataset['errorGeneric'] ?? 'That input could not be read.');
      this.#error.textContent = message;
      this.#error.hidden = false;
    }
  }

  #setOutput(values: { time: string; date: string; zone: string; difference: string }): void {
    for (const [role, value] of Object.entries(values)) {
      const target = this.#output.querySelector(`[data-out="${role}"]`);
      if (target instanceof HTMLElement) target.textContent = value;
    }
  }

  /**
   * The gap and ambiguity notes are server-rendered into the page in the reader's
   * language and simply revealed, so this island ships no translated strings.
   */
  #setNote(kind: 'gap' | 'ambiguous' | null, shiftedByMinutes: number): void {
    for (const element of this.#note.querySelectorAll('[data-note]')) {
      if (element instanceof HTMLElement) element.hidden = element.dataset['note'] !== kind;
    }
    this.#note.hidden = kind === null;

    const minutes = this.#note.querySelector('[data-note-minutes]');
    if (minutes instanceof HTMLElement && shiftedByMinutes > 0) {
      minutes.textContent = String(shiftedByMinutes);
    }
  }
}

if (!customElements.get('time-converter')) {
  customElements.define('time-converter', TimeConverter);
}
